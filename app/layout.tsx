import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tirnew — Сервіс вантажних автомобілів", template: "%s | Tirnew" },
  description: "Діагностика, ремонт та обслуговування вантажних автомобілів, причепів і напівпричепів. Власний склад запчастин.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Cabinet Grotesk + Satoshi via Fontshare */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,600,700,800,900&f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
        {/* Inline theme init: read localStorage before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try{
    var t=localStorage.getItem('tirnew-theme');
    if(!t) t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
    document.documentElement.setAttribute('data-theme',t);
  }catch(e){}
})();
            `,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
