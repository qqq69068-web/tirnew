"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarCheck, MessageSquare, Users, Wrench,
} from "lucide-react";

const links = [
  { href: "/admin",          label: "Дашборд",     icon: LayoutDashboard, exact: true  },
  { href: "/admin/bookings", label: "Замовлення",   icon: CalendarCheck,   exact: false },
  { href: "/admin/contacts", label: "Повідомлення", icon: MessageSquare,   exact: false },
  { href: "/admin/clients",  label: "Клієнти",      icon: Users,           exact: false },
  { href: "/admin/services", label: "Послуги",      icon: Wrench,          exact: false },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <nav className="admin-sidebar-nav" aria-label="Admin navigation">
      <p className="admin-nav-section">Навігація</p>

      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`admin-nav-link${active ? " active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              size={16}
              strokeWidth={active ? 2.2 : 1.75}
              aria-hidden="true"
            />
            <span>{label}</span>
            {active && (
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 2,
                  height: 16,
                  background: "var(--primary)",
                  borderRadius: "2px 0 0 2px",
                }}
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
