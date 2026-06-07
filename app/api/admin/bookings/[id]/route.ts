import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

const PROGRESS_LABELS: Record<string, string> = {
  received: "Заявку прийнято",
  diagnostics: "Діагностика",
  in_progress: "В роботі",
  done: "Готово до видачі",
};

async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch { return false; }
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: "TIR Service", email: "qqq69068@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  const data = await res.json();
  console.log("[BREVO API]", res.status, JSON.stringify(data));
  if (!res.ok) throw new Error(JSON.stringify(data));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { price, partsCost, progress, status, clientEmail, scheduledAt, workItems } = body;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(price !== undefined && { price: price === "" ? null : parseFloat(price) }),
      ...(partsCost !== undefined && { partsCost: partsCost === "" ? null : parseFloat(partsCost) }),
      ...(progress !== undefined && { progress }),
      ...(status !== undefined && { status }),
      ...(clientEmail !== undefined && { clientEmail }),
      ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
      ...(workItems !== undefined && { workItems }),
    },
  });

  const emailTo = clientEmail || booking.clientEmail;

  // Визначаємо базову URL — з env або з заголовка запиту
  const origin = process.env.NEXT_PUBLIC_APP_URL ||
    `${req.headers.get("x-forwarded-proto") || "https"}://${req.headers.get("host")}`;

  if (progress && progress !== booking.progress && emailTo) {
    const label = PROGRESS_LABELS[progress] || progress;
    const isDone = progress === "done";
    try {
      await sendEmail(
        emailTo,
        isDone ? "✅ Ваш автомобіль готовий до видачі" : `Оновлення статусу: ${label}`,
        `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#0f1923">${isDone ? "🎉 Ваш автомобіль готовий!" : "Оновлення по вашому замовленню"}</h2>
          <p style="color:#555">Статус вашого замовлення змінено на: <strong>${label}</strong></p>
          ${booking.carBrand ? `<p style="color:#555">Авто: <strong>${booking.carBrand} ${booking.carModel || ""}</strong></p>` : ""}
          ${isDone ? "<p style='color:#01696f;font-weight:600'>Запрошуємо забрати авто!</p>" : ""}
          <a href="${origin}/cabinet" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#01696f;color:#fff;border-radius:8px;text-decoration:none">Переглянути кабінет</a>
        </div>`
      );
    } catch (err) {
      console.error("[EMAIL error]", err);
    }
  }

  return NextResponse.json(updated);
}
