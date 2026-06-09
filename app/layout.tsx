import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tirnew — Сервіс вантажних автомобілів", template: "%s | Tirnew" },
  description: "Діагностика, ремонт та обслуговування вантажних автомобілів, причепів і напівпричепів. Власний склад запчастин.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" data-theme="light">
      <body className="antialiased">{children}</body>
    </html>
  );
}
