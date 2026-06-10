export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <div className="admin-page fade-in">

      {/* ── Header ── */}
      <div className="admin-page-header">
        <div>
          <p className="section-eyebrow">База даних</p>
          <h1 className="admin-page-title">Клієнти</h1>
          <p className="admin-page-subtitle">{clients.length} зареєстрованих</p>
        </div>
      </div>

      {/* ── Empty state ── */}
      {clients.length === 0 ? (
        <div className="card-flat">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="20" cy="16" r="7"/>
                <path d="M4 40c0-8.837 7.163-16 16-16s16 7.163 16 16"/>
                <path d="M34 14a6 6 0 0 1 0 12"/>
                <path d="M44 40c0-7.18-4.477-13.33-10.76-15.78"/>
              </svg>
            </div>
            <h3>Клієнтів поки немає</h3>
            <p>Клієнти з’являються після першого входу або бронювання.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {["\u0406\u043c\u2019\u044f", "Email", "\u0422\u0435\u043b\u0435\u0444\u043e\u043d", "\u0417\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u044c", "\u0414\u0430\u0442\u0430 \u0440\u0435\u0454\u0441трації"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="cell-name">{c.name || "—"}</td>
                  <td className="cell-muted">{c.email}</td>
                  <td className="cell-muted">
                    {c.phone ? (
                      <a
                        href={`tel:${c.phone}`}
                        className="cl-phone-link"
                      >
                        {c.phone}
                      </a>
                    ) : "—"}
                  </td>
                  <td>
                    <span className="cl-booking-badge">
                      {c._count.bookings}
                    </span>
                  </td>
                  <td className="cell-faint tabular">
                    {new Date(c.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .cl-phone-link {
          color: var(--accent);
          font-weight: 500;
          text-decoration: none;
          font-variant-numeric: tabular-nums;
          transition: opacity var(--transition-fast);
        }
        .cl-phone-link:hover {
          opacity: 0.75;
          text-decoration: underline;
        }
        .cl-booking-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-subtle);
          color: var(--accent);
          font-size: var(--text-xs);
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}
