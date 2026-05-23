import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export type JWTPayload = {
  id: string;
  email: string;
  role: string;
};

export async function getTokenPayload(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    return jwt.verify(token, SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<JWTPayload> {
  const payload = await getTokenPayload();
  if (!payload || payload.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return payload;
}
