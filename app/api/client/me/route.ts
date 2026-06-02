import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function GET(req: NextRequest) {
  const token = req.cookies.get("client_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;
    const client = await prisma.client.findUnique({
      where: { email },
      include: {
        bookings: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(client);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[me] JWT verify error:", message);
    return NextResponse.json({ error: "Invalid token", detail: message }, { status: 401 });
  }
}
