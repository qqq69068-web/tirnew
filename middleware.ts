import { NextRequest, NextResponse } from "next/server";

function verifyJWT(token: string, secret: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
    if (header.alg !== "HS256") return false;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAdminPath =
    req.nextUrl.pathname.startsWith("/admin") && !isLoginPage;

  if (isAdminPath) {
    if (!token || !verifyJWT(token, process.env.JWT_SECRET!)) {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      if (token) response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
