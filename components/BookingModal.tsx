"use client";

import { useEffect, useRef, useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { services } from "@/lib/services";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultService?: string;
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors";

const CATEGORIES = [
  { value: "truck", label: "🚛 Вантажівка" },
  { value: "trailer", label: "🚜 Причіп" },
  { value: "car", label: "🚗 Легкове" },
];

export default function BookingModal({ open, onClose, defaultService = "" }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    carMake: "",
    carModel: "",
    carCategory: "truck",
    service: defaultService,
    date: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // sync defaultService when modal opens for a specific service
  useEffect(() => {
    if (open) {
      setForm((prev) => ({ ...prev, service: defaultService || prev.service }));
      setSubmitted(false);
      setError("");
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }
  }, [open, defaultService]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // lock body scroll
  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name" && !/^[a-zA-Z\u0400-\u04FF\s\-']*$/.test(value)) return;
    if (name === "phone" && !/^[0-9+()\-\s]*$/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          carBrand: form.carMake,
          carModel: form.carModel,
          carCategory: form.carCategory,
          service: form.service,
          date: form.date ? new Date(form.date).toISOString() : null,
          message: form.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Помилка відправки. Спробуйте ще раз.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Помилка з\'єднання. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const serviceCategories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div
      ref={overlayRef}
      className="bm-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Форма запису"
    >
      <div className="bm-panel">
        {/* Header */}
        <div className="bm-header">
          <div>
            <p className="bm-header__title">Записатись на сервіс</p>
            <p className="bm-header__sub">Ми передзвонимо для підтвердження часу</p>
          </div>
          <button className="bm-close" onClick={onClose} aria-label="Закрити">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="bm-body">
          {submitted ? (
            <div className="bm-success">
              <CheckCircle2 size={52} className="bm-success__icon" />
              <h3>Запис прийнято!</h3>
              <p>Ми зв'яжемось з вами найближчим часом.</p>
              <button className="bm-btn-close-success" onClick={onClose}>Закрити</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bm-form">

              {/* Тип авто */}
              <div className="bm-section">
                <p className="bm-label-group">Тип транспорту</p>
                <div className="bm-type-grid">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.value} className={`bm-type-card${
                      form.carCategory === cat.value ? " bm-type-card--active" : ""
                    }`}>
                      <input type="radio" name="carCategory" value={cat.value}
                        checked={form.carCategory === cat.value}
                        onChange={handleChange} className="sr-only" />
                      <span className="bm-type-icon">{cat.label.split(" ")[0]}</span>
                      <span className="bm-type-text">{cat.label.split(" ").slice(1).join(" ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Контакти */}
              <div className="bm-section">
                <p className="bm-label-group">Ваші контакти</p>
                <div className="bm-grid-2">
                  <div>
                    <label htmlFor="bm-name" className="bm-field-label">Ім'я *</label>
                    <input ref={firstInputRef} id="bm-name" name="name" required
                      value={form.name} onChange={handleChange}
                      placeholder="Олексій" autoComplete="name" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="bm-phone" className="bm-field-label">Телефон *</label>
                    <input id="bm-phone" name="phone" type="tel" required
                      value={form.phone} onChange={handleChange}
                      placeholder="+380 50 000 00 00" autoComplete="tel" inputMode="numeric"
                      className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Авто */}
              <div className="bm-section">
                <p className="bm-label-group">Автомобіль</p>
                <div className="bm-grid-2">
                  <div>
                    <label htmlFor="bm-carMake" className="bm-field-label">Марка *</label>
                    <input id="bm-carMake" name="carMake" required
                      value={form.carMake} onChange={handleChange}
                      placeholder="Volvo" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="bm-carModel" className="bm-field-label">Модель *</label>
                    <input id="bm-carModel" name="carModel" required
                      value={form.carModel} onChange={handleChange}
                      placeholder="FH 500" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Послуга + Дата */}
              <div className="bm-section">
                <p className="bm-label-group">Деталі</p>
                <div className="bm-grid-2">
                  <div>
                    <label htmlFor="bm-service" className="bm-field-label">Послуга *</label>
                    <select id="bm-service" name="service" required
                      value={form.service} onChange={handleChange} className={inputCls}>
                      <option value="">Оберіть послугу</option>
                      {serviceCategories.map((cat) => (
                        <optgroup key={cat} label={cat}>
                          {services.filter((s) => s.category === cat).map((s) => (
                            <option key={s.slug} value={s.slug}>{s.title}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bm-date" className="bm-field-label">Бажана дата</label>
                    <input id="bm-date" name="date" type="date"
                      value={form.date} onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={inputCls} />
                  </div>
                </div>
                <div className="mt-3">
                  <label htmlFor="bm-desc" className="bm-field-label">Коментар</label>
                  <textarea id="bm-desc" name="description" rows={3}
                    value={form.description} onChange={handleChange}
                    placeholder="Опишіть симптоми або побажання..."
                    className={inputCls + " resize-none"} />
                </div>
              </div>

              {error && (
                <p className="bm-error">{error}</p>
              )}

              <button type="submit" disabled={loading} className="bm-submit">
                {loading ? <><Loader2 size={16} className="bm-spin" /> Відправляємо...</> : "Записатись на сервіс"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .bm-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: bm-fade-in 0.18s ease;
        }
        @keyframes bm-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .bm-panel {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 560px;
          max-height: 90dvh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 64px rgba(0,0,0,0.22);
          animation: bm-slide-up 0.22s cubic-bezier(0.34,1.56,0.64,1);
          overflow: hidden;
        }
        @keyframes bm-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .bm-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .bm-header__title { font-size: 18px; font-weight: 700; color: #111; }
        .bm-header__sub { font-size: 13px; color: #888; margin-top: 2px; }
        .bm-close {
          width: 34px; height: 34px; border-radius: 10px;
          background: #f5f5f5; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #555; transition: background 0.15s; flex-shrink: 0; margin-left: 12px;
        }
        .bm-close:hover { background: #ebebeb; }

        .bm-body {
          overflow-y: auto; padding: 20px 24px 24px;
          flex: 1;
        }

        .bm-form { display: flex; flex-direction: column; gap: 0; }
        .bm-section { margin-bottom: 20px; }
        .bm-label-group {
          font-size: 11px; font-weight: 600; color: #999;
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 10px;
        }
        .bm-field-label {
          display: block; font-size: 13px; font-weight: 500;
          color: #444; margin-bottom: 5px;
        }
        .bm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) {
          .bm-grid-2 { grid-template-columns: 1fr; }
          .bm-panel { border-radius: 16px; }
          .bm-header, .bm-body { padding-left: 16px; padding-right: 16px; }
        }

        .bm-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .bm-type-card {
          display: flex; flex-direction: column; align-items: center;
          gap: 4px; cursor: pointer; border-radius: 12px;
          border: 2px solid #e5e7eb; padding: 10px 8px;
          text-align: center; transition: border-color 0.15s, background 0.15s;
          background: #fff;
        }
        .bm-type-card:hover { border-color: #f5c518; }
        .bm-type-card--active { border-color: #f5c518; background: #fffbeb; }
        .bm-type-icon { font-size: 22px; line-height: 1; }
        .bm-type-text { font-size: 11px; font-weight: 600; color: #444; line-height: 1.3; }

        .bm-error {
          font-size: 13px; color: #dc2626;
          background: #fef2f2; border-radius: 10px;
          padding: 10px 14px; margin-bottom: 12px;
        }

        .bm-submit {
          width: 100%; padding: 13px;
          background: #f5c518; color: #111;
          font-weight: 700; font-size: 15px;
          border: none; border-radius: 12px; cursor: pointer;
          transition: background 0.15s, transform 0.12s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .bm-submit:hover:not(:disabled) { background: #e6b800; }
        .bm-submit:active:not(:disabled) { transform: scale(0.98); }
        .bm-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .bm-spin { animation: bm-spin 0.7s linear infinite; }
        @keyframes bm-spin { to { transform: rotate(360deg); } }

        .bm-success {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 32px 16px;
        }
        .bm-success__icon { color: #16a34a; margin-bottom: 16px; }
        .bm-success h3 { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 8px; }
        .bm-success p { font-size: 14px; color: #666; max-width: 280px; margin-bottom: 24px; }
        .bm-btn-close-success {
          padding: 10px 28px; background: #f5c518; color: #111;
          font-weight: 600; font-size: 14px; border: none;
          border-radius: 10px; cursor: pointer;
        }
        .bm-btn-close-success:hover { background: #e6b800; }

        .mt-3 { margin-top: 12px; }
        .sr-only { position: absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); }
      `}</style>
    </div>
  );
}
