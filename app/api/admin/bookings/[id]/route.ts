import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { Resend } from "resend";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

const PROGRESS_LABELS: Record<string, string> = {
  received: "Заявку прийнято",
  diagnostics: "Діагностика",
  in_progress: "В роботі",
  done: "Готово до видачі",
};

async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch { return false; }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { price, progress, status, clientEmail } = body;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(progress !== undefined && { progress }),
      ...(status !== undefined && { status }),
      ...(clientEmail !== undefined && { clientEmail }),
    },
  });

  const emailTo = clientEmail || booking.clientEmail;
  if (progress && progress !== booking.progress && emailTo) {
    const label = PROGRESS_LABELS[progress] || progress;
    const isDone = progress === "done";
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "TIR Service <onboarding@resend.dev>",
      to: emailTo,
      subject: isDone ? "✅ Ваш автомобіль готовий до видачі" : `Оновлення статусу: ${label}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#0f1923">${isDone ? "🎉 Ваш автомобіль готовий!" : "Оновлення по вашому замовленню"}</h2>
          <p style="color:#555">Статус вашого замовлення змінено на: <strong>${label}</strong></p>
          ${booking.carBrand ? `<p style="color:#555">Авто: <strong>${booking.carBrand} ${booking.carModel || ""}</strong></p>` : ""}
          ${isDone ? "<p style='color:#01696f;font-weight:600'>Запрошуємо забрати авто!</p>" : ""}
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/cabinet" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#01696f;color:#fff;border-radius:8px;text-decoration:none">Переглянути кабінет</a>
        </div>
      `,
    });
  }

  return NextResponse.json(updated);
}
