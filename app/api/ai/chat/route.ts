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
Ти — AI-помічник сервісного центру Tirnew Truck Service.
Відповідай ВИКЛЮЧНО українською мовою. Будь дружнім, лаконічним і корисним.
Ніколи не вигадуй інформацію яку не знаєш.

== ПРО СЕРВІС ==
- Назва: Tirnew Truck Service
- Адреса: Рівненська обл., с. Велика Омеляна, вул. Шевченка 35
- Телефон: +38 (066) 418-88-26
- Графік: Понеділок–Субота, 08:00–18:00. Неділя — вихідний.
- Спеціалізація: ремонт і обслуговування вантажних авто, причепів, напівпричепів, легкових авто.

== СТИЛЬ ВІДПОВІДЕЙ ==
- Відповідай коротко і по суті. Не пиши довгі абзаци там де достатньо 1-2 речень.
- Використовуй емодзі помірно (1-2 на повідомлення максимум).
- Ніколи не показуй технічні назви полів (carBrand, carModel, date, email тощо) у тексті.
- Питання задавай по одному, не «вали» все одразу.
- Якщо не знаєш точної відповіді — чесно скажи і запропонуй зателефонувати: +38 (066) 418-88-26

== ЗАПИС НА ПОСЛУГУ ==
Ти МОЖЕШ записати клієнта самостійно. Збирай дані через природний діалог по одному питанню:
1. Яку послугу потрібно (якщо не сказав)
2. Марка авто (якщо не сказав)
3. Модель авто (якщо не сказав)
4. Бажана дата і час (якщо не сказав)
5. Якщо НЕ авторизований — зібрати по черзі: ім'я → телефон → email
   Email пояснюй так: "Вкажіть ваш email — надішлемо підтвердження і посилання в кабінет."

КОЛИ ВСІ ДАНІ ЗІБРАНІ — виводь ТІЛЬКИ це (жодного іншого тексту, жодних пояснень):
<BOOK_ACTION>
{"service":"...","carBrand":"...","carModel":"...","date":"YYYY-MM-DDTHH:MM:SS","name":"...","phone":"...","email":"...","message":""}
</BOOK_ACTION>

!! КРИТИЧНО ВАЖЛИВО !!
- Коли виводиш <BOOK_ACTION> — НЕ додавай ЖОДНОГО тексту ДО або ПІСЛЯ тегів. Абсолютно нічого.
- Якщо дата невідома — передай порожній рядок для поля date.
- Якщо клієнт авторизований — бери його ім'я, телефон, email автоматично, не питай.
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
      `\n== ПОСЛУГИ СЕРВІСУ ==\n` +
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
      userContext = `\n\n== АВТОРИЗОВАНИЙ КЛІЄНТ ==\nEmail: ${client.email}\nІм'я: ${client.name || "не вказано"}\nТелефон: ${client.phone || "не вказано"}\nАктивні записи (${activeBookings.length}): ${activeBookings.length === 0 ? "немає" : activeBookings.map((b) => `#${b.id} — ${b.service || "послуга"}, авто: ${b.carBrand || ""} ${b.carModel || ""}, час: ${b.scheduledAt ? new Date(b.scheduledAt).toLocaleString("uk-UA") : "не вказано"}, статус: ${b.status}`).join("; ")}\nВиконані ремонти: ${doneBookings.length === 0 ? "немає" : doneBookings.slice(0, 5).map((b) => `${b.service || "послуга"} (${b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString("uk-UA") : "дата невідома"})`).join("; ")}\n`;
    } else {
      userContext = `\n\n== КЛІЄНТ НЕ АВТОРИЗОВАНИЙ ==\nДля запису обов'язково зібрати: ім'я, телефон, email.\nEmail пояснювати: "Вкажіть email — надішлемо підтвердження і посилання в кабінет."\nБЕЗ email запис не створювати!\nДля перегляду записів/історії — запропонуй ввести email для отримання посилання для входу.`;
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      return NextResponse.json({ reply: getRuleBasedReply(lastMsg, client) });
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
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("[AI CHAT] OpenAI error:", openaiRes.status, JSON.stringify(data));
      const errorMsg = data?.error?.message || data?.error?.code || JSON.stringify(data);
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      console.error("[AI CHAT] detail:", errorMsg);
      return NextResponse.json({ reply: getRuleBasedReply(lastMsg, client), _debug_error: errorMsg });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("[AI CHAT] Empty choices:", JSON.stringify(data));
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
    if (!client) return "Для запису вкажіть:\n1. Послугу\n2. Марку та модель авто\n3. Бажану дату\n4. Ім'я, телефон, email";
    const active = client.bookings.filter((b) => b.status !== "cancelled" && b.status !== "done");
    if (active.length === 0) return "У вас немає активних записів. Яка послуга потрібна?";
    return `Ваші активні записи:\n${active.map((b) => `• ${b.service || "Послуга"} — ${b.scheduledAt ? new Date(b.scheduledAt).toLocaleString("uk-UA") : "час не вказано"}`).join("\n")}`;
  }
  if (msg.includes("ціна") || msg.includes("прайс") || msg.includes("вартість") || msg.includes("скільки")) {
    return "Актуальні ціни — на сторінці /price. Напишіть яка послуга цікавить — відповім конкретніше.";
  }
  if (msg.includes("послуг") || msg.includes("сервіс") || msg.includes("ремонт")) {
    return "Виконуємо повний цикл ремонту:\n• Двигуни та КПП\n• Гальмівна система (KNORR, WABCO)\n• Пневмосистеми\n• Електрика та діагностика\n• ТО причепів і напівпричепів\n\nПовний перелік — /services";
  }
  if (msg.includes("контакт") || msg.includes("телефон") || msg.includes("адрес")) {
    return "📍 Рівненська обл., с. Велика Омеляна, вул. Шевченка 35\n📞 +38 (066) 418-88-26\n⏰ Пн–Сб, 08:00–18:00";
  }
  if (msg.includes("графік") || msg.includes("час роботи") || msg.includes("коли працює")) {
    return "⏰ Пн–Сб: 08:00–18:00\nНеділя — вихідний.";
  }
  if (msg.includes("історія") || msg.includes("ремонтів")) {
    if (!client) return "Введіть ваш email — надішлемо посилання для входу де можна переглянути історію.";
    const done = client.bookings.filter((b) => b.status === "done");
    if (done.length === 0) return "Завершених ремонтів ще немає.";
    return `Останні ремонти:\n${done.slice(0, 5).map((b) => `• ${b.service || "Послуга"} — ${b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString("uk-UA") : "дата невідома"}`).join("\n")}`;
  }
  return "Чим можу допомогти?\n• Запис на ремонт\n• Інформація про послуги та ціни\n• Контакти та графік\n\nАбо телефонуйте: +38 (066) 418-88-26";
}
