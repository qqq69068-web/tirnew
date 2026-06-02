import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const { email, name, phone } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  await prisma.client.upsert({
    where: { email },
    update: { name: name || undefined, phone: phone || undefined },
    create: { email, name, phone },
  });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
  await prisma.magicToken.create({ data: { token, email, expiresAt } });

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/cabinet?token=${token}`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: "TIR Service", email: "qqq69068@gmail.com" },
      to: [{ email }],
      subject: "Ваше посилання для входу — TIR Service",
      htmlContent: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#0f1923">Вхід до особистого кабінету</h2>
          <p style="color:#555">Натисніть кнопку нижче щоб увійти. Посилання діє 30 хвилин.</p>
          <a href="${url}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:#01696f;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Увійти до кабінету</a>
          <p style="margin-top:24px;color:#aaa;font-size:12px">Якщо ви не запитували цей лист — просто проігноруйте його.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Brevo error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
