export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [bookingsCount, newBookings, messagesCount, newMessages, clientsCount] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "new" } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "new" } }),
      prisma.client.count(),
    ]);

  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    {
      label: "Замовлень",
      value: bookingsCount,
      badge: newBookings,
      badgeLabel: "нових",
      href: "/admin/bookings",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
    },
    {
      label: "Повідомлень",
      value: messagesCount,
      badge: newMessages,
      badgeLabel: "нових",
      href: "/admin/contacts",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      label: "Клієнтів",
      value: clientsCount,
      badge: null,
      badgeLabel: "",
      href: "/admin/clients",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
  ];

  const statusMap: Record<string, { label: string; cls: string }> = {
    new:          { label: "Новий",     cls: "status-new" },
    done:         { label: "Виконано",  cls: "status-done" },
    in_progress:  { label: "В роботі",  cls: "status-progress" },
    cancelled:    { label: "Скасовано", cls: "status-cancel" },
    received:     { label: "Прийнято",  cls: "status-received" },
  };

  return (
    <div className="admin-page fade-in">
      {/* ── Page header ── */}
      <div className="admin-page-header">
        <div>
          <p className="section-eyebrow">Панель керування</p>
          <h1 className="admin-page-title">Дашборд</h1>
          <p className="admin-page-subtitle">
            Огляд активності та останніх записів
          </p>
        </div>
        <Link href="/admin/bookings" className="btn btn-primary btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Всі замовлення
        </Link>
      </div>

      {/* ── KPI Stats ── */}
      <div className="admin-stats-grid">
        {stats.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            className="card-stat"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <span style={{ color: "var(--text-faint)" }}>{s.icon}</span>
              {s.badge !== null && s.badge > 0 && (
                <span className="status status-new" style={{ fontSize: "10px" }}>
                  +{s.badge} {s.badgeLabel}
                </span>
              )}
            </div>
            <p className="stat-number">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* ── Recent Bookings ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text)" }}>
            Останні замовлення
          </h2>
          <Link href="/admin/bookings" className="btn btn-ghost btn-sm" style={{ color: "var(--text-muted)" }}>
            Всі
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="card-flat">
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="8" y="8" width="32" height="36" rx="3"/>
                  <line x1="16" y1="20" x2="32" y2="20"/>
                  <line x1="16" y1="27" x2="28" y2="27"/>
                  <line x1="16" y1="34" x2="24" y2="34"/>
                </svg>
              </div>
              <h3>Замовлень поки немає</h3>
              <p>Нові записи клієнтів з&apos;являться тут після бронювання.</p>
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {["Ім'я", "Телефон", "Послуга", "Статус", "Дата"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => {
                  const st = statusMap[b.status] ?? { label: b.status, cls: "status-cancel" };
                  return (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 600, color: "var(--text)" }}>{b.name}</td>
                      <td className="cell-muted tabular">{b.phone}</td>
                      <td className="cell-muted truncate" style={{ maxWidth: 180 }}>{b.service || "—"}</td>
                      <td>
                        <span className={`status ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="cell-faint tabular">
                        {new Date(b.createdAt).toLocaleDateString("uk-UA")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
