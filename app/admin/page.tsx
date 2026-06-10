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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
  ];

  const statusMap: Record<string, { label: string; cls: string }> = {
    new:         { label: "Новий",     cls: "status-new" },
    done:        { label: "Виконано",  cls: "status-done" },
    in_progress: { label: "В роботі",  cls: "status-progress" },
    cancelled:   { label: "Скасовано", cls: "status-cancel" },
    received:    { label: "Прийнято",  cls: "status-received" },
  };

  return (
    <div className="admin-page fade-in">

      {/* ── Page header ── */}
      <div className="admin-page-header">
        <div>
          <p className="section-eyebrow">Панель керування</p>
          <h1 className="admin-page-title">Дашборд</h1>
          <p className="admin-page-subtitle">Огляд активності та останніх записів</p>
        </div>
        <Link href="/admin/bookings" className="btn btn-primary btn-sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Всі замовлення
        </Link>
      </div>

      {/* ── KPI Stats ── */}
      <div className="dash-stats-grid">
        {stats.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            className="dash-stat-card"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="dash-stat-card__header">
              <span className="dash-stat-card__icon">{s.icon}</span>
              {s.badge !== null && s.badge > 0 && (
                <span className="status status-new dash-stat-card__badge">
                  +{s.badge} {s.badgeLabel}
                </span>
              )}
            </div>
            <p className="dash-stat-card__value" data-counter={s.value}>
              {s.value}
            </p>
            <p className="dash-stat-card__label">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* ── Recent Bookings ── */}
      <div>
        <div className="dash-section-header">
          <h2 className="dash-section-title">Останні замовлення</h2>
          <Link href="/admin/bookings" className="btn btn-ghost btn-sm">
            Всі
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="card-flat">
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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
                      <td className="cell-name">{b.name}</td>
                      <td className="cell-muted tabular">{b.phone}</td>
                      <td className="cell-muted truncate cell-service">{b.service || "—"}</td>
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

      <style>{`
        /* ── Stats grid ── */
        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }
        @media (max-width: 640px) {
          .dash-stats-grid { grid-template-columns: 1fr; }
        }

        /* ── Stat card ── */
        .dash-stat-card {
          display: block;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          text-decoration: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-spring);
          animation: fadeIn 0.4s ease both;
        }
        .dash-stat-card:hover {
          border-color: var(--border-accent);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .dash-stat-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
        }
        .dash-stat-card__icon {
          display: flex;
          align-items: center;
          color: var(--text-faint);
          transition: color var(--transition-base);
        }
        .dash-stat-card:hover .dash-stat-card__icon {
          color: var(--primary);
        }
        .dash-stat-card__badge {
          font-size: 10px !important;
        }
        .dash-stat-card__value {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 2.75rem);
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: var(--space-1);
          transition: color var(--transition-base);
        }
        .dash-stat-card:hover .dash-stat-card__value {
          color: var(--primary);
        }
        .dash-stat-card__label {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── Section header ── */
        .dash-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
        }
        .dash-section-title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text);
        }

        /* ── Table cells ── */
        .cell-name   { font-weight: 600; color: var(--text); }
        .cell-muted  { color: var(--text-muted); }
        .cell-faint  { color: var(--text-faint); }
        .cell-service { max-width: 180px; }
        .tabular  { font-variant-numeric: tabular-nums; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* ── Counter animation ── */
        @keyframes countUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-stat-card__value[data-counter] {
          animation: countUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-counter'), 10);
            if (isNaN(target) || target === 0) return;
            var duration = 700;
            var start = null;
            function ease(t) { return 1 - Math.pow(1 - t, 3); }
            function step(ts) {
              if (!start) start = ts;
              var progress = Math.min((ts - start) / duration, 1);
              el.textContent = Math.round(ease(progress) * target);
              if (progress < 1) requestAnimationFrame(step);
              else el.textContent = target;
            }
            requestAnimationFrame(step);
          }
          document.querySelectorAll('[data-counter]').forEach(function(el) {
            var obs = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting) { animateCounter(el); obs.unobserve(el); }
              });
            }, { threshold: 0.3 });
            obs.observe(el);
          });
        })();
      `}} />
    </div>
  );
}
