import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DVTrucks",
  description: "Сервіс і ремонт вантажних авто та комерційного транспорту",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
