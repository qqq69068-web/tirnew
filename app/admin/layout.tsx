export const dynamic = "force-dynamic";

import { getTokenPayload } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Перевірку автентифікації робить тільки middleware.
  // Layout не робить redirect, бо інакше /admin/login потрапляє в цю ж layout і виникає петля.
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? "";
  const isLoginPage = pathname === "/admin/login" || pathname.endsWith("/admin/login");

  const payload = await getTokenPayload();

  // Якщо це сторінка логіну — показуємо тільки children (форму входу)
  if (isLoginPage || !payload) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-full z-20">
        <div className="px-5 py-5 border-b border-gray-100">
          <span className="font-bold text-gray-900 text-base tracking-tight">TIR NEW</span>
          <p className="text-xs text-gray-400 mt-0.5">Адмін-панель</p>
        </div>
        <AdminSidebar />
        <div className="mt-auto px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2 truncate">{payload.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <div className="ml-56 flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
