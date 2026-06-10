"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <button
        onClick={handleLogout}
        className="admin-logout-btn"
        aria-label="Вийти з акаунту"
      >
        <LogOut size={13} strokeWidth={1.75} />
        Вийти
      </button>

      <style>{`
        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.75rem;
          font-family: var(--font-body, 'Satoshi', sans-serif);
          font-weight: 500;
          color: var(--color-text-muted, #7a7672);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 180ms ease;
          letter-spacing: 0.01em;
        }
        .admin-logout-btn:hover {
          color: var(--color-accent, #b91c1c);
        }
        :root:not([data-theme="dark"]) .admin-logout-btn {
          color: var(--color-text-muted, #6b6b69);
        }
      `}</style>
    </>
  );
}
