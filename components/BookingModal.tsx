"use client";

import { useEffect, useRef, useState } from "react";
import { X, CheckCircle2, Loader2, Truck, Car } from "lucide-react";
import { services } from "@/lib/services";
import { CAR_BRANDS } from "@/lib/carData";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultService?: string;
  /** Підказка з якої вкладки відкрили (truck | car) */
  defaultVehicleTab?: "truck" | "car";
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors";

// Підтип транспорту всередині вкладки "Вантажні"
const TRUCK_SUBTYPES = [
  { value: "truck",   label: "🚛 Вантажівка" },
  { value: "trailer", label: "🚜 Причіп" },
];

export default function BookingModal({ open, onClose, defaultService = "", defaultVehicleTab }: Props) {
  // Визначаємо початкову вкладку за defaultService або defaultVehicleTab
  const getInitialTab = (): "truck" | "car" => {
    if (defaultVehicleTab) return defaultVehicleTab;
    if (defaultService) {
      const svc = services.find((s) => s.slug === defaultService);
      if (svc?.vehicleType === "car") return "car";
    }
    return "truck";
  };

  const [tab, setTab] = useState<"truck" | "car">(getInitialTab);
  const [truckSubtype, setTruckSubtype] = useState<"truck" | "trailer">("truck");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    carMake: "",
    carModel: "",
    service: defaultService,
    date: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Послуги відфільтровані по вкладці
  const filteredServices = services.filter((s) => {
    const vt = s.vehicleType ?? "both";
    if (tab === "car") return vt === "car" || vt === "both";
    return vt === "truck" || vt === "both";
  });

  const serviceCategories = Array.from(new Set(filteredServices.map((s) => s.category)));

  // Марки відфільтровані по вкладці
  const filteredBrands = CAR_BRANDS.filter((b) =>
    tab === "car" ? b.category === "car" : b.category === "truck"
  );
  const availableModels = filteredBrands.find((b) => b.name === form.carMake)?.models ?? [];

  useEffect(() => {
    if (open) {
      const initTab = getInitialTab();
      setTab(initTab);
      setTruckSubtype("truck");
      setForm({
        name: "",
        phone: "",
        carMake: "",
        carModel: "",
        service: defaultService,
        date: "",
        description: "",
      });
      setSubmitted(false);
      setError("");
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultService]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const switchTab = (newTab: "truck" | "car") => {
    setTab(newTab);
    setForm((prev) => ({ ...prev, carMake: "", carModel: "", service: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name" && !/^[a-zA-Z\u0400-\u04FF\s\-']*$/.test(value)) return;
    if (name === "phone" && !/^[0-9+()\-\s]*$/.test(value)) return;
    if (name === "carMake") {
      setForm((prev) => ({ ...prev, carMake: value, carModel: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const carCategory = tab === "car" ? "car" : truckSubtype;
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          carBrand: form.carMake,
          carModel: form.carModel,
          carCategory,
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
      setError("Помилка з'єднання. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

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
        {/* Заголовок */}
        <div className="bm-header">
          <div>
            <p className="bm-header__title">Записатись на сервіс</p>
            <p className="bm-header__sub">Ми передзвонимо для підтвердження часу</p>
          </div>
          <button className="bm-close" onClick={onClose} aria-label="Закрити">
            <X size={18} />
          </button>
        </div>

        {/* Головні вкладки */}
        <div className="bm-tabs">
          <button
            type="button"
            className={`bm-tab${tab === "truck" ? " bm-tab--active" : ""}`}
            onClick={() => switchTab("truck")}
          >
            <Truck size={18} />
            <span>Вантажні / TIR</span>
          </button>
          <button
            type="button"
            className={`bm-tab${tab === "car" ? " bm-tab--active" : ""}`}
            onClick={() => switchTab("car")}
          >
            <Car size={18} />
            <span>Легкові авто</span>
          </button>
        </div>

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

              {/* Підтип (лише для вантажних) */}
              {tab === "truck" && (
                <div className="bm-section">
                  <p className="bm-label-group">Тип транспорту</p>
                  <div className="bm-subtype-grid">
                    {TRUCK_SUBTYPES.map((st) => (
                      <label
                        key={st.value}
                        className={`bm-subtype-card${truckSubtype === st.value ? " bm-subtype-card--active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="truckSubtype"
                          value={st.value}
                          checked={truckSubtype === st.value}
                          onChange={() => setTruckSubtype(st.value as "truck" | "trailer")}
                          className="sr-only"
                        />
                        <span className="bm-subtype-icon">{st.label.split(" ")[0]}</span>
                        <span className="bm-subtype-text">{st.label.split(" ").slice(1).join(" ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                <p className="bm-label-group">{tab === "truck" ? "Транспорт" : "Автомобіль"}</p>
                <div className="bm-grid-2">
                  <div>
                    <label htmlFor="bm-carMake" className="bm-field-label">Марка *</label>
                    <select id="bm-carMake" name="carMake" required
                      value={form.carMake} onChange={handleChange} className={inputCls}>
                      <option value="">Оберіть марку</option>
                      {filteredBrands.map((b) => (
                        <option key={b.name} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bm-carModel" className="bm-field-label">Модель *</label>
                    <select id="bm-carModel" name="carModel" required
                      value={form.carModel} onChange={handleChange}
                      disabled={availableModels.length === 0}
                      className={inputCls}>
                      <option value="">{form.carMake ? "Оберіть модель" : "— спочатку оберіть марку"}</option>
                      {availableModels.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
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
                          {filteredServices.filter((s) => s.category === cat).map((s) => (
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
                <div style={{ marginTop: 12 }}>
                  <label htmlFor="bm-desc" className="bm-field-label">Коментар</label>
                  <textarea id="bm-desc" name="description" rows={3}
                    value={form.description} onChange={handleChange}
                    placeholder="Опишіть симптоми або побажання..."
                    className={inputCls + " resize-none"} />
                </div>
              </div>

              {error && <p className="bm-error">{error}</p>}

              <button type="submit" disabled={loading} className="bm-submit">
                {loading
                  ? <><Loader2 size={16} className="bm-spin" /> Відправляємо...</>
                  : "Записатись на сервіс"}
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
        @keyframes bm-fade-in { from { opacity:0 } to { opacity:1 } }

        .bm-panel {
          background: #fff; border-radius: 20px;
          width: 100%; max-width: 560px;
          max-height: 90dvh;
          display: flex; flex-direction: column;
          box-shadow: 0 24px 64px rgba(0,0,0,0.22);
          animation: bm-slide-up 0.22s cubic-bezier(0.34,1.56,0.64,1);
          overflow: hidden;
        }
        @keyframes bm-slide-up {
          from { opacity:0; transform:translateY(20px) scale(0.97) }
          to   { opacity:1; transform:translateY(0) scale(1) }
        }

        .bm-header {
          display:flex; align-items:flex-start; justify-content:space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .bm-header__title { font-size:18px; font-weight:700; color:#111; }
        .bm-header__sub { font-size:13px; color:#888; margin-top:2px; }
        .bm-close {
          width:34px; height:34px; border-radius:10px;
          background:#f5f5f5; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:#555; transition:background .15s;
          flex-shrink:0; margin-left:12px;
        }
        .bm-close:hover { background:#ebebeb; }

        /* Головні вкладки */
        .bm-tabs {
          display: grid; grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .bm-tab {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 16px;
          font-size: 14px; font-weight: 600; color: #888;
          background: #fafafa; border: none; cursor: pointer;
          transition: color .15s, background .15s, box-shadow .15s;
          position: relative;
        }
        .bm-tab:first-child { border-right: 1px solid #f0f0f0; }
        .bm-tab:hover { color: #555; background: #f5f5f5; }
        .bm-tab--active {
          color: #111; background: #fff;
          box-shadow: inset 0 -2px 0 #f5c518;
        }

        .bm-body { overflow-y:auto; padding:20px 24px 24px; flex:1; }

        .bm-form { display:flex; flex-direction:column; gap:0; }
        .bm-section { margin-bottom:20px; }
        .bm-label-group {
          font-size:11px; font-weight:600; color:#999;
          text-transform:uppercase; letter-spacing:.08em;
          margin-bottom:10px;
        }
        .bm-field-label {
          display:block; font-size:13px; font-weight:500;
          color:#444; margin-bottom:5px;
        }
        .bm-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

        /* Підтип вантажних */
        .bm-subtype-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .bm-subtype-card {
          display:flex; flex-direction:column; align-items:center;
          gap:4px; cursor:pointer; border-radius:12px;
          border:2px solid #e5e7eb; padding:10px 8px;
          text-align:center; transition:border-color .15s,background .15s;
          background:#fff;
        }
        .bm-subtype-card:hover { border-color:#f5c518; }
        .bm-subtype-card--active { border-color:#f5c518; background:#fffbeb; }
        .bm-subtype-icon { font-size:24px; line-height:1; }
        .bm-subtype-text { font-size:12px; font-weight:600; color:#444; }

        .bm-error {
          font-size:13px; color:#dc2626;
          background:#fef2f2; border-radius:10px;
          padding:10px 14px; margin-bottom:12px;
        }
        .bm-submit {
          width:100%; padding:13px;
          background:#f5c518; color:#111;
          font-weight:700; font-size:15px;
          border:none; border-radius:12px; cursor:pointer;
          transition:background .15s,transform .12s;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .bm-submit:hover:not(:disabled) { background:#e6b800; }
        .bm-submit:active:not(:disabled) { transform:scale(0.98); }
        .bm-submit:disabled { opacity:.55; cursor:not-allowed; }
        .bm-spin { animation:bm-spin .7s linear infinite; }
        @keyframes bm-spin { to { transform:rotate(360deg) } }

        .bm-success {
          display:flex; flex-direction:column; align-items:center;
          text-align:center; padding:32px 16px;
        }
        .bm-success__icon { color:#16a34a; margin-bottom:16px; }
        .bm-success h3 { font-size:22px; font-weight:700; color:#111; margin-bottom:8px; }
        .bm-success p { font-size:14px; color:#666; max-width:280px; margin-bottom:24px; }
        .bm-btn-close-success {
          padding:10px 28px; background:#f5c518; color:#111;
          font-weight:600; font-size:14px; border:none;
          border-radius:10px; cursor:pointer;
        }
        .bm-btn-close-success:hover { background:#e6b800; }

        .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); }
        .resize-none { resize:none; }

        @media (max-width:480px) {
          .bm-grid-2 { grid-template-columns:1fr; }
          .bm-panel { border-radius:16px; }
          .bm-header, .bm-body { padding-left:16px; padding-right:16px; }
          .bm-tabs { font-size:13px; }
        }
      `}</style>
    </div>
  );
}
