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

  // Set cookie then show a page that closes itself.
  // The original /cabinet tab is polling /api/client/me and will auto-login.
  const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="utf-8">
  <title>\u0412\u0445\u0456\u0434 \u0432\u0438\u043a\u043e\u043d\u0430\u043d\u043e</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      min-height:100vh;display:flex;align-items:center;justify-content:center;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      background:#0f1923;color:#edeae6;
    }
    .card{
      text-align:center;padding:40px 32px;background:#1c1b19;
      border:1px solid #2a2926;border-radius:16px;max-width:360px;width:90%;
    }
    .icon{
      width:56px;height:56px;border-radius:50%;background:rgba(1,105,111,0.15);
      display:flex;align-items:center;justify-content:center;
      margin:0 auto 18px;
    }
    h1{font-size:18px;font-weight:700;margin-bottom:8px}
    p{font-size:13px;color:#7a7976;line-height:1.6}
    .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#01696f;margin:0 3px;animation:bounce 1.2s ease-in-out infinite}
    .dot:nth-child(2){animation-delay:.15s}
    .dot:nth-child(3){animation-delay:.3s}
    @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01696f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <h1>\u0412\u0445\u0456\u0434 \u0432\u0438\u043a\u043e\u043d\u0430\u043d\u043e!</h1>
    <p>\u0426\u044e \u0432\u043a\u043b\u0430\u0434\u043a\u0443 \u0431\u0443\u0434\u0435 \u0437\u0430\u043a\u0440\u0438\u0442\u043e\u2026<br>
    <span class="dot"></span><span class="dot"></span><span class="dot"></span></p>
  </div>
  <script>
    // Close this tab. The original cabinet tab is already polling and will log in.
    setTimeout(function() {
      window.close();
      // Fallback if window.close() is blocked
      setTimeout(function() {
        window.location.replace('${BASE_URL}/cabinet');
      }, 1500);
    }, 1200);
  </script>
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
