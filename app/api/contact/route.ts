import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function sendEmail(name: string, phone: string, message: string) {
  const FormData = (await import("form-data")).default;
  const Mailgun = (await import("mailgun.js")).default;
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: `TirNew сайт <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to: [process.env.NOTIFY_EMAIL!],
    subject: `Нова заявка від ${name}`,
    text: `Нова заявка з сайту:\n\nІм'я: ${name}\nТелефон: ${phone}\nПовідомлення: ${message}`,
    html: `<h2>Нова заявка з сайту TirNew</h2><p><strong>Ім'я:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Повідомлення:</strong> ${message}</p>`,
  });
}

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
      await sendEmail(name, phone, message);
    } catch (mailErr) {
      console.error("[MAILGUN ERROR]", mailErr);
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
