import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

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
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "TirNew сайт <onboarding@resend.dev>",
        to: [process.env.NOTIFY_EMAIL!],
        subject: `Нова заявка від ${name}`,
        html: `
          <h2>Нова заявка з сайту TirNew</h2>
          <p><strong>Ім'я:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>Повідомлення:</strong> ${message}</p>
        `,
      });
    } catch (mailErr) {
      console.error("[RESEND ERROR]", mailErr);
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
