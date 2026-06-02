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

  // Use HTML response instead of redirect to ensure cookie is set before navigation
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Вхід...</title>
</head>
<body>
  <script>window.location.replace("${BASE_URL}/cabinet");</script>
</body>
</html>`;

  const res = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });

  res.cookies.set("client_token", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
