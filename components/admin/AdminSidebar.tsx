"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, MessageSquare, Users, Wrench } from "lucide-react";

const links = [
  { href: "/admin",          label: "Дашборд",     icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Замовлення",   icon: CalendarCheck,   exact: false },
  { href: "/admin/contacts", label: "Повідомлення", icon: MessageSquare,   exact: false },
  { href: "/admin/clients",  label: "Клієнти",      icon: Users,           exact: false },
  { href: "/admin/services", label: "Послуги",      icon: Wrench,          exact: false },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`admin-nav__link${active ? " admin-nav__link--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="admin-nav__link-icon" aria-hidden="true">
              <Icon size={16} strokeWidth={active ? 2 : 1.75} />
            </span>
            <span className="admin-nav__link-label">{label}</span>
            {active && <span className="admin-nav__link-indicator" aria-hidden="true" />}
          </Link>
        );
      })}

      <style>{`
        .admin-nav {
          flex: 1;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .admin-nav__link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          font-family: var(--font-body, 'Satoshi', sans-serif);
          color: var(--color-text-muted, #7a7672);
          text-decoration: none;
          transition:
            background 180ms cubic-bezier(0.16,1,0.3,1),
            color 180ms cubic-bezier(0.16,1,0.3,1);
          letter-spacing: 0.01em;
        }
        .admin-nav__link:hover {
          background: var(--admin-nav-hover, rgba(185,28,28,0.08));
          color: var(--color-text, #e8e4dc);
        }
        .admin-nav__link--active {
          background: var(--admin-nav-active-bg, rgba(185,28,28,0.12));
          color: var(--color-accent, #b91c1c);
        }
        .admin-nav__link--active:hover {
          background: var(--admin-nav-active-bg, rgba(185,28,28,0.12));
          color: var(--color-accent, #b91c1c);
        }

        .admin-nav__link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 18px;
        }
        .admin-nav__link-label {
          flex: 1;
        }

        /* Active indicator — thin crimson line on the right */
        .admin-nav__link-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 16px;
          background: var(--color-accent, #b91c1c);
          border-radius: 2px 0 0 2px;
        }

        /* Light mode */
        :root:not([data-theme="dark"]) .admin-nav__link {
          color: var(--color-text-muted, #6b6b69);
        }
        :root:not([data-theme="dark"]) .admin-nav__link:hover {
          background: rgba(185,28,28,0.06);
          color: var(--color-text, #1c1a17);
        }
        :root:not([data-theme="dark"]) .admin-nav__link--active {
          background: rgba(185,28,28,0.08);
          color: var(--color-accent, #b91c1c);
        }
      `}</style>
    </nav>
  );
}
