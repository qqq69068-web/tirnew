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
    const data = {
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
    };

    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });

    if (existing) {
      await prisma.service.update({ where: { slug: s.slug }, data });
      updated++;
    } else {
      await prisma.service.create({ data: { slug: s.slug, ...data } });
      created++;
    }
  }

  return NextResponse.json({ created, updated });
}
