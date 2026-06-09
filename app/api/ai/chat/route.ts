import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { services } from "@/lib/services";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

const SYSTEM_INFO = `
Ти — AI-помічник сервісного центру Tirnew Truck Service. Відповідай тільки українською мовою.
Ти — професійний адміністратор сервісу. Ніколи не вигадуй дані.

Про сервіс:
- Назва: Tirnew Truck Service
- Адреса: Рівненська обл., с. Велика Омеляна, вул. Шевченка 35
- Телефон: +38 (066) 418-88-26
- Графік роботи: Понеділок–Субота, 08:00–18:00, неділя — вихідний
- Спеціалізація: ремонт і обслуговування вантажних автомобілів, причепів, напівпричепів, легкових авто

Послуги сервісу (список):
${services.map((s) => `- ${s.title} (${s.vehicleType === "truck" ? "вантажні/ТІР" : "легкові"}): ${s.price || "уточнюйте"}`).join("\n")}

Правила:
1. Якщо запитують про запис, перегляд записів чи історію ремонтів — перевір контекст авторизації.
2. Ніколи не згадуй чужі дані.
3. Якщо не знаєш точної відповіді — чесно скажи про це і запропонуй зателефонувати.
4. Для запису уточнюй: тип авто, марку/модель, послугу/проблему, бажану дату.
5. Остаточний діагноз можливий лише після огляду — завжди це підкреслюй при діагностиці.
`;

async function getClientFromRequest(req: NextRequest) {
  const token = req.cookies.get("client_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;
    const client = await prisma.client.findUnique({
      where: { email },
      include: { bookings: { orderBy: { scheduledAt: "desc" }, take: 10 } },
    });
    return client;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: { role: string; content: string }[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const client = await getClientFromRequest(req);

    // Контекст авторизованого користувача
    let userContext = "";
    if (client) {
      const activeBookings = client.bookings.filter((b) => b.status !== "cancelled" && b.status !== "done");
      const doneBookings = client.bookings.filter((b) => b.status === "done");
      userContext = `\n\nПОТОЧНИЙ АВТОРИЗОВАНИЙ КОРИСТУВАЧ:\n- Email: ${client.email}\n- Ім'я: ${client.name || "не вказано"}\n- Активні записи (${activeBookings.length}): ${activeBookings.length === 0 ? "немає" : activeBookings.map((b) => `#${b.id} — ${b.service || "послуга"}, авто: ${b.carBrand || ""} ${b.carModel || ""}, час: ${b.scheduledAt ? new Date(b.scheduledAt).toLocaleString("uk-UA") : "не вказано"}, статус: ${b.status}`).join("; ")}\n- Виконані ремонти (${doneBookings.length}): ${doneBookings.length === 0 ? "немає" : doneBookings.slice(0, 5).map((b) => `${b.service || "послуга"} (${b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString("uk-UA") : "дата невідома"})`).join("; ")}\n`;
    } else {
      userContext = "\n\nКОРИСТУВАЧ НЕ АВТОРИЗОВАНИЙ. Якщо запитує про свої записи або історію — запропонуй увійти в кабінет на /cabinet";
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Якщо немає ключа OpenAI — використовуємо вбудований rule-based режим
    if (!apiKey) {
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      const reply = getRuleBasedReply(lastMsg, client);
      return NextResponse.json({ reply });
    }

    // OpenAI режим
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_INFO + userContext },
          ...messages.slice(-12),
        ],
        max_tokens: 600,
        temperature: 0.5,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[AI CHAT] OpenAI error:", res.status, err);
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      return NextResponse.json({ reply: getRuleBasedReply(lastMsg, client) });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Вибачте, не зміг відповісти. Спробуйте ще раз.";
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("[AI CHAT ERROR]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Rule-based fallback коли немає API ключа
function getRuleBasedReply(msg: string, client: { name?: string | null; email: string; bookings: { id: number; service?: string | null; scheduledAt?: Date | null; status?: string | null; carBrand?: string | null; carModel?: string | null }[] } | null): string {
  if (msg.includes("привіт") || msg.includes("здравств") || msg.includes("добрий")) {
    return client
      ? "Привіт! 👋 Радий бачити вас знову. Чим можу допомогти?"
      : "Привіт! 👋 Я AI-помічник Tirnew Truck Service. Чим можу допомогти?";
  }
  if (msg.includes("запис") || msg.includes("записат")) {
    if (!client) return "Для запису на ремонт, будь ласка, увійдіть у свій кабінет: /cabinet — або зателефонуйте нам: +38 (066) 418-88-26";
    const active = client.bookings.filter((b) => b.status !== "cancelled" && b.status !== "done");
    if (active.length === 0) return "У вас немає активних записів. Хочете записатися? Перейдіть на /booking або натисніть \"Записатися\".";
    return `Ваші активні записи:\n${active.map((b) => `• ${b.service || "Послуга"} — ${b.scheduledAt ? new Date(b.scheduledAt).toLocaleString("uk-UA") : "час не вказано"}`).join("\n")}`;
  }
  if (msg.includes("ціна") || msg.includes("прайс") || msg.includes("вартість") || msg.includes("скільки")) {
    return "Актуальні ціни на всі послуги можна переглянути на сторінці /price. Також можу відповісти на конкретне питання про вартість певної послуги.";
  }
  if (msg.includes("послуг") || msg.includes("сервіс") || msg.includes("ремонт")) {
    return "Ми виконуємо повний цикл ремонту:\n• Ремонт двигунів та КПП\n• Гальмівна система (KNORR, WABCO)\n• Пневмосистеми\n• Електрика та діагностика\n• ТО причепів і напівпричепів\n\nПовний перелік — на сторінці /services";
  }
  if (msg.includes("контакт") || msg.includes("телефон") || msg.includes("адрес")) {
    return "📍 Адреса: Рівненська обл., с. Велика Омеляна, вул. Шевченка 35\n📞 Телефон: +38 (066) 418-88-26\n⏰ Графік: Пн–Сб, 08:00–18:00";
  }
  if (msg.includes("графік") || msg.includes("час роботи") || msg.includes("коли працює")) {
    return "⏰ Ми працюємо:\nПонеділок–Субота: 08:00–18:00\nНеділя: вихідний";
  }
  if (msg.includes("abs") || msg.includes("гальм") || msg.includes("підвіска") || msg.includes("двигун") || msg.includes("кпп")) {
    return "Дякую за опис проблеми. Я можу запропонувати можливі причини, але остаточний діагноз можливий лише після огляду автомобіля майстром.\n\nРекомендую записатися на діагностику. Перейдіть на /booking або зателефонуйте: +38 (066) 418-88-26";
  }
  if (msg.includes("історія") || msg.includes("ремонтів")) {
    if (!client) return "Для перегляду історії ремонтів увійдіть у свій кабінет: /cabinet";
    const done = client.bookings.filter((b) => b.status === "done");
    if (done.length === 0) return "У вас поки немає завершених ремонтів в системі.";
    return `Ваші останні ремонти:\n${done.slice(0, 5).map((b) => `• ${b.service || "Послуга"} — ${b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString("uk-UA") : "дата невідома"}`).join("\n")}`;
  }
  return "Дякую за звернення! Я AI-помічник Tirnew Truck Service.\n\nМожу допомогти з:\n• Вибором послуги\n• Записом на ремонт\n• Інформацією про ціни\n• Контактами та графіком\n\nАбо зателефонуйте нам: +38 (066) 418-88-26";
}
