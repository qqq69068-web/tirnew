import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { randomBytes } from "crypto";
import { parseServiceHours, slotsOverlap, getWorkerIds } from "@/lib/scheduling";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");
const PRODUCTION_URL = "https://tirnew-production.up.railway.app";

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
    const { service, carBrand, carModel, carCategory, date, message, name, phone, email } = body as {
      service?: string;
      carBrand?: string;
      carModel?: string;
      carCategory?: string;
      date?: string;
      message?: string;
      name?: string;
      phone?: string;
      email?: string;
    };

    const finalName = name || clientName;
    const finalPhone = phone || clientPhone;
    const finalEmail = email || clientEmail;

    if (!finalName || !finalPhone) {
      return NextResponse.json(
        { ok: false, error: "Потрібно вказати ім'я та телефон" },
        { status: 400 }
      );
    }

    // ── Перевірка зайнятості слота ──────────────────────────────
    let scheduledStart: Date | null = null;
    let scheduledEnd: Date | null = null;
    let assignedWorker: number | null = null;

    if (date) {
      scheduledStart = new Date(date);
      const serviceRecord = service
        ? await prisma.service.findFirst({ where: { title: { contains: service } } })
        : null;
      const slotHours = serviceRecord?.hours ? parseServiceHours(serviceRecord.hours) : 1;
      scheduledEnd = new Date(scheduledStart.getTime() + slotHours * 3600000);

      const workerIds = getWorkerIds(carCategory || "truck");
      const conflicts = await prisma.booking.findMany({
        where: {
          workerId: { in: workerIds },
          scheduledAt: { gte: new Date(scheduledStart.getTime() - slotHours * 3600000), lte: scheduledEnd },
          status: { not: "cancelled" },
        },
        select: { workerId: true, scheduledAt: true, scheduledEnd: true },
      });

      const busy = new Set<number>();
      for (const b of conflicts) {
        if (b.scheduledAt && b.scheduledEnd && b.workerId && slotsOverlap(scheduledStart, scheduledEnd, b.scheduledAt, b.scheduledEnd)) {
          busy.add(b.workerId);
        }
      }

      const freeWorker = workerIds.find((id) => !busy.has(id));
      if (!freeWorker) {
        return NextResponse.json({ ok: false, error: "no_slots" }, { status: 409 });
      }
      assignedWorker = freeWorker;
    }
    // ────────────────────────────────────────────────────────────

    const booking = await prisma.booking.create({
      data: {
        name: finalName,
        phone: finalPhone,
        service: service ?? null,
        carBrand: carBrand ?? null,
        carModel: carModel ?? null,
        carCategory: carCategory ?? null,
        date: scheduledStart ?? (date ? new Date(date) : null),
        scheduledAt: scheduledStart ?? (date ? new Date(date) : null),
        scheduledEnd: scheduledEnd ?? null,
        workerId: assignedWorker ?? null,
        message: message ?? null,
        status: "new",
        progress: "received",
        clientEmail: finalEmail ?? null,
      },
    });

    // Якщо клієнт не авторизований, але надав email — створюємо/оновлюємо акаунт і відправляємо magic link
    if (!clientEmail && finalEmail) {
      try {
        await prisma.client.upsert({
          where: { email: finalEmail },
          update: {
            name: finalName || undefined,
            phone: finalPhone || undefined,
          },
          create: {
            email: finalEmail,
            name: finalName,
            phone: finalPhone,
          },
        });

        await prisma.booking.update({
          where: { id: booking.id },
          data: { clientEmail: finalEmail },
        });

        const magicToken = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
        await prisma.magicToken.create({
          data: { token: magicToken, email: finalEmail, expiresAt },
        });

        const baseUrl = process.env.APP_URL || PRODUCTION_URL;
        const loginUrl = `${baseUrl}/api/client/verify?token=${magicToken}`;
        const dateStr = date
          ? new Date(date).toLocaleString("uk-UA", { dateStyle: "long", timeStyle: "short" })
          : "буде узгоджено";

        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY!,
          },
          body: JSON.stringify({
            sender: { name: "Tirnew Truck Service", email: "qqq69068@gmail.com" },
            to: [{ email: finalEmail }],
            subject: `✅ Запис підтверджено — Tirnew Truck Service`,
            htmlContent: `
              <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px">
                <h2 style="color:#dc2626;margin-bottom:4px">🚛 Tirnew Truck Service</h2>
                <p style="color:#555;margin-bottom:24px">Ваш запис прийнято! Ми зв'яжемося з вами для підтвердження часу.</p>
                <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
                  <tr style="background:#fef2f2">
                    <td style="padding:10px 14px;border:1px solid #fecaca;font-weight:600;width:130px">Послуга</td>
                    <td style="padding:10px 14px;border:1px solid #fecaca">${service || "—"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Авто</td>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb">${[carBrand, carModel].filter(Boolean).join(" ") || "—"}</td>
                  </tr>
                  <tr style="background:#f9fafb">
                    <td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Дата</td>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb">${dateStr}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Ім'я</td>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb">${finalName}</td>
                  </tr>
                  <tr style="background:#f9fafb">
                    <td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Телефон</td>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb">${finalPhone}</td>
                  </tr>
                </table>
                <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:20px;margin-bottom:24px">
                  <p style="margin:0 0 12px;color:#374151;font-weight:600">🔑 Увійдіть в особистий кабінет</p>
                  <p style="margin:0 0 16px;color:#6b7280;font-size:14px">Для перегляду історії записів та статусу ремонту — натисніть кнопку нижче. Посилання діє 3 дні.</p>
                  <a href="${loginUrl}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Увійти в кабінет</a>
                </div>
                <p style="color:#9ca3af;font-size:12px">Якщо ви не робили цього запису — зателефонуйте нам: +38 (066) 418-88-26</p>
              </div>
            `,
          }),
        });

        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY!,
          },
          body: JSON.stringify({
            sender: { name: "Tirnew AI-помічник", email: "qqq69068@gmail.com" },
            to: [{ email: "qqq69068@gmail.com" }],
            subject: `🚛 Новий запис (AI): ${finalName}`,
            htmlContent: `
              <h2 style="color:#dc2626">Новий запис через AI-помічник</h2>
              <table style="border-collapse:collapse;width:100%">
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Ім'я</b></td><td style="padding:8px;border:1px solid #ddd">${finalName}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Телефон</b></td><td style="padding:8px;border:1px solid #ddd">${finalPhone}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Email</b></td><td style="padding:8px;border:1px solid #ddd">${finalEmail}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Послуга</b></td><td style="padding:8px;border:1px solid #ddd">${service || "—"}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Авто</b></td><td style="padding:8px;border:1px solid #ddd">${[carBrand, carModel].filter(Boolean).join(" ") || "—"}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Дата</b></td><td style="padding:8px;border:1px solid #ddd">${date ? new Date(date).toLocaleString("uk-UA") : "—"}</td></tr>
              </table>
              <p style="margin-top:12px;color:#666">Запис #${booking.id}. Акаунт клієнта створено автоматично.</p>
            `,
          }),
        });
      } catch (magicErr) {
        console.error("[MAGIC LINK / EMAIL ERROR]", magicErr);
      }
    } else if (clientEmail) {
      try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY!,
          },
          body: JSON.stringify({
            sender: { name: "Tirnew AI-помічник", email: "qqq69068@gmail.com" },
            to: [{ email: "qqq69068@gmail.com" }],
            subject: `🚛 Новий запис (AI): ${finalName}`,
            htmlContent: `
              <h2 style="color:#dc2626">Новий запис через AI-помічник (авторизований)</h2>
              <table style="border-collapse:collapse;width:100%">
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Ім'я</b></td><td style="padding:8px;border:1px solid #ddd">${finalName}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Телефон</b></td><td style="padding:8px;border:1px solid #ddd">${finalPhone}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Email</b></td><td style="padding:8px;border:1px solid #ddd">${clientEmail}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Послуга</b></td><td style="padding:8px;border:1px solid #ddd">${service || "—"}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Авто</b></td><td style="padding:8px;border:1px solid #ddd">${[carBrand, carModel].filter(Boolean).join(" ") || "—"}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><b>Дата</b></td><td style="padding:8px;border:1px solid #ddd">${date ? new Date(date).toLocaleString("uk-UA") : "—"}</td></tr>
              </table>
              <p style="margin-top:12px;color:#666">Запис #${booking.id}</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("[ADMIN EMAIL ERROR]", emailErr);
      }
    }

    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch (e) {
    console.error("[AI BOOK ERROR]", e);
    return NextResponse.json({ ok: false, error: "Помилка сервера" }, { status: 500 });
  }
}
