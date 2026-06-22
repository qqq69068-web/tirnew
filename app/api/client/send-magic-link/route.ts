import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PRODUCTION_URL = "https://tirnew-production.up.railway.app";

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  const { email, name, phone } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  await prisma.client.upsert({
    where: { email },
    update: { name: name || undefined, phone: phone || undefined },
    create: { email, name, phone },
  });

  // Invalidate previous unused tokens
  await prisma.magicToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 хвилин
  await prisma.magicToken.create({ data: { token: otp, email, expiresAt } });

  const baseUrl = process.env.APP_URL || PRODUCTION_URL;
  void baseUrl;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: "TIR Service", email: "qqq69068@gmail.com" },
      to: [{ email }],
      subject: "Ваш код для входу — TIR Service",
      htmlContent: `
        <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px">
          <h2 style="color:#0f1923;margin-bottom:8px">Вхід до особистого кабінету</h2>
          <p style="color:#555;margin-bottom:24px">Введіть цей код на сайті. Він дійсний <strong>10 хвилин</strong>.</p>
          <div style="background:#f3f0ec;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <p style="margin:0 0 6px;font-size:12px;color:#7a7974;letter-spacing:0.1em;text-transform:uppercase">Ваш код</p>
            <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:0.18em;color:#01696f;font-family:monospace">${otp}</p>
          </div>
          <p style="color:#aaa;font-size:12px">Якщо ви не запитували цей код — просто проігноруйте листа.</p>
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
