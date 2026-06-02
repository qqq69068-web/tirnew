import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Name, phone and message are required" },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: { name, phone, message },
    });

    try {
      const notifyEmail = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || "qqq69068@gmail.com";

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
        body: JSON.stringify({
          sender: { name: "TirNew сайт", email: "qqq69068@gmail.com" },
          to: [{ email: notifyEmail }],
          subject: `Нова заявка від ${name}`,
          htmlContent: `
            <h2>Нова заявка з сайту TirNew</h2>
            <p><strong>Ім'я:</strong> ${name}</p>
            <p><strong>Телефон:</strong> ${phone}</p>
            <p><strong>Повідомлення:</strong> ${message}</p>
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("[BREVO ERROR]", err);
      } else {
        console.log("[MAIL] Sent OK via Brevo to:", notifyEmail);
      }
    } catch (mailErr) {
      console.error("[BREVO SEND ERROR]", mailErr);
    }

    return NextResponse.json({ ok: true, id: contact.id }, { status: 201 });
  } catch (err) {
    console.error("[CONTACT API ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (err) {
    console.error("[CONTACT API ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
