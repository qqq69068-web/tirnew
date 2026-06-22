import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  if (!email || !code) {
    return NextResponse.json({ error: "Email та код обов'язкові" }, { status: 400 });
  }

  const magic = await prisma.magicToken.findFirst({
    where: { email, token: code, used: false },
  });

  if (!magic) {
    return NextResponse.json({ error: "Невірний код" }, { status: 401 });
  }

  if (magic.expiresAt < new Date()) {
    return NextResponse.json({ error: "Код застарів. Запросіть новий" }, { status: 401 });
  }

  await prisma.magicToken.update({ where: { id: magic.id }, data: { used: true } });

  const jwt = await new SignJWT({ email, role: "client" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("client_token", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
