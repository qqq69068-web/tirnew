import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function POST(req: NextRequest) {
  const token = req.cookies.get("client_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const { serviceSlug, serviceTitle, carBrand, carModel, phone, message } = body;

    if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

    // Знайти послугу в БД для отримання ціни та часу
    let serviceHours: string | null = null;
    let priceMin: number | null = null;
    try {
      const svc = await prisma.service.findUnique({ where: { slug: serviceSlug } });
      if (svc) {
        serviceHours = svc.hours;
        priceMin = svc.priceMin;
      }
    } catch {}

    const booking = await prisma.booking.create({
      data: {
        name: client.name || email,
        phone: phone || client.phone || "",
        carBrand: carBrand || null,
        carModel: carModel || null,
        service: serviceTitle,
        message: message || null,
        clientEmail: email,
        status: "new",
        progress: "received",
        price: priceMin ?? null,
      },
    });

    // Повідомлення адміну
    try {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
        body: JSON.stringify({
          sender: { name: "TirNew сайт", email: "qqq69068@gmail.com" },
          to: [{ email: "qqq69068@gmail.com" }],
          subject: `Новий запис від ${client.name || email}`,
          htmlContent: `
            <h2>Новий запис з кабінету</h2>
            <p><strong>Клієнт:</strong> ${client.name || "—"} (${email})</p>
            <p><strong>Телефон:</strong> ${phone}</p>
            <p><strong>Послуга:</strong> ${serviceTitle}</p>
            <p><strong>Авто:</strong> ${carBrand || "—"} ${carModel || ""}</p>
            ${serviceHours ? `<p><strong>Орієнтовний час:</strong> ${serviceHours}</p>` : ""}
            <p><strong>Коментар:</strong> ${message || "—"}</p>
          `,
        }),
      });
    } catch (e) {
      console.error("[BOOKING MAIL ERROR]", e);
    }

    return NextResponse.json({ ok: true, id: booking.id });
  } catch (e) {
    console.error("[BOOKING ERROR]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
