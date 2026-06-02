import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");
const BASE_URL = process.env.APP_URL || "https://tirnew-production.up.railway.app";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(`${BASE_URL}/cabinet?error=no_token`);

  const magic = await prisma.magicToken.findUnique({ where: { token } });
  if (!magic || magic.used || magic.expiresAt < new Date()) {
    return NextResponse.redirect(`${BASE_URL}/cabinet?error=expired`);
  }

  await prisma.magicToken.update({ where: { token }, data: { used: true } });

  const jwt = await new SignJWT({ email: magic.email, role: "client" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const res = NextResponse.redirect(`${BASE_URL}/cabinet`);

  res.cookies.set("client_token", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
