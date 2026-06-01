import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

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
      console.log("[MAIL] GMAIL_USER:", process.env.GMAIL_USER);
      console.log("[MAIL] GMAIL_PASS set:", !!process.env.GMAIL_PASS);
      console.log("[MAIL] NOTIFY_EMAIL:", process.env.NOTIFY_EMAIL);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const recipients = (process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      console.log("[MAIL] Sending to:", recipients);

      const info = await transporter.sendMail({
        from: `"TirNew сайт" <${process.env.GMAIL_USER}>`,
        to: recipients,
        subject: `Нова заявка від ${name}`,
        html: `
          <h2>Нова заявка з сайту TirNew</h2>
          <p><strong>Ім'я:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>Повідомлення:</strong> ${message}</p>
        `,
      });

      console.log("[MAIL] Sent OK, messageId:", info.messageId);
    } catch (mailErr) {
      console.error("[GMAIL SMTP ERROR]", mailErr);
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
