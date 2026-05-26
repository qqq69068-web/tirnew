"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Users,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Замовлення", icon: CalendarCheck },
  { href: "/admin/contacts", label: "Повідомлення", icon: MessageSquare },
  { href: "/admin/clients", label: "Клієнти", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 py-4 px-2 space-y-0.5">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-teal-50 text-teal-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon size={16} className={active ? "text-teal-600" : "text-gray-400"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
