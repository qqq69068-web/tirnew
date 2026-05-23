import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, carBrand, carModel, service, date, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        phone,
        carBrand: carBrand || null,
        carModel: carModel || null,
        service: service || null,
        date: date ? new Date(date) : null,
        message: message || null,
      },
    });

    return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (err) {
    console.error("[BOOKING API ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
