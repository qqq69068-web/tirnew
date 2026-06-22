import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenPayload } from "@/lib/auth";
import { services as staticServices } from "@/lib/services";

export async function POST() {
  const payload = await getTokenPayload();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let created = 0;
  let skipped = 0;

  for (const s of staticServices) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.service.create({
      data: {
        slug:         s.slug,
        title:        s.title,
        short:        s.short        ?? "",
        description:  s.description  ?? "",
        price:        s.price        ?? "",
        priceMin:     s.priceMin     ?? 0,
        priceMax:     s.priceMax     ?? 0,
        priceCar:     s.priceCar     ?? null,
        priceTruck:   s.priceTruck   ?? null,
        priceTrailer: s.priceTrailer ?? null,
        hours:        s.hours        ?? "",
        image:        s.image        ?? "",
        category:     s.category     ?? "",
        details:      s.details      ?? [],
        order:        s.order        ?? 0,
        active:       s.active       ?? true,
      },
    });
    created++;
  }

  return NextResponse.json({ created, skipped });
}
