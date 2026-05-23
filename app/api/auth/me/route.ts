import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = jwt.verify(token, SECRET) as jwt.JwtPayload;
    return NextResponse.json({ id: payload.id, email: payload.email, role: payload.role });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
