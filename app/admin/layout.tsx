export const dynamic = "force-dynamic";

import { getTokenPayload } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? "";
  const isLoginPage = pathname === "/admin/login" || pathname.endsWith("/admin/login");

  const payload = await getTokenPayload();

  if (isLoginPage || !payload) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        {/* Logo / Brand */}
        <div className="admin-sidebar__brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="TIR NEW logo">
            <polygon
              points="16,2 30,9 30,23 16,30 2,23 2,9"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              fill="none"
            />
            <text
              x="16"
              y="21"
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-display)"
              fill="var(--color-accent)"
            >
              T
            </text>
          </svg>
          <div className="admin-sidebar__brand-text">
            <span className="admin-sidebar__brand-name">TIR NEW</span>
            <span className="admin-sidebar__brand-sub">Адмін-панель</span>
          </div>
        </div>

        {/* Navigation */}
        <AdminSidebar />

        {/* Footer */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-avatar">
              {payload.email?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <span className="admin-sidebar__user-email" title={payload.email}>
              {payload.email}
            </span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="admin-content">
        {children}
      </div>

      <style>{`
        .admin-shell {
          min-height: 100vh;
          background: var(--color-bg, #0c0c0c);
          display: flex;
        }

        /* ── Sidebar ─────────────────────────────── */
        .admin-sidebar {
          width: 220px;
          background: var(--admin-sidebar-bg, #111110);
          border-right: 1px solid var(--admin-sidebar-border, rgba(255,255,255,0.06));
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          z-index: 20;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }

        /* Brand block */
        .admin-sidebar__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 20px 18px;
          border-bottom: 1px solid var(--admin-sidebar-border, rgba(255,255,255,0.06));
        }
        .admin-sidebar__brand-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .admin-sidebar__brand-name {
          font-family: var(--font-display, 'Cabinet Grotesk', sans-serif);
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--color-text, #e8e4dc);
          line-height: 1.1;
        }
        .admin-sidebar__brand-sub {
          font-size: 0.6875rem;
          color: var(--color-text-muted, #7a7672);
          letter-spacing: 0.03em;
        }

        /* Footer */
        .admin-sidebar__footer {
          margin-top: auto;
          padding: 14px 16px 18px;
          border-top: 1px solid var(--admin-sidebar-border, rgba(255,255,255,0.06));
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .admin-sidebar__user {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .admin-sidebar__user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-accent, #b91c1c);
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: var(--font-display, sans-serif);
          letter-spacing: 0.05em;
        }
        .admin-sidebar__user-email {
          font-size: 0.6875rem;
          color: var(--color-text-muted, #7a7672);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        /* Content area */
        .admin-content {
          margin-left: 220px;
          flex: 1;
          min-width: 0;
          background: var(--color-bg, #0c0c0c);
        }

        /* Light mode overrides */
        :root:not([data-theme="dark"]) .admin-sidebar {
          background: var(--admin-sidebar-bg-light, #ffffff);
          border-right-color: var(--color-border, #e4e1da);
        }
        :root:not([data-theme="dark"]) .admin-sidebar__brand {
          border-bottom-color: var(--color-border, #e4e1da);
        }
        :root:not([data-theme="dark"]) .admin-sidebar__footer {
          border-top-color: var(--color-border, #e4e1da);
        }
        :root:not([data-theme="dark"]) .admin-content {
          background: var(--color-bg, #f5f2ed);
        }

        /* Responsive — collapse sidebar on mobile */
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
