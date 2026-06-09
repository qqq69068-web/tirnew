import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function POST(req: NextRequest) {
  try {
    // Перевіряємо авторизацію клієнта
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
    const { service, carBrand, carModel, carCategory, date, message, name, phone } = body as {
      service?: string;
      carBrand?: string;
      carModel?: string;
      carCategory?: string;
      date?: string;
      message?: string;
      name?: string;
      phone?: string;
    };

    const finalName = name || clientName;
    const finalPhone = phone || clientPhone;

    if (!finalName || !finalPhone) {
      return NextResponse.json(
        { ok: false, error: "Потрібно вказати ім'я та телефон" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        name: finalName,
        phone: finalPhone,
        service: service ?? null,
        carBrand: carBrand ?? null,
        carModel: carModel ?? null,
        carCategory: carCategory ?? null,
        date: date ? new Date(date) : null,
        scheduledAt: date ? new Date(date) : null,
        message: message ?? null,
        status: "new",
        progress: "received",
        clientEmail: clientEmail ?? null,
      },
    });

    return NextResponse.json({ ok: true, bookingId: booking.id }, { status: 201 });
  } catch (err) {
    console.error("[AI BOOK ERROR]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
