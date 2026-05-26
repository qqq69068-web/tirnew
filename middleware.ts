import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAdminPath =
    req.nextUrl.pathname.startsWith("/admin") && !isLoginPage;

  // Захист адмін-сторінок (крім логіну)
  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
