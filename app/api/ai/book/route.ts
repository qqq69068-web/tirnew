import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("client_token")?.value;
    let clientEmail: string | null = null;
    let clientName: string | null = null;
    let clientPhone: string | null = null;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        clientEmail = payload.email as string;
        const client = await prisma.client.findUnique({ where: { email: clientEmail } });
        if (client) {
          clientName = client.name ?? null;
          clientPhone = client.phone ?? null;
        }
      } catch { /* invalid token */ }
    }

    const body = await req.json();
    const { service, carBrand, carModel, carCategory, date, message, name, phone } = body as {
      service?: string;
      carBrand?: string;
      carModel?: string;
      carCategory?: string;
      date?: string;
      message?: string;
      name?: string;
      phone?: string;
    };

    const finalName = name || clientName;
    const finalPhone = phone || clientPhone;

    if (!finalName || !finalPhone) {
      return NextResponse.json(
        { ok: false, error: "Потрібно вказати ім'я та телефон" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        name: finalName,
        phone: finalPhone,
        service: service ?? null,
        carBrand: carBrand ?? null,
        carModel: carModel ?? null,
        carCategory: carCategory ?? null,
        date: date ? new Date(date) : null,
        scheduledAt: date ? new Date(date) : null,
        message: message ?? null,
        status: "new",
        progress: "received",
        clientEmail: clientEmail ?? null,
      },
    });

    // Відправляємо email-сповіщення через Brevo
    try {
      const dateStr = date
        ? new Date(date).toLocaleString("uk-UA", { dateStyle: "long", timeStyle: "short" })
        : "буде узгоджено";

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
        body: JSON.stringify({
          sender: { name: "TirNew AI-помічник", email: "qqq69068@gmail.com" },
          to: [{ email: "qqq69068@gmail.com" }],
          subject: `🚛 Новий запис через AI: ${finalName}`,
          htmlContent: `
            <h2 style="color:#dc2626">Новий запис через AI-помічник</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Ім'я</strong></td><td style="padding:8px;border:1px solid #ddd">${finalName}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Телефон</strong></td><td style="padding:8px;border:1px solid #ddd">${finalPhone}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Послуга</strong></td><td style="padding:8px;border:1px solid #ddd">${service || "—"}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Авто</strong></td><td style="padding:8px;border:1px solid #ddd">${[carBrand, carModel].filter(Boolean).join(" ") || "—"}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Дата</strong></td><td style="padding:8px;border:1px solid #ddd">${dateStr}</td></tr>
              ${message ? `<tr><td style="padding:8px;border:1px solid #ddd"><strong>Повідомлення</strong></td><td style="padding:8px;border:1px solid #ddd">${message}</td></tr>` : ""}
              ${clientEmail ? `<tr><td style="padding:8px;border:1px solid #ddd"><strong>Email клієнта</strong></td><td style="padding:8px;border:1px solid #ddd">${clientEmail}</td></tr>` : ""}
            </table>
            <p style="margin-top:16px;color:#666">Запис #${booking.id} збережено в базі даних.</p>
          `,
        }),
      });

      if (!res.ok) {
        console.error("[BREVO AI BOOK ERROR]", await res.text());
      } else {
        console.log("[MAIL] AI booking email sent OK");
      }
    } catch (mailErr) {
      console.error("[BREVO AI BOOK SEND ERROR]", mailErr);
    }

    return NextResponse.json({ ok: true, bookingId: booking.id }, { status: 201 });
  } catch (err) {
    console.error("[AI BOOK ERROR]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
