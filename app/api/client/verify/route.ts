import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "No token" }, { status: 400 });

  const magic = await prisma.magicToken.findUnique({ where: { token } });
  if (!magic || magic.used || magic.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  await prisma.magicToken.update({ where: { token }, data: { used: true } });

  const jwt = await new SignJWT({ email: magic.email, role: "client" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const res = NextResponse.json({ ok: true, email: magic.email });
  res.cookies.set("client_token", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
