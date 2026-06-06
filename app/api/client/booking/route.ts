import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import {
  parseServiceHours,
  slotsOverlap,
  getWorkerIds,
} from "@/lib/scheduling";

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
    const { serviceSlug, serviceTitle, carBrand, carModel, carCategory, phone, message, scheduledAt } = body;

    if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });
    if (!scheduledAt) return NextResponse.json({ error: "Time required" }, { status: 400 });

    // Знайти послугу
    let serviceHours: string | null = null;
    let finalPrice: number | null = null;
    let slotHours = 1;
    let service = null;
    try {
      service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
      if (service) {
        serviceHours = service.hours;
        slotHours = parseServiceHours(service.hours);
        if (carCategory === "car" && service.priceCar != null) finalPrice = service.priceCar;
        else if (carCategory === "truck" && service.priceTruck != null) finalPrice = service.priceTruck;
        else if (carCategory === "trailer" && service.priceTrailer != null) finalPrice = service.priceTrailer;
        else finalPrice = service.priceMin ?? null;
      }
    } catch {}

    const scheduledStart = new Date(scheduledAt);
    const scheduledEnd = new Date(scheduledStart);
    scheduledEnd.setHours(scheduledStart.getHours() + slotHours);

    // Знайти вільного майстра
    const workerIds = getWorkerIds(carCategory || "truck");

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        workerId: { in: workerIds },
        scheduledAt: {
          gte: new Date(scheduledStart.getTime() - slotHours * 3600000),
          lte: scheduledEnd,
        },
        status: { not: "cancelled" },
      },
      select: { workerId: true, scheduledAt: true, scheduledEnd: true },
    });

    const busyWorkers = new Set<number>();
    for (const b of conflictingBookings) {
      if (!b.scheduledAt || !b.scheduledEnd || !b.workerId) continue;
      if (slotsOverlap(scheduledStart, scheduledEnd, b.scheduledAt, b.scheduledEnd)) {
        busyWorkers.add(b.workerId);
      }
    }

    const freeWorker = workerIds.find((id) => !busyWorkers.has(id));
    if (!freeWorker) {
      return NextResponse.json({ error: "no_slots", message: "Всі майстри зайняті на цей час" }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        name: client.name || email,
        phone,
        carBrand: carBrand || null,
        carModel: carModel || null,
        carCategory: carCategory || null,
        service: serviceTitle,
        scheduledAt: scheduledStart,
        scheduledEnd,
        workerId: freeWorker,
        message: message || null,
        clientEmail: email,
        status: "new",
        progress: "received",
        price: finalPrice,
      },
    });

    // Email адміну
    const dateLabel = scheduledStart.toLocaleString("uk-UA", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
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
          subject: `Новий запис від ${client.name || email} на ${dateLabel}`,
          htmlContent: `
            <h2>Новий запис з кабінету</h2>
            <p><strong>Клієнт:</strong> ${client.name || "—"} (${email})</p>
            <p><strong>Телефон:</strong> ${phone}</p>
            <p><strong>Послуга:</strong> ${serviceTitle}</p>
            <p><strong>Авто:</strong> ${carBrand || "—"} ${carModel || ""}</p>
            <p><strong>Тип:</strong> ${CAT_LABEL[carCategory] || "—"}</p>
            <p><strong>Час запису:</strong> ${dateLabel}</p>
            <p><strong>Майстер №:</strong> ${freeWorker}</p>
            ${serviceHours ? `<p><strong>Тривалість:</strong> ${serviceHours}</p>` : ""}
            ${finalPrice ? `<p><strong>Орієнтовна ціна:</strong> від ${finalPrice.toLocaleString("uk-UA")} грн</p>` : ""}
            <p><strong>Коментар:</strong> ${message || "—"}</p>
          `,
        }),
      });
    } catch (e) {
      console.error("[BOOKING MAIL ERROR]", e);
    }

    return NextResponse.json({ ok: true, id: booking.id, scheduledAt: scheduledStart, workerId: freeWorker });
  } catch (e) {
    console.error("[BOOKING ERROR]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
