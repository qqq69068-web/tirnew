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

      {/* ── Mobile top-bar ── */}
      <header className="admin-topbar">
        <button
          id="admin-burger"
          className="admin-burger"
          aria-label="Відкрити меню"
          aria-expanded="false"
          aria-controls="admin-sidebar"
        >
          <span /><span /><span />
        </button>
        <div className="admin-topbar__brand">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="var(--primary)" strokeWidth="1.5" fill="none" />
            <text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="700"
              fontFamily="var(--font-display)" fill="var(--primary)">T</text>
          </svg>
          <span className="admin-topbar__name">TIR NEW</span>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div id="admin-overlay" className="admin-overlay" aria-hidden="true" />

      {/* ── Sidebar ── */}
      <aside id="admin-sidebar" className="admin-sidebar" role="navigation" aria-label="Адмін навігація">
        {/* Brand */}
        <div className="admin-sidebar__brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="TIR NEW logo">
            <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="var(--primary)" strokeWidth="1.5" fill="none" />
            <text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="700"
              fontFamily="var(--font-display)" fill="var(--primary)">T</text>
          </svg>
          <div className="admin-sidebar__brand-text">
            <span className="admin-sidebar__brand-name">TIR NEW</span>
            <span className="admin-sidebar__brand-sub">Адмін-панель</span>
          </div>
        </div>

        {/* Nav */}
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

      {/* ── Content ── */}
      <div className="admin-content">
        {children}
      </div>

      <style>{`
        /* ── Shell ── */
        .admin-shell {
          min-height: 100vh;
          background: var(--admin-bg);
          display: flex;
          position: relative;
        }

        /* ── Mobile top-bar (hidden on desktop) ── */
        .admin-topbar {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 52px;
          background: var(--admin-sidebar-bg);
          border-bottom: 1px solid var(--admin-sidebar-border);
          z-index: 45;
          align-items: center;
          padding: 0 12px 0 4px;
          gap: 10px;
        }
        .admin-topbar__brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .admin-topbar__name {
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--admin-sidebar-text, #edeae6);
        }

        /* ── Burger inside topbar ── */
        .admin-burger {
          display: flex;
          width: 44px; height: 44px;
          border-radius: 8px;
          background: transparent;
          border: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .admin-burger:hover { background: var(--admin-sidebar-hover-bg, rgba(255,255,255,0.07)); }
        .admin-burger span {
          display: block;
          width: 18px; height: 1.5px;
          background: var(--admin-sidebar-text, #edeae6);
          border-radius: 2px;
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1),
                      opacity   0.2s ease;
        }
        .admin-burger[aria-expanded="true"] span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .admin-burger[aria-expanded="true"] span:nth-child(2) {
          opacity: 0;
        }
        .admin-burger[aria-expanded="true"] span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* ── Sidebar ── */
        .admin-sidebar {
          width: 220px;
          background: var(--admin-sidebar-bg);
          border-right: 1px solid var(--admin-sidebar-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0;
          height: 100%;
          z-index: 40;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Brand */
        .admin-sidebar__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 20px 18px;
          border-bottom: 1px solid var(--admin-sidebar-border);
          flex-shrink: 0;
        }
        .admin-sidebar__brand-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .admin-sidebar__brand-name {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--admin-sidebar-text);
          line-height: 1.1;
        }
        .admin-sidebar__brand-sub {
          font-size: 0.6875rem;
          color: var(--admin-sidebar-muted);
          letter-spacing: 0.03em;
        }

        /* ── Nav section label ── */
        .admin-nav-section {
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--admin-sidebar-muted);
          padding: 20px 16px 8px;
          flex-shrink: 0;
        }

        /* ── Nav container ── */
        .admin-sidebar-nav {
          display: flex;
          flex-direction: column;
          padding: 4px 8px;
          flex: 1;
          gap: 2px;
        }

        /* ── Nav link ── */
        .admin-nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--admin-sidebar-text);
          text-decoration: none;
          transition: background 0.18s ease, color 0.18s ease;
          white-space: nowrap;
          overflow: hidden;
        }
        .admin-nav-link:hover {
          background: var(--admin-sidebar-hover-bg);
          color: #fff;
        }
        .admin-nav-link.active {
          background: var(--admin-sidebar-active-bg);
          color: var(--admin-sidebar-active-text);
          font-weight: 600;
        }
        .admin-nav-link svg {
          flex-shrink: 0;
          opacity: 0.85;
        }
        .admin-nav-link.active svg {
          opacity: 1;
        }

        /* Footer */
        .admin-sidebar__footer {
          margin-top: auto;
          padding: 14px 16px 18px;
          border-top: 1px solid var(--admin-sidebar-border);
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }
        .admin-sidebar__user {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .admin-sidebar__user-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: var(--font-display);
          letter-spacing: 0.05em;
        }
        .admin-sidebar__user-email {
          font-size: 0.6875rem;
          color: var(--admin-sidebar-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        /* ── Content area ── */
        .admin-content {
          margin-left: 220px;
          flex: 1;
          min-width: 0;
          background: var(--admin-bg);
          transition: margin-left 0.3s cubic-bezier(0.16,1,0.3,1);
        }

        /* ── Overlay ── */
        .admin-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          z-index: 35;
          opacity: 0;
          transition: opacity 0.28s ease;
        }
        .admin-overlay.visible {
          opacity: 1;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .admin-topbar  { display: flex; }
          .admin-overlay { display: block; }
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-content {
            margin-left: 0;
            padding-top: 52px; /* height of topbar */
          }
        }

        /* Light mode overrides */
        [data-theme="light"] .admin-sidebar,
        :root:not([data-theme="dark"]) .admin-sidebar {
          background: #ffffff;
          border-right-color: var(--border);
        }
        [data-theme="light"] .admin-topbar,
        :root:not([data-theme="dark"]) .admin-topbar {
          background: #ffffff;
          border-bottom-color: var(--border);
        }
        [data-theme="light"] .admin-topbar__name,
        :root:not([data-theme="dark"]) .admin-topbar__name {
          color: var(--text);
        }
        [data-theme="light"] .admin-burger span,
        :root:not([data-theme="dark"]) .admin-burger span {
          background: var(--text);
        }
        [data-theme="light"] .admin-sidebar__brand,
        :root:not([data-theme="dark"]) .admin-sidebar__brand {
          border-bottom-color: var(--border);
        }
        [data-theme="light"] .admin-sidebar__footer,
        :root:not([data-theme="dark"]) .admin-sidebar__footer {
          border-top-color: var(--border);
        }
        [data-theme="light"] .admin-sidebar__brand-name,
        :root:not([data-theme="dark"]) .admin-sidebar__brand-name {
          color: var(--text);
        }
        [data-theme="light"] .admin-nav-link,
        :root:not([data-theme="dark"]) .admin-nav-link {
          color: var(--text-muted);
        }
        [data-theme="light"] .admin-nav-link:hover,
        :root:not([data-theme="dark"]) .admin-nav-link:hover {
          color: var(--text);
          background: var(--surface2);
        }
        [data-theme="light"] .admin-nav-link.active,
        :root:not([data-theme="dark"]) .admin-nav-link.active {
          color: var(--primary);
          background: var(--primary-subtle);
        }
        [data-theme="light"] .admin-nav-section,
        :root:not([data-theme="dark"]) .admin-nav-section {
          color: var(--text-faint);
        }
        [data-theme="light"] .admin-sidebar__user-email,
        :root:not([data-theme="dark"]) .admin-sidebar__user-email {
          color: var(--text-muted);
        }
      `}</style>

      {/* Mobile sidebar JS toggle */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var burger  = document.getElementById('admin-burger');
          var sidebar = document.getElementById('admin-sidebar');
          var overlay = document.getElementById('admin-overlay');
          if (!burger || !sidebar || !overlay) return;

          function open() {
            sidebar.classList.add('open');
            overlay.classList.add('visible');
            burger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
          }
          function close() {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }

          burger.addEventListener('click', function() {
            burger.getAttribute('aria-expanded') === 'true' ? close() : open();
          });
          overlay.addEventListener('click', close);

          sidebar.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', function() {
              if (window.innerWidth <= 768) close();
            });
          });

          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') close();
          });
        })();
      `}} />
    </div>
  );
}
