// Окремий layout для /admin/login — НЕ використовує AdminLayout
// Це ламає петлю редиректів: AdminLayout перевіряє токен і редиректить на /admin/login,
// але /admin/login потрапляв під той самий AdminLayout → нескінченний цикл.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
