import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenPayload } from "@/lib/auth";
import { services as staticServices } from "@/lib/services";

export async function POST() {
  const payload = await getTokenPayload();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let created = 0;
  let updated = 0;

  for (const s of staticServices) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });

    if (existing) {
      // Оновлюємо все КРІМ image — щоб не затерти фото змінене в адмінці
      await prisma.service.update({
        where: { slug: s.slug },
        data: {
          title:       s.title,
          short:       s.short       ?? "",
          description: s.description ?? "",
          price:       s.price       ?? "",
          priceMin:    s.priceMin    ?? 0,
          priceMax:    s.priceMax    ?? 0,
          hours:       s.hours       ?? "",
          category:    s.category    ?? "",
          details:     s.details     ?? [],
        },
      });
      updated++;
    } else {
      // Новий запис — вставляємо з image зі services.ts
      await prisma.service.create({
        data: {
          slug:        s.slug,
          title:       s.title,
          short:       s.short       ?? "",
          description: s.description ?? "",
          price:       s.price       ?? "",
          priceMin:    s.priceMin    ?? 0,
          priceMax:    s.priceMax    ?? 0,
          hours:       s.hours       ?? "",
          image:       s.image       ?? "",
          category:    s.category    ?? "",
          details:     s.details     ?? [],
        },
      });
      created++;
    }
  }

  return NextResponse.json({ created, updated });
}
