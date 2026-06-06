import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseServiceHours,
  generateDaySlots,
  slotsOverlap,
  getWorkerIds,
} from "@/lib/scheduling";

// GET /api/client/slots?date=2026-06-10&serviceSlug=...&carCategory=car
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const serviceSlug = searchParams.get("serviceSlug");
  const carCategory = searchParams.get("carCategory") || "truck";

  if (!dateStr || !serviceSlug) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  // Парсимо дату
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  // Знаходимо послугу
  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  const slotHours = parseServiceHours(service.hours);
  const workerIds = getWorkerIds(carCategory);

  // Беремо всі букінги на цей день для відповідних майстрів
  const existingBookings = await prisma.booking.findMany({
    where: {
      workerId: { in: workerIds },
      scheduledAt: { gte: date, lte: dayEnd },
      status: { not: "cancelled" },
    },
    select: { workerId: true, scheduledAt: true, scheduledEnd: true },
  });

  // Генеруємо всі слоти дня
  const daySlots = generateDaySlots(date, slotHours);

  // Для кожного слоту — скільки вільних майстрів
  const result = daySlots.map((slotStart) => {
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + slotHours);

    // Зайняті майстри в цей слот
    const busyWorkers = new Set<number>();
    for (const b of existingBookings) {
      if (!b.scheduledAt || !b.scheduledEnd || !b.workerId) continue;
      if (slotsOverlap(slotStart, slotEnd, b.scheduledAt, b.scheduledEnd)) {
        busyWorkers.add(b.workerId);
      }
    }

    const freeWorkers = workerIds.filter((id) => !busyWorkers.has(id));

    return {
      time: slotStart.toISOString(),
      timeLabel: slotStart.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
      free: freeWorkers.length,
      total: workerIds.length,
      available: freeWorkers.length > 0,
    };
  });

  return NextResponse.json({ slots: result, slotHours, workerCount: workerIds.length });
}
