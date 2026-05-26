"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, MessageSquare, Users, Wrench } from "lucide-react";

const links = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Замовлення", icon: CalendarCheck, exact: false },
  { href: "/admin/contacts", label: "Повідомлення", icon: MessageSquare, exact: false },
  { href: "/admin/clients", label: "Клієнти", icon: Users, exact: false },
  { href: "/admin/services", label: "Послуги", icon: Wrench, exact: false },
];

export default function AdminSidebar() {
  const path = usePathname();
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? "bg-teal-50 text-teal-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
