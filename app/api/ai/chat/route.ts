import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

type ClientBookingLite = {
  id: string;
  service?: string | null;
  scheduledAt?: Date | null;
  status?: string | null;
  carBrand?: string | null;
  carModel?: string | null;
};

type ClientLite = {
  name?: string | null;
  phone?: string | null;
  email: string;
  bookings: ClientBookingLite[];
};

const BASE_INFO = `
Ти — AI-помічник сервісного центру Tirnew Truck Service. Відповідай тільки українською мовою.
Ти — професійний адміністратор сервісу. Ніколи не вигадуй дані.

Про сервіс:
- Назва: Tirnew Truck Service
- Адреса: Рівненська обл., с. Велика Омеляна, вул. Шевченка 35
- Телефон: +38 (066) 418-88-26
- Графік роботи: Понеділок–Субота, 08:00–18:00, неділя — вихідний
- Спеціалізація: ремонт і обслуговування вантажних автомобілів, причепів, напівпричепів, легкових авто

ФУНКЦІЯ ЗАПИСУ:
Ти МОЖЕШ безпосередньо записати клієнта на послугу — не тільки перенаправляти на /booking.
Коли клієнт хоче записатися — збери через діалог (запитуй природно, БЕЗ технічних назв полів):
1. Яку послугу потрібно виконати
2. Марка та модель автомобіля
3. Бажана дата і час
4. Якщо клієнт НЕ авторизований — збери по порядку (не всі відразу):
   a) Ім'я
   b) Номер телефону
   c) Е-мейл — ОБОВ'ЯЗКОВО! Пояснюй: "Будь ласка, вкажіть ваш email — це потрібно щоб надіслати підтвердження запису та дати доступ до особистого кабінету."

Як тільки маєш всі дані — поверни ТІЛЬКИ json-блок такого формату (нічого іншого!):
<BOOK_ACTION>
{"service":"...","carBrand":"...","carModel":"...","date":"YYYY-MM-DDTHH:MM:SS","name":"...","phone":"...","email":"...","message":"..."}
</BOOK_ACTION>

ВАЖЛИВО:
- carBrand, carModel, date, name, phone, email — це ВНУТРІШНІ назви полів для json. У повідомленнях до клієнта НІКОЛИ не використовуй ці технічні назви. Питай по-людськи.
- Якщо клієнт авторизований і ти вже знаєш його ім'я, телефон і email — передавай їх автоматично, не питай.
- Якщо date невідома — передай пустий рядок.

Правила:
1. Якщо запитують про запис, перегляд записів чи історію ремонтів — перевір контекст авторизації.
2. Ніколи не згадуй чужі дані.
3. Якщо не знаєш точної відповіді — чесно скажи і запропонуй зателефонувати.
4. Остаточний діагноз можливий лише після огляду.
`;

async function buildSystemPrompt(): Promise<string> {
  try {
    const dbServices = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        title: true,
        category: true,
        price: true,
        priceMin: true,
        priceMax: true,
        priceCar: true,
        priceTruck: true,
        priceTrailer: true,
        short: true,
        hours: true,
      },
    });

    const serviceLines = dbServices.map((s) => {
      let priceStr = s.price || "";
      const parts: string[] = [];
      if (s.priceCar != null)     parts.push(`легкове: ${s.priceCar} ₴`);
      if (s.priceTruck != null)   parts.push(`вантажне/тягач: ${s.priceTruck} ₴`);
      if (s.priceTrailer != null) parts.push(`причіп: ${s.priceTrailer} ₴`);
      if (parts.length > 0) priceStr = parts.join(", ");
      else if (s.priceMin > 0)    priceStr = `від ${s.priceMin} ₴`;

      const hours = s.hours ? `, ~${s.hours}` : "";
      return `- ${s.title} [${s.category}]: ${priceStr}${hours}`;
    });

    return (
      BASE_INFO +
      `\nПослуги сервісу (актуальний список з бази даних):\n` +
      serviceLines.join("\n") +
      "\n"
    );
  } catch {
    return BASE_INFO + "\n(список послуг тимчасово недоступний)\n";
  }
}

async function getClientFromRequest(req: NextRequest): Promise<ClientLite | null> {
  const token = req.cookies.get("client_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;
    const client = await prisma.client.findUnique({
      where: { email },
      include: { bookings: { orderBy: { scheduledAt: "desc" }, take: 10 } },
    });
    if (!client) return null;
    return {
      name: client.name,
      phone: client.phone,
      email: client.email,
      bookings: client.bookings.map((b) => ({
        id: String(b.id),
        service: (b as Record<string, unknown>).service as string | null ?? b.name ?? null,
        scheduledAt: b.scheduledAt ?? b.date ?? null,
        status: b.status ?? null,
        carBrand: b.carBrand ?? null,
        carModel: b.carModel ?? null,
      })),
    };
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

    const [client, systemPrompt] = await Promise.all([
      getClientFromRequest(req),
      buildSystemPrompt(),
    ]);

    let userContext = "";
    if (client) {
      const activeBookings = client.bookings.filter((b) => b.status !== "cancelled" && b.status !== "done");
      const doneBookings = client.bookings.filter((b) => b.status === "done");
      userContext = `\n\nПОТОЧНИЙ АВТОРИЗОВАНИЙ КОРИСТУВАЧ:\n- Email: ${client.email}\n- Ім'я: ${client.name || "не вказано"}\n- Телефон: ${client.phone || "не вказано"}\n- Активні записи (${activeBookings.length}): ${activeBookings.length === 0 ? "немає" : activeBookings.map((b) => `#${b.id} — ${b.service || "послуга"}, авто: ${b.carBrand || ""} ${b.carModel || ""}, час: ${b.scheduledAt ? new Date(b.scheduledAt).toLocaleString("uk-UA") : "не вказано"}, статус: ${b.status}`).join("; ")}\n- Виконані ремонти (${doneBookings.length}): ${doneBookings.length === 0 ? "немає" : doneBookings.slice(0, 5).map((b) => `${b.service || "послуга"} (${b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString("uk-UA") : "дата невідома"})`).join("; ")}\n`;
    } else {
      userContext = `\n\nКОРИСТУВАЧ НЕ АВТОРИЗОВАНИЙ.
Якщо хоче записатися — обов'язково збери ім'я, телефон і email.
Email обов'язковий! Поясни природно: "Будь ласка, вкажіть ваш email — це потрібно щоб надіслати підтвердження запису та посилання для входу в особистий кабінет де ви зможете бачити свій запис."
BEZ email-а не створюй запис!
Якщо запитують про свої записи або історію — запропонуй ввести email для отримання посилання для входу.`;
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      const reply = getRuleBasedReply(lastMsg, client);
      return NextResponse.json({ reply });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt + userContext },
          ...messages.slice(-14),
        ],
        max_tokens: 700,
        temperature: 0.4,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("[AI CHAT] OpenAI error:", openaiRes.status, JSON.stringify(data));
      // Повертаємо деталі помилки для діагностики
      const errorMsg = data?.error?.message || data?.error?.code || JSON.stringify(data);
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      const fallback = getRuleBasedReply(lastMsg, client);
      console.error("[AI CHAT] OpenAI error detail:", errorMsg);
      return NextResponse.json({ reply: fallback, _debug_error: errorMsg });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("[AI CHAT] Empty choices from OpenAI:", JSON.stringify(data));
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      return NextResponse.json({ reply: getRuleBasedReply(lastMsg, client), _debug: "empty_choices" });
    }

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("[AI CHAT ERROR]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function getRuleBasedReply(msg: string, client: ClientLite | null): string {
  if (msg.includes("привіт") || msg.includes("здравств") || msg.includes("добрий")) {
    return client
      ? `Привіт, ${client.name || ""}! 👋 Радий бачити вас знову. Чим можу допомогти?`
      : "Привіт! 👋 Я AI-помічник Tirnew Truck Service. Чим можу допомогти?";
  }
  if (msg.includes("запис") || msg.includes("записат")) {
    if (!client) return "Для запису вкажіть, будь ласка:\n1. Послугу\n2. Марку та модель авто\n3. Бажану дату\n4. Ім'я\n5. Телефон\n6. Email (для підтвердження запису)";
    const active = client.bookings.filter((b) => b.status !== "cancelled" && b.status !== "done");
    if (active.length === 0) return "У вас немає активних записів. Хочете записатися? Напишіть, яка послуга потрібна.";
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
  if (msg.includes("історія") || msg.includes("ремонтів")) {
    if (!client) return "Для перегляду історії ремонтів надішліть ваш email — ми відправимо посилання для входу.";
    const done = client.bookings.filter((b) => b.status === "done");
    if (done.length === 0) return "У вас поки немає завершених ремонтів в системі.";
    return `Ваші останні ремонти:\n${done.slice(0, 5).map((b) => `• ${b.service || "Послуга"} — ${b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString("uk-UA") : "дата невідома"}`).join("\n")}`;
  }
  return "Дякую за звернення! Я AI-помічник Tirnew Truck Service.\n\nМожу допомогти з:\n• Вибором послуги\n• Записом на ремонт\n• Інформацією про ціни\n• Контактами та графіком\n\nАбо зателефонуйте нам: +38 (066) 418-88-26";
}
