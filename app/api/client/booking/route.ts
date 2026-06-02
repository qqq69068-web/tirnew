import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

const CAT_LABEL: Record<string, string> = {
  car: "🚗 Легкове",
  truck: "🚛 Вантажне / Тягач",
  trailer: "🚌 Причіп / Напівпричіп",
};

export async function POST(req: NextRequest) {
  const token = req.cookies.get("client_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const { serviceSlug, serviceTitle, carBrand, carModel, carCategory, phone, message } = body;

    if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

    // Знайти послугу для отримання ціни та часу
    let serviceHours: string | null = null;
    let finalPrice: number | null = null;
    try {
      const svc = await prisma.service.findUnique({ where: { slug: serviceSlug } });
      if (svc) {
        serviceHours = svc.hours;
        // Вибираємо ціну залежно від категорії авто
        if (carCategory === "car" && svc.priceCar != null) finalPrice = svc.priceCar;
        else if (carCategory === "truck" && svc.priceTruck != null) finalPrice = svc.priceTruck;
        else if (carCategory === "trailer" && svc.priceTrailer != null) finalPrice = svc.priceTrailer;
        else finalPrice = svc.priceMin ?? null;
      }
    } catch {}

    const booking = await prisma.booking.create({
      data: {
        name: client.name || email,
        phone,
        carBrand: carBrand || null,
        carModel: carModel || null,
        carCategory: carCategory || null,
        service: serviceTitle,
        message: message || null,
        clientEmail: email,
        status: "new",
        progress: "received",
        price: finalPrice,
      },
    });

    // Email адміну
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
            <p><strong>Тип:</strong> ${CAT_LABEL[carCategory] || "—"}</p>
            ${serviceHours ? `<p><strong>Орієнтовний час:</strong> ${serviceHours}</p>` : ""}
            ${finalPrice ? `<p><strong>Орієнтовна ціна:</strong> від ${finalPrice.toLocaleString("uk-UA")} грн</p>` : ""}
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
