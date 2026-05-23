import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const payload = jwt.verify(token, SECRET) as jwt.JwtPayload;

    const newToken = jwt.sign(
      { id: payload.id, email: payload.email, role: payload.role },
      SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
