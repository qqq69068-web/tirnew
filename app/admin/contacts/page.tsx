"use client";

import { useEffect, useState } from "react";
import { CheckCheck, Phone, Calendar } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_CLASS: Record<string, string> = {
  new:  "status status-new",
  read: "status status-progress",
  done: "status status-done",
};
const STATUS_LABELS: Record<string, string> = {
  new:  "Нове",
  read: "Переглянуто",
  done: "Оброблено",
};

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((data) => { setMessages(data); setLoading(false); });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="admin-page fade-in">
        <div className="admin-page-header">
          <div>
            <p className="section-eyebrow">Зв"язок</p>
            <h1 className="admin-page-title">Повідомлення</h1>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {[1,2,3].map(i => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      </div>
    );
  }

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="admin-page fade-in">

      {/* ── Header ── */}
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div>
            <p className="section-eyebrow">Зв"язок</p>
            <h1 className="admin-page-title">Повідомлення</h1>
          </div>
          {newCount > 0 && (
            <span className="status status-new" style={{ alignSelf: "flex-end", marginBottom: 4 }}>
              {newCount} нових
            </span>
          )}
        </div>
      </div>

      {/* ── Empty ── */}
      {messages.length === 0 ? (
        <div className="card-flat">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M40 8H8a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h8l8 8 8-8h8a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z"/>
                <line x1="16" y1="18" x2="32" y2="18"/>
                <line x1="16" y1="25" x2="26" y2="25"/>
              </svg>
            </div>
            <h3>Повідомлень поки немає</h3>
            <p>Нові звернення з форми контактів з’являться тут.</p>
          </div>
        </div>
      ) : (
        <div className="cm-list">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`cm-card${m.status === "new" ? " cm-card--new" : ""}`}
            >
              <div className="cm-card__body">
                <div className="cm-card__left">
                  <div className="cm-card__header">
                    <span className="cm-card__name">{m.name}</span>
                    <span className={STATUS_CLASS[m.status] || "status status-cancel"}>
                      {STATUS_LABELS[m.status] || m.status}
                    </span>
                  </div>
                  <p className="cm-card__message">{m.message}</p>
                  <div className="cm-card__meta">
                    <a href={`tel:${m.phone}`} className="cm-card__phone">
                      <Phone size={12} aria-hidden="true" />
                      {m.phone}
                    </a>
                    <span className="cm-card__date">
                      <Calendar size={12} aria-hidden="true" />
                      {new Date(m.createdAt).toLocaleString("uk-UA")}
                    </span>
                  </div>
                </div>

                <div className="cm-card__actions">
                  {m.status === "new" && (
                    <button
                      onClick={() => updateStatus(m.id, "read")}
                      disabled={updating === m.id}
                      className="btn btn-outline btn-sm"
                    >
                      Переглянуто
                    </button>
                  )}
                  {m.status !== "done" && (
                    <button
                      onClick={() => updateStatus(m.id, "done")}
                      disabled={updating === m.id}
                      className="btn btn-ghost btn-sm cm-done-btn"
                    >
                      <CheckCheck size={13} aria-hidden="true" />
                      Оброблено
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .cm-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .cm-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .cm-card--new {
          border-color: var(--status-new-border, oklch(from var(--color-accent-warm, #b45309) l c h / 0.35));
          box-shadow: var(--shadow-sm);
        }
        .cm-card__body {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4);
          padding: var(--space-4) var(--space-5);
        }
        .cm-card__left {
          flex: 1;
          min-width: 0;
        }
        .cm-card__header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
          flex-wrap: wrap;
        }
        .cm-card__name {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text);
        }
        .cm-card__message {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.65;
          margin-bottom: var(--space-3);
          max-width: none;
        }
        .cm-card__meta {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .cm-card__phone {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--accent);
          text-decoration: none;
          font-variant-numeric: tabular-nums;
          transition: opacity var(--transition-fast);
        }
        .cm-card__phone:hover { opacity: 0.75; }
        .cm-card__date {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: var(--text-xs);
          color: var(--text-faint);
          font-variant-numeric: tabular-nums;
        }
        .cm-card__actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          flex-shrink: 0;
        }
        .cm-done-btn {
          color: var(--status-done-text) !important;
        }
        .cm-done-btn:hover {
          background: var(--status-done-bg) !important;
        }
      `}</style>
    </div>
  );
}
