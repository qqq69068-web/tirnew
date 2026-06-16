"use client";

import { useState } from "react";
import { Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, ExternalLink } from "lucide-react";

type Service = {
  id: string;
  slug: string;
  title: string;
  short: string;
  description: string;
  price: string;
  priceMin: number;
  priceMax: number;
  priceCar: number | null;
  priceTruck: number | null;
  priceTrailer: number | null;
  hours: string;
  image: string;
  category: string;
  details: string[];
  order: number;
  active: boolean;
};

export default function AdminServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editing, setEditing]   = useState<Service | null>(null);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleActive(s: Service) {
    const res = await fetch(`/api/admin/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setServices((prev) => prev.map((x) => (x.id === s.id ? updated : x)));
    }
  }

  async function deleteService(s: Service) {
    if (!confirm(`Видалити «${s.title}»?`)) return;
    const res = await fetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
    if (res.ok) setServices((prev) => prev.filter((x) => x.id !== s.id));
  }

  async function saveEditing() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`/api/admin/services/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      const updated = await res.json();
      setServices((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setEditing(null);
    }
    setSaving(false);
  }

  function setField<K extends keyof Service>(key: K, val: Service[K]) {
    setEditing((e) => (e ? { ...e, [key]: val } : e));
  }

  return (
    <div className="admin-page fade-in">

      {/* ── Header ── */}
      <div className="admin-page-header">
        <div>
          <p className="section-eyebrow">Каталог</p>
          <h1 className="admin-page-title">Послуги</h1>
          <p className="admin-page-subtitle">{services.length} позицій</p>
        </div>
        <div className="sv-search-wrap">
          <input
            type="search"
            placeholder="Пошук..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm"
            aria-label="Пошук послуги"
          />
        </div>
      </div>

      {/* ── Desktop table (≥ 640px) ── */}
      <div className="table-wrap sv-table-desktop">
        <table className="data-table">
          <thead>
            <tr>
              {["#", "Назва", "Категорія", "Ціни", "Статус", ""].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} style={{ opacity: s.active ? 1 : 0.45 }}>
                <td className="cell-faint tabular" style={{ width: 36 }}>{s.order}</td>
                <td>
                  <p className="cell-name" style={{ marginBottom: 2 }}>{s.title}</p>
                  <p className="cell-faint" style={{ fontSize: "var(--text-xs)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>{s.short}</p>
                </td>
                <td>
                  <span className="badge badge-subtle">{s.category}</span>
                </td>
                <td className="cell-muted" style={{ fontSize: "var(--text-xs)", fontVariantNumeric: "tabular-nums" }}>
                  {s.priceCar    != null && <div>Легкове: {s.priceCar} ₴</div>}
                  {s.priceTruck  != null && <div>Вант.: {s.priceTruck} ₴</div>}
                  {s.priceTrailer!= null && <div>Причіп: {s.priceTrailer} ₴</div>}
                  {s.priceCar == null && s.priceTruck == null && s.priceTrailer == null && (
                    <div>від {s.priceMin} ₴</div>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => toggleActive(s)}
                    title={s.active ? "Деактивувати" : "Активувати"}
                    aria-label={s.active ? "Деактивувати" : "Активувати"}
                    className="sv-toggle"
                  >
                    {s.active
                      ? <ToggleRight size={22} className="sv-toggle--on"  aria-hidden="true" />
                      : <ToggleLeft  size={22} className="sv-toggle--off" aria-hidden="true" />}
                  </button>
                </td>
                <td>
                  <div className="sv-row-actions">
                    <button onClick={() => setEditing(s)} className="sv-action-btn" aria-label="Редагувати">
                      <Pencil size={15} aria-hidden="true" />
                    </button>
                    <button onClick={() => deleteService(s)} className="sv-action-btn sv-action-btn--danger" aria-label="Видалити">
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list (< 640px) ── */}
      <div className="sv-card-list sv-card-mobile">
        {filtered.map((s) => (
          <div key={s.id} className={`sv-card${s.active ? "" : " sv-card--inactive"}`}>

            {/* Top row: order + title + toggle */}
            <div className="sv-card__top">
              <span className="sv-card__order">{s.order}</span>
              <div className="sv-card__info">
                <p className="sv-card__title">{s.title}</p>
                <span className="badge badge-subtle">{s.category}</span>
              </div>
              <button
                onClick={() => toggleActive(s)}
                className="sv-toggle sv-toggle--card"
                aria-label={s.active ? "Деактивувати" : "Активувати"}
              >
                {s.active
                  ? <ToggleRight size={26} className="sv-toggle--on"  aria-hidden="true" />
                  : <ToggleLeft  size={26} className="sv-toggle--off" aria-hidden="true" />}
              </button>
            </div>

            {/* Price row */}
            <div className="sv-card__price">
              {s.priceCar    != null && <span>Лег.: {s.priceCar} ₴</span>}
              {s.priceTruck  != null && <span>Тягач: {s.priceTruck} ₴</span>}
              {s.priceTrailer!= null && <span>Причіп: {s.priceTrailer} ₴</span>}
              {s.priceCar == null && s.priceTruck == null && s.priceTrailer == null && (
                <span>від {s.priceMin} ₴</span>
              )}
            </div>

            {/* Actions */}
            <div className="sv-card__actions">
              <a
                href={`/services/${s.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm sv-card__btn"
              >
                <ExternalLink size={14} aria-hidden="true" />
                Переглянути
              </a>
              <button
                onClick={() => setEditing(s)}
                className="btn btn-outline btn-sm sv-card__btn"
              >
                <Pencil size={14} aria-hidden="true" />
                Редагувати
              </button>
              <button
                onClick={() => deleteService(s)}
                className="btn btn-sm sv-card__btn sv-card__btn--danger"
              >
                <Trash2 size={14} aria-hidden="true" />
                Видалити
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── Edit modal ── */}
      {editing && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Редагування послуги">
          <div className="modal-panel modal-panel--lg sv-modal">
            <div className="modal-header">
              <h2 className="modal-title">Редагувати послугу</h2>
              <button onClick={() => setEditing(null)} className="modal-close" aria-label="Закрити">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="sv-modal-body">
              <Field label="Назва"        value={editing.title}       onChange={(v) => setField("title", v)} />
              <Field label="Slug"          value={editing.slug}        onChange={(v) => setField("slug", v)} />
              <Field label="Категорія"    value={editing.category}    onChange={(v) => setField("category", v)} />
              <Field label="Короткий опис" value={editing.short}       onChange={(v) => setField("short", v)}  textarea />
              <Field label="Повний опис"  value={editing.description} onChange={(v) => setField("description", v)} textarea />

              <div className="sv-2col">
                <Field label="Ціна (текст)"  value={editing.price}        onChange={(v) => setField("price", v)} />
                <Field label="Час роботи"  value={editing.hours}        onChange={(v) => setField("hours", v)} />
              </div>
              <div className="sv-2col">
                <Field label="Ціна від (₴)" value={String(editing.priceMin)}  onChange={(v) => setField("priceMin", Number(v))} type="number" />
                <Field label="Ціна до (₴)" value={String(editing.priceMax)}  onChange={(v) => setField("priceMax", Number(v))} type="number" />
              </div>

              <div className="sv-vehicle-prices">
                <p className="sv-vehicle-prices__title">Ціни по типу транспорту</p>
                <p className="sv-vehicle-prices__hint">Залиш порожнім, якщо ціна не залежить від типу авто</p>
                <div className="sv-3col">
                  <Field label="Легкове (₴)"       value={editing.priceCar    != null ? String(editing.priceCar)    : ""} onChange={(v) => setField("priceCar",    v === "" ? null : Number(v))} type="number" />
                  <Field label="Вант. / Тягач (₴)" value={editing.priceTruck   != null ? String(editing.priceTruck)   : ""} onChange={(v) => setField("priceTruck",   v === "" ? null : Number(v))} type="number" />
                  <Field label="Причіп (₴)"       value={editing.priceTrailer!= null ? String(editing.priceTrailer): ""} onChange={(v) => setField("priceTrailer", v === "" ? null : Number(v))} type="number" />
                </div>
              </div>

              <Field label="URL фото" value={editing.image} onChange={(v) => setField("image", v)} />
              {editing.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.image} alt="preview" width={640} height={160} loading="lazy" className="sv-img-preview" />
              )}

              <div className="form-group">
                <label className="form-label">Деталі (по одному на рядкок)</label>
                <textarea rows={4} value={editing.details.join("\n")} onChange={(e) => setField("details", e.target.value.split("\n"))} className="input" />
              </div>

              <div className="sv-2col">
                <Field label="Порядок" value={String(editing.order)} onChange={(v) => setField("order", Number(v))} type="number" />
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setEditing(null)} className="btn btn-ghost btn-sm">Скасувати</button>
              <button onClick={saveEditing} disabled={saving} className="btn btn-primary btn-sm">
                <Check size={14} aria-hidden="true" />
                {saving ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Scoped styles ── */}
      <style>{`
        /* Search */
        .sv-search-wrap { display:flex; align-items:center; }
        .input-sm { padding:var(--space-2) var(--space-3) !important; font-size:var(--text-sm) !important; min-width:180px; }

        /* ── Desktop table: shown only on ≥640px ── */
        .sv-table-desktop { display: none; }
        @media (min-width: 640px) { .sv-table-desktop { display: block; } }

        /* ── Mobile cards: shown only on <640px ── */
        .sv-card-mobile { display: flex; }
        @media (min-width: 640px) { .sv-card-mobile { display: none; } }

        /* Card list */
        .sv-card-list {
          flex-direction: column;
          gap: var(--space-3);
        }

        .sv-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          transition: border-color var(--transition-fast);
        }
        .sv-card--inactive { opacity: 0.5; }
        .sv-card--inactive .sv-card__title { text-decoration: line-through; }

        /* Card top row */
        .sv-card__top {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
        }
        .sv-card__order {
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--text-faint);
          min-width: 20px;
          padding-top: 3px;
        }
        .sv-card__info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .sv-card__title {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text);
          line-height: 1.35;
          word-break: break-word;
        }
        .sv-toggle--card {
          flex-shrink: 0;
          padding: 4px;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius);
          background: none;
          border: none;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .sv-toggle--card:hover { background: var(--surface2); }

        /* Price row */
        .sv-card__price {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
        }
        .sv-card__price span {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2px var(--space-2);
        }

        /* Actions row */
        .sv-card__actions {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .sv-card__btn {
          flex: 1;
          justify-content: center;
          min-height: 40px;
        }
        .sv-card__btn--danger {
          background: var(--primary-subtle, rgba(239,68,68,0.08)) !important;
          color: var(--primary) !important;
          border: 1px solid var(--primary-subtle, rgba(239,68,68,0.2)) !important;
        }
        .sv-card__btn--danger:hover {
          background: var(--primary-subtle, rgba(239,68,68,0.15)) !important;
        }

        /* Toggle (shared) */
        .sv-toggle {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          border-radius: var(--radius);
          transition: opacity var(--transition-fast);
        }
        .sv-toggle:hover { opacity: 0.75; }
        .sv-toggle--on  { color: var(--accent); }
        .sv-toggle--off { color: var(--text-faint); }

        /* Desktop row actions */
        .sv-row-actions { display:flex; align-items:center; gap:var(--space-1); }
        .sv-action-btn {
          display:flex; align-items:center; justify-content:center;
          width:30px; height:30px;
          border-radius:var(--radius); background:none; border:none;
          color:var(--text-faint); cursor:pointer;
          transition:color var(--transition-fast),background var(--transition-fast);
        }
        .sv-action-btn:hover { color:var(--text); background:var(--surface2); }
        .sv-action-btn--danger:hover { color:var(--primary); background:var(--primary-subtle); }

        /* Modal */
        .modal-overlay {
          position:fixed; inset:0; z-index:50;
          display:flex; align-items:center; justify-content:center;
          background:oklch(0 0 0 / 0.55);
          backdrop-filter:blur(4px);
          animation:fadeIn 0.2s ease both;
          padding: var(--space-4);
        }
        /* On mobile: full-screen modal */
        @media (max-width: 640px) {
          .modal-overlay { padding: 0; align-items: flex-end; }
          .modal-panel { border-bottom-left-radius: 0; border-bottom-right-radius: 0; max-height: 92dvh; }
        }
        .modal-panel {
          background:var(--surface); border:1px solid var(--border);
          border-radius:var(--radius-xl);
          box-shadow:var(--shadow-xl, 0 24px 64px oklch(0 0 0 / 0.4));
          width:100%; max-height:90vh;
          overflow-y:auto;
          display:flex; flex-direction:column;
          animation:slideUp 0.25s cubic-bezier(0.22,1,0.36,1) both;
        }
        .modal-panel--lg { max-width:680px; }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .modal-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:var(--space-5) var(--space-6);
          border-bottom:1px solid var(--border);
          position:sticky; top:0; background:var(--surface); z-index:1;
        }
        @media (max-width: 480px) {
          .modal-header { padding: var(--space-4) var(--space-4); }
        }
        .modal-title {
          font-family:var(--font-display); font-size:var(--text-lg);
          font-weight:700; color:var(--text);
        }
        .modal-close {
          display:flex; align-items:center; justify-content:center;
          width:36px; height:36px;
          border-radius:var(--radius); background:none; border:none;
          color:var(--text-faint); cursor:pointer;
          transition:background var(--transition-fast),color var(--transition-fast);
        }
        .modal-close:hover { background:var(--surface2); color:var(--text); }
        .sv-modal-body {
          padding:var(--space-5) var(--space-6);
          display:flex; flex-direction:column; gap:var(--space-4);
        }
        @media (max-width: 480px) {
          .sv-modal-body { padding: var(--space-4) var(--space-4); }
        }
        .modal-footer {
          display:flex; align-items:center; justify-content:flex-end;
          gap:var(--space-3);
          padding:var(--space-4) var(--space-6);
          border-top:1px solid var(--border);
          position:sticky; bottom:0; background:var(--surface);
        }
        @media (max-width: 480px) {
          .modal-footer { padding: var(--space-3) var(--space-4); flex-direction: column; }
          .modal-footer .btn { width: 100%; justify-content: center; }
        }

        /* Grid helpers */
        .sv-2col { display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4); }
        .sv-3col { display:grid; grid-template-columns:1fr 1fr 1fr; gap:var(--space-3); }
        @media (max-width: 480px) {
          .sv-2col { grid-template-columns:1fr; }
          .sv-3col { grid-template-columns:1fr; }
        }

        /* Vehicle prices */
        .sv-vehicle-prices {
          background:var(--accent-subtle); border:1px solid var(--accent-border);
          border-radius:var(--radius-lg); padding:var(--space-4);
          display:flex; flex-direction:column; gap:var(--space-3);
        }
        .sv-vehicle-prices__title {
          font-size:var(--text-xs); font-weight:700; color:var(--accent);
          letter-spacing:0.06em; text-transform:uppercase; max-width:none;
        }
        .sv-vehicle-prices__hint {
          font-size:var(--text-xs); color:var(--text-faint);
          margin-top:-8px; max-width:none;
        }

        /* Image preview */
        .sv-img-preview {
          border-radius:var(--radius-lg); width:100%; height:160px;
          object-fit:cover; border:1px solid var(--border);
        }
      `}</style>
    </div>
  );
}

function Field({
  label, value, onChange, textarea = false, type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {textarea
        ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="input" />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input" />}
    </div>
  );
}
