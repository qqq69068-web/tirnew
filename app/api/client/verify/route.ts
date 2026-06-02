import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/cabinet?error=no_token", req.url));

  const magic = await prisma.magicToken.findUnique({ where: { token } });
  if (!magic || magic.used || magic.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/cabinet?error=expired", req.url));
  }

  await prisma.magicToken.update({ where: { token }, data: { used: true } });

  const jwt = await new SignJWT({ email: magic.email, role: "client" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const res = NextResponse.redirect(
    new URL("/cabinet", req.url)
  );

  res.cookies.set("client_token", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
