"use client";

import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";

interface Props {
  email: string;
  children: React.ReactNode;
}

export default function AdminShell({ email, children }: Props) {
  useEffect(() => {
    const burger  = document.getElementById("admin-burger") as HTMLButtonElement | null;
    const sidebar = document.getElementById("admin-sidebar") as HTMLElement | null;
    const overlay = document.getElementById("admin-overlay") as HTMLElement | null;
    if (!burger || !sidebar || !overlay) return;

    function open() {
      sidebar!.classList.add("open");
      overlay!.classList.add("visible");
      burger!.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function close() {
      sidebar!.classList.remove("open");
      overlay!.classList.remove("visible");
      burger!.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    const onBurger = () => (burger.getAttribute("aria-expanded") === "true" ? close() : open());
    const onOverlay = () => close();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    const onLink = (e: Event) => { if (window.innerWidth <= 768) close(); };

    burger.addEventListener("click", onBurger);
    overlay.addEventListener("click", onOverlay);
    document.addEventListener("keydown", onKey);
    sidebar.querySelectorAll("a").forEach((a) => a.addEventListener("click", onLink));

    return () => {
      burger.removeEventListener("click", onBurger);
      overlay.removeEventListener("click", onOverlay);
      document.removeEventListener("keydown", onKey);
      sidebar.querySelectorAll("a").forEach((a) => a.removeEventListener("click", onLink));
      document.body.style.overflow = "";
    };
  }, []);

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
          {/* Truck icon */}
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="4" y="18" width="20" height="14" rx="2" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
            <rect x="22" y="14" width="14" height="18" rx="2" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
            <circle cx="10" cy="33" r="3" fill="var(--primary)" />
            <circle cx="28" cy="33" r="3" fill="var(--primary)" />
            <circle cx="34" cy="33" r="3" fill="var(--primary)" />
          </svg>
          <span className="admin-topbar__name">DVTrucks</span>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div id="admin-overlay" className="admin-overlay" aria-hidden="true" />

      {/* ── Sidebar ── */}
      <aside id="admin-sidebar" className="admin-sidebar" role="navigation" aria-label="Адмін навігація">
        <div className="admin-sidebar__brand">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-label="DVTrucks logo">
            <rect x="4" y="18" width="20" height="14" rx="2" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
            <rect x="22" y="14" width="14" height="18" rx="2" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
            <circle cx="10" cy="33" r="3" fill="var(--primary)" />
            <circle cx="28" cy="33" r="3" fill="var(--primary)" />
            <circle cx="34" cy="33" r="3" fill="var(--primary)" />
          </svg>
          <div className="admin-sidebar__brand-text">
            <span className="admin-sidebar__brand-name">DVTrucks</span>
            <span className="admin-sidebar__brand-sub">Адмін-панель</span>
          </div>
        </div>

        <AdminSidebar />

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-avatar">
              {email?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <span className="admin-sidebar__user-email" title={email}>
              {email}
            </span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
