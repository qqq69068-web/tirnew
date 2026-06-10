"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Save, Mail, Calendar, Plus, X, Wrench, Package } from "lucide-react";
import { services } from "@/lib/services";

interface Booking {
  id: string;
  name: string;
  phone: string;
  carBrand: string | null;
  carModel: string | null;
  service: string | null;
  progress: string;
  price: number | null;
  partsCost: number | null;
  workItems: string[];
  clientEmail: string | null;
  status: string;
  createdAt: string;
  message: string | null;
  scheduledAt: string | null;
}

const PROGRESS_OPTIONS = [
  { value: "received",    label: "Заявку прийнято" },
  { value: "diagnostics", label: "Діагностика" },
  { value: "in_progress", label: "В роботі" },
  { value: "done",        label: "Готово до видачі" },
];

const PROGRESS_STATUS_CLASS: Record<string, string> = {
  received:    "status status-received",
  diagnostics: "status status-progress",
  in_progress: "status status-progress",
  done:        "status status-done",
};

function toLocalDatetimeInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [edits, setEdits]       = useState<Record<string, Record<string, unknown>>>({});
  const [saving, setSaving]     = useState<string | null>(null);
  const [saved, setSaved]       = useState<string | null>(null);
  const [newWorkItem, setNewWorkItem] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => { setBookings(data); setLoading(false); });
  }, []);

  const getServiceLabel = (slug: string | null) =>
    services.find((s) => s.slug === slug)?.title || slug || "—";

  const setEdit = (id: string, field: string, value: unknown) =>
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const getWorkItems = (b: Booking) =>
    (edits[b.id]?.workItems as string[]) ?? b.workItems ?? [];

  const addWorkItem = (id: string) => {
    const text = (newWorkItem[id] || "").trim();
    if (!text) return;
    const current = getWorkItems(bookings.find((b) => b.id === id)!);
    setEdit(id, "workItems", [...current, text]);
    setNewWorkItem((prev) => ({ ...prev, [id]: "" }));
  };

  const removeWorkItem = (id: string, idx: number) => {
    const current = getWorkItems(bookings.find((b) => b.id === id)!);
    setEdit(id, "workItems", current.filter((_, i) => i !== idx));
  };

  const save = async (id: string) => {
    setSaving(id);
    const body = { ...edits[id] } as Record<string, unknown>;
    if (body.scheduledAt && typeof body.scheduledAt === "string" && body.scheduledAt !== "") {
      body.scheduledAt = new Date(body.scheduledAt as string).toISOString();
    } else if (body.scheduledAt === "") {
      body.scheduledAt = null;
    }
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...body } as unknown as Booking : b))
    );
    setSaving(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  if (loading) {
    return (
      <div className="admin-page fade-in">
        <div className="admin-page-header">
          <div>
            <p className="section-eyebrow">Керування</p>
            <h1 className="admin-page-title">Замовлення</h1>
          </div>
        </div>
        <div className="bk-skeleton-list">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton" style={{ height: 68, borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in">

      {/* ── Header ── */}
      <div className="admin-page-header">
        <div>
          <p className="section-eyebrow">Керування</p>
          <h1 className="admin-page-title">Замовлення</h1>
          <p className="admin-page-subtitle">{bookings.length} записів усього</p>
        </div>
      </div>

      {/* ── Empty state ── */}
      {bookings.length === 0 && (
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
            <p>Нові записи клієнтів з'являться тут після бронювання.</p>
          </div>
        </div>
      )}

      {/* ── Bookings accordion list ── */}
      <div className="bk-list">
        {bookings.map((b) => {
          const edit = edits[b.id] || {};
          const currentProgress = (edit.progress as string) || b.progress || "received";
          const isOpen = expanded === b.id;
          const scheduledValue = "scheduledAt" in edit
            ? (edit.scheduledAt as string)
            : toLocalDatetimeInput(b.scheduledAt);
          const workItems = getWorkItems(b);
          const progressLabel = PROGRESS_OPTIONS.find((p) => p.value === b.progress)?.label || "Заявку прийнято";
          const progressCls   = PROGRESS_STATUS_CLASS[b.progress] || "status status-cancel";
          const totalCost = (parseFloat(String(edit.price ?? b.price ?? 0)) || 0)
                          + (parseFloat(String(edit.partsCost ?? b.partsCost ?? 0)) || 0);

          return (
            <div key={b.id} className={`bk-card${isOpen ? " bk-card--open" : ""}`}>

              {/* ── Summary row ── */}
              <button
                onClick={() => setExpanded(isOpen ? null : b.id)}
                className="bk-card__summary"
                aria-expanded={isOpen}
              >
                <div className="bk-card__info">
                  <div className="bk-card__client">
                    <p className="bk-card__name">{b.name}</p>
                    <p className="bk-card__phone">{b.phone}</p>
                  </div>
                  <div className="bk-card__car">
                    <p className="bk-card__car-model">{b.carBrand} {b.carModel}</p>
                    <p className="bk-card__service">{getServiceLabel(b.service)}</p>
                  </div>
                </div>

                <div className="bk-card__meta">
                  {b.scheduledAt && (
                    <span className="bk-card__scheduled">
                      <Calendar size={11} aria-hidden="true" />
                      {new Date(b.scheduledAt).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                  <span className={progressCls}>{progressLabel}</span>
                  {(b.price || b.partsCost) && (
                    <span className="bk-card__price">
                      {((b.price || 0) + (b.partsCost || 0)).toFixed(0)} ₴
                    </span>
                  )}
                  {isOpen
                    ? <ChevronUp  size={16} className="bk-card__chevron" aria-hidden="true" />
                    : <ChevronDown size={16} className="bk-card__chevron" aria-hidden="true" />
                  }
                </div>
              </button>

              {/* ── Expanded edit panel ── */}
              {isOpen && (
                <div className="bk-card__body">

                  {/* Message from client */}
                  {b.message && (
                    <div className="bk-message">
                      <p>{b.message}</p>
                    </div>
                  )}

                  {/* Fields grid */}
                  <div className="bk-fields">
                    <div className="form-group">
                      <label className="form-label">Статус прогресу</label>
                      <select
                        value={currentProgress}
                        onChange={(e) => setEdit(b.id, "progress", e.target.value)}
                        className="input bk-input"
                      >
                        {PROGRESS_OPTIONS.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Calendar size={12} aria-hidden="true" style={{ display:"inline", marginRight:4, verticalAlign:"middle" }} />
                        Дата та час запису
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledValue}
                        onChange={(e) => setEdit(b.id, "scheduledAt", e.target.value)}
                        className="input bk-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ціна роботи (₴)</label>
                      <input
                        type="number"
                        defaultValue={b.price || ""}
                        onChange={(e) => setEdit(b.id, "price", e.target.value)}
                        placeholder="0"
                        className="input bk-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Package size={12} aria-hidden="true" style={{ display:"inline", marginRight:4, verticalAlign:"middle" }} />
                        Вартість деталей (₴)
                      </label>
                      <input
                        type="number"
                        defaultValue={b.partsCost || ""}
                        onChange={(e) => setEdit(b.id, "partsCost", e.target.value)}
                        placeholder="0"
                        className="input bk-input"
                      />
                    </div>

                    <div className="form-group bk-fields__full">
                      <label className="form-label">
                        <Mail size={12} aria-hidden="true" style={{ display:"inline", marginRight:4, verticalAlign:"middle" }} />
                        Email клієнта
                      </label>
                      <input
                        type="email"
                        defaultValue={b.clientEmail || ""}
                        onChange={(e) => setEdit(b.id, "clientEmail", e.target.value)}
                        placeholder="client@email.com"
                        className="input bk-input"
                      />
                    </div>
                  </div>

                  {/* Work items */}
                  <div className="form-group">
                    <label className="form-label">
                      <Wrench size={12} aria-hidden="true" style={{ display:"inline", marginRight:4, verticalAlign:"middle" }} />
                      Список виконаних робіт
                    </label>
                    <div className="bk-worklist">
                      {workItems.length === 0 && (
                        <p className="bk-worklist__empty">Роботи ще не додано</p>
                      )}
                      {workItems.map((item, idx) => (
                        <div key={idx} className="bk-worklist__item">
                          <span className="bk-worklist__num">{idx + 1}.</span>
                          <span className="bk-worklist__text">{item}</span>
                          <button
                            onClick={() => removeWorkItem(b.id, idx)}
                            className="bk-worklist__remove"
                            aria-label="Видалити роботу"
                          >
                            <X size={13} aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="bk-addwork">
                      <input
                        type="text"
                        value={newWorkItem[b.id] || ""}
                        onChange={(e) => setNewWorkItem((prev) => ({ ...prev, [b.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && addWorkItem(b.id)}
                        placeholder="Наприклад: Заміна масла..."
                        className="input bk-input"
                      />
                      <button
                        onClick={() => addWorkItem(b.id)}
                        className="btn btn-outline btn-sm"
                        type="button"
                      >
                        <Plus size={14} aria-hidden="true" />
                        Додати
                      </button>
                    </div>
                  </div>

                  {/* Total cost */}
                  {totalCost > 0 && (
                    <div className="bk-total">
                      <span className="bk-total__label">Загальна сума</span>
                      <span className="bk-total__value">{totalCost.toFixed(0)} ₴</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="bk-actions">
                    <button
                      onClick={() => save(b.id)}
                      disabled={saving === b.id}
                      className="btn btn-primary btn-sm"
                    >
                      {saving === b.id ? (
                        <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                        </svg>
                      ) : (
                        <Save size={14} aria-hidden="true" />
                      )}
                      {saving === b.id ? "Зберігаємо..." : "Зберегти"}
                    </button>

                    {saved === b.id && (
                      <span className="bk-saved-msg">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Збережено
                      </span>
                    )}

                    <span className="bk-actions__date">
                      {new Date(b.createdAt).toLocaleString("uk-UA")}
                    </span>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* Skeleton loading */
        .bk-skeleton-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        /* Booking list */
        .bk-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        /* Booking card */
        .bk-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .bk-card--open {
          border-color: var(--border-accent);
          box-shadow: var(--shadow-sm);
        }
        .bk-card:hover:not(.bk-card--open) {
          border-color: var(--border-strong);
        }

        /* Summary row (collapsed header) */
        .bk-card__summary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          padding: var(--space-4) var(--space-5);
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background var(--transition-fast);
        }
        .bk-card__summary:hover {
          background: var(--surface2);
        }

        .bk-card__info {
          display: flex;
          align-items: center;
          gap: var(--space-5);
          min-width: 0;
          flex: 1;
        }
        .bk-card__client {
          flex-shrink: 0;
        }
        .bk-card__name {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text);
          line-height: 1.3;
        }
        .bk-card__phone {
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
          margin-top: 2px;
        }
        .bk-card__car {
          display: none;
          min-width: 0;
        }
        @media (min-width: 640px) {
          .bk-card__car { display: block; }
        }
        .bk-card__car-model {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.3;
        }
        .bk-card__service {
          font-size: var(--text-xs);
          color: var(--text-faint);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .bk-card__meta {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-shrink: 0;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .bk-card__scheduled {
          display: none;
          align-items: center;
          gap: 4px;
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
        }
        @media (min-width: 640px) {
          .bk-card__scheduled { display: flex; }
        }
        .bk-card__price {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--accent);
          font-variant-numeric: tabular-nums;
        }
        .bk-card__chevron {
          color: var(--text-faint);
          transition: transform var(--transition-fast);
          flex-shrink: 0;
        }

        /* Expanded body */
        .bk-card__body {
          border-top: 1px solid var(--border);
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          animation: fadeIn 0.18s ease both;
          background: var(--surface2);
        }

        /* Client message */
        .bk-message {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: var(--space-3) var(--space-4);
        }
        .bk-message p {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.6;
          max-width: none;
        }

        /* Fields grid */
        .bk-fields {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 540px) {
          .bk-fields { grid-template-columns: 1fr 1fr; }
        }
        .bk-fields__full {
          grid-column: 1 / -1;
        }

        /* ── Force correct colors on all inputs inside expanded panel ── */
        .bk-input,
        .bk-card__body .input {
          background: var(--surface) !important;
          color: var(--text) !important;
          border-color: var(--border-strong) !important;
        }
        .bk-input:focus,
        .bk-card__body .input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px var(--primary-glow) !important;
          outline: none;
        }
        .bk-input::placeholder,
        .bk-card__body .input::placeholder {
          color: var(--text-faint) !important;
        }
        /* Fix native select dropdown option colors */
        .bk-input option,
        .bk-card__body .input option {
          background: var(--surface);
          color: var(--text);
        }
        /* Fix datetime-local calendar icon color in dark mode */
        .bk-input::-webkit-calendar-picker-indicator {
          filter: var(--calendar-icon-filter, none);
          opacity: 0.6;
          cursor: pointer;
        }
        [data-theme="dark"] .bk-input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
        }
        /* form-label inside body */
        .bk-card__body .form-label {
          color: var(--text-muted);
        }

        /* Work items list */
        .bk-worklist {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          margin-bottom: var(--space-2);
          min-height: 24px;
        }
        .bk-worklist__empty {
          font-size: var(--text-xs);
          color: var(--text-faint);
          font-style: italic;
          padding: var(--space-2) 0;
        }
        .bk-worklist__item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: var(--space-2) var(--space-3);
          animation: fadeIn 0.2s ease both;
        }
        .bk-worklist__num {
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--accent);
          flex-shrink: 0;
          width: 18px;
          font-variant-numeric: tabular-nums;
        }
        .bk-worklist__text {
          font-size: var(--text-sm);
          color: var(--text);
          flex: 1;
        }
        .bk-worklist__remove {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: var(--radius);
          color: var(--text-faint);
          transition: color var(--transition-fast), background var(--transition-fast);
          flex-shrink: 0;
        }
        .bk-worklist__remove:hover {
          color: var(--primary);
          background: var(--primary-subtle);
        }

        /* Add work row */
        .bk-addwork {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }
        .bk-addwork .input {
          flex: 1;
        }

        /* Total cost row */
        .bk-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--accent-subtle);
          border: 1px solid var(--accent-border);
          border-radius: var(--radius);
          padding: var(--space-3) var(--space-4);
        }
        .bk-total__label {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .bk-total__value {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--accent);
          font-variant-numeric: tabular-nums;
        }

        /* Actions row */
        .bk-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
        }
        .bk-actions__date {
          font-size: var(--text-xs);
          color: var(--text-faint);
          margin-left: auto;
          font-variant-numeric: tabular-nums;
        }

        /* Saved confirmation */
        .bk-saved-msg {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--status-done-text);
          animation: fadeIn 0.2s ease both;
        }
      `}</style>
    </div>
  );
}
