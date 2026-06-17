"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CAR_BRANDS, getModels } from "@/lib/carData";
import { getAvailableDates } from "@/lib/scheduling";
import { CheckCircle, ChevronLeft, Clock, Calendar, Car, Truck, Phone as PhoneIcon, X } from "lucide-react";

interface Props {
  serviceSlug?: string;
  serviceTitle?: string;
  priceCar?: number | null;
  priceTruck?: number | null;
  priceTrailer?: number | null;
  priceMin?: number | null;
  fullWidth?: boolean;
  size?: "sm" | "md";
}

type CarCategory = "car" | "truck" | "trailer" | "";
type Step = "form" | "date" | "time" | "confirm";

interface SlotInfo {
  time: string;
  timeLabel: string;
  free: number;
  total: number;
  available: boolean;
}

const STEPS: Step[] = ["form", "date", "time", "confirm"];
const STEP_LABELS: Record<Step, string> = {
  form: "Авто",
  date: "Дата",
  time: "Час",
  confirm: "Підтвердження",
};

const TRUCK_BRANDS_LIST = CAR_BRANDS.filter((b) => b.category === "truck");
const CAR_BRANDS_LIST   = CAR_BRANDS.filter((b) => b.category === "car");

function getCategoryFromBrand(brandName: string): CarCategory {
  const brand = CAR_BRANDS.find((b) => b.name === brandName);
  if (!brand) return "";
  if (
    brand.name.includes("причіп") || brand.name.includes("Schmitz") ||
    brand.name.includes("Krone")  || brand.name.includes("Wielton") ||
    brand.name.includes("Fliegl") || brand.name.includes("Fruehauf") ||
    brand.name.includes("Kogel")  || brand.name.includes("Köge")
  ) return "trailer";
  if (brand.category === "truck") return "truck";
  return "car";
}

function getCategoryLabel(cat: CarCategory) {
  if (cat === "car")     return "Легкове";
  if (cat === "truck")   return "Вантажне / Тягач";
  if (cat === "trailer") return "Причіп / Напівпричіп";
  return "";
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("uk-UA", { weekday: "short", day: "numeric", month: "short" });
}
function toDateKey(d: Date): string { return d.toISOString().slice(0, 10); }

/* ── Step Progress Indicator ──────────────────────────────── */
function StepDots({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="bk-steps">
      {STEPS.map((s, i) => (
        <div key={s} className="bk-step-item">
          <div className={`bk-step-dot ${
            i < idx ? "bk-step-dot--done" :
            i === idx ? "bk-step-dot--active" : ""
          }`}>
            {i < idx ? <CheckCircle size={10} strokeWidth={2.5} /> : <span>{i + 1}</span>}
          </div>
          <span className={`bk-step-label ${i === idx ? "bk-step-label--active" : ""}`}>
            {STEP_LABELS[s]}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`bk-step-line ${i < idx ? "bk-step-line--done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Step panel wrapper with slide animation ──────────────── */
function StepPanel({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateX(14px)";
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.26s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1)";
        el.style.opacity = "1";
        el.style.transform = "translateX(0)";
      });
    });
    return () => cancelAnimationFrame(t);
  }, [stepKey]);
  return <div ref={ref} className="bk-panel">{children}</div>;
}

/* ── Field wrapper ────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bk-field">
      <label className="bk-label">{label}</label>
      {children}
    </div>
  );
}

/* ── Slot skeleton ────────────────────────────────────────── */
function SlotSkeleton() {
  return (
    <div className="bk-slots-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bk-skeleton" style={{ height: 56, animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MODAL OVERLAY (portal)
   ════════════════════════════════════════════════════════════ */
function BookingModal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="bk-overlay" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label="Запис на сервіс" className="bk-dialog">
        <button onClick={onClose} className="bk-dialog-close" aria-label="Закрити">
          <X size={18} strokeWidth={2} />
        </button>
        <div className="bk-dialog-scroll">{children}</div>
      </div>

      <style>{`
        .bk-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: oklch(0 0 0 / 0.55);
          backdrop-filter: blur(2px);
          animation: bkOverlayIn 0.2s ease both;
        }
        @keyframes bkOverlayIn { from{opacity:0} to{opacity:1} }
        .bk-dialog {
          position: fixed; z-index: 1001;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(480px, calc(100vw - 32px));
          max-height: calc(100dvh - 48px);
          background: var(--bg);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-lg, 12px);
          box-shadow: 0 24px 64px oklch(0 0 0 / 0.4);
          display: flex; flex-direction: column;
          animation: bkDialogIn 0.28s cubic-bezier(0.22,1,0.36,1) both;
          overflow: hidden;
        }
        @keyframes bkDialogIn {
          from { opacity:0; transform:translate(-50%, calc(-50% + 16px)); }
          to   { opacity:1; transform:translate(-50%, -50%); }
        }
        .bk-dialog-close {
          position: absolute; top: 12px; right: 12px;
          width: 32px; height: 32px;
          border-radius: var(--radius-md, 6px);
          background: none; border: none;
          color: var(--text-faint); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
          z-index: 1;
        }
        .bk-dialog-close:hover {
          background: oklch(from var(--text) l c h / 0.08);
          color: var(--text);
        }
        .bk-dialog-scroll { overflow-y: auto; padding: 24px 20px 20px; flex: 1; }
        @media (max-width: 480px) {
          .bk-dialog {
            top: auto; bottom: 0; left: 0; right: 0;
            width: 100%; max-height: 92dvh;
            transform: none;
            border-bottom-left-radius: 0; border-bottom-right-radius: 0;
            animation: bkDialogSlideUp 0.28s cubic-bezier(0.22,1,0.36,1) both;
          }
          @keyframes bkDialogSlideUp {
            from { transform: translateY(100%); opacity: 0.5; }
            to   { transform: translateY(0);    opacity: 1; }
          }
          .bk-dialog-scroll { padding: 20px 16px 32px; }
        }
      `}</style>
    </>,
    document.body
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function BookingButton({
  serviceSlug = "",
  serviceTitle = "Запис на сервіс",
  priceCar,
  priceTruck,
  priceTrailer,
  fullWidth,
  size,
}: Props) {
  const [status, setStatus]       = useState<"loading" | "guest" | "auth">("loading");
  const [client, setClient]       = useState<{ email: string; name: string | null; phone?: string | null } | null>(null);
  const [profilePhone, setProfilePhone] = useState("");

  const [open, setOpen]           = useState(false);
  const [step, setStep]           = useState<Step>("form");

  const [carBrand, setCarBrand]   = useState("");
  const [carModel, setCarModel]   = useState("");
  const [customModel, setCustomModel] = useState("");
  const [carCategory, setCarCategory] = useState<CarCategory>("");
  const [phone, setPhone]         = useState("");
  const [editPhone, setEditPhone] = useState(false);
  const [message, setMessage]     = useState("");

  const [availableDates] = useState<Date[]>(() => getAvailableDates());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [slots, setSlots]             = useState<SlotInfo[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const [sending, setSending]   = useState(false);
  const [done, setDone]         = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const models = getModels(carBrand);

  const hasCategoryPrices = priceCar != null || priceTruck != null || priceTrailer != null;
  const dynamicPrice: number | null =
    carCategory === "car"     ? (priceCar     ?? null) :
    carCategory === "truck"   ? (priceTruck   ?? null) :
    carCategory === "trailer" ? (priceTrailer ?? null) : null;

  const btnClass = `btn btn-primary${fullWidth ? " bk-btn-full" : ""}${size === "sm" ? " btn-sm" : ""}`;

  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.email) {
          setClient(data);
          setStatus("auth");
          if (data.phone) { setProfilePhone(data.phone); setPhone(data.phone); }
        } else setStatus("guest");
      })
      .catch(() => setStatus("guest"));
  }, []);

  const handleClose = () => {
    setOpen(false);
    setStep("form");
    setCarBrand(""); setCarModel(""); setCustomModel(""); setCarCategory("");
    setPhone(profilePhone); setEditPhone(false); setMessage("");
    setSelectedDate(null); setSelectedSlot(null); setSlots([]);
    setErrorMsg(""); setDone(false);
  };

  const handleBrandChange = (val: string) => {
    setCarBrand(val); setCarModel(""); setCustomModel("");
    setCarCategory(getCategoryFromBrand(val));
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date); setSelectedSlot(null);
    setSlotsLoading(true); setStep("time");
    try {
      const params = new URLSearchParams({
        date: toDateKey(date), serviceSlug,
        carCategory: carCategory || "truck",
      });
      const res  = await fetch(`/api/client/slots?${params}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch { setSlots([]); }
    finally { setSlotsLoading(false); }
  };

  const finalModel = carModel === "__custom__" ? customModel : carModel;
  const finalPhone = editPhone ? phone : profilePhone || phone;

  const submit = async () => {
    if (!selectedSlot) return;
    setSending(true); setErrorMsg("");
    const res = await fetch("/api/client/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceSlug, serviceTitle, carBrand,
        carModel: finalModel, carCategory,
        phone: finalPhone, message,
        scheduledAt: selectedSlot.time,
      }),
    });
    setSending(false);
    if (res.ok) {
      setDone(true);
    } else {
      const data = await res.json();
      if (data.error === "no_slots") {
        setErrorMsg("На жаль, цей час вже зайнятий. Оберіть інший.");
        if (selectedDate) handleDateSelect(selectedDate);
        setStep("time");
      } else {
        setErrorMsg("Помилка. Спробуйте ще раз.");
      }
    }
  };

  /* ── LOADING ─────────────────────────────────────────── */
  if (status === "loading") {
    return <div className="bk-skeleton" style={{ height: 36, width: 100, borderRadius: "var(--radius)" }} />;
  }

  /* ── GUEST → redirect to contacts ───────────────────── */
  if (status === "guest") {
    return (
      <Link href="/contacts" className={btnClass}>
        Записатись
      </Link>
    );
  }

  /* ── AUTH: trigger button + modal ───────────────────── */
  var step1Valid  = !!carBrand && !!(profilePhone || phone);
  var totalWorkers = carCategory === "car" ? 2 : 5;

  return (
    <>
      <button onClick={() => setOpen(true)} className={btnClass}>
        Записатись
      </button>

      {open && (
        <BookingModal onClose={handleClose}>
          {done ? (
            <div className="bk-success">
              <div className="bk-success__icon"><CheckCircle size={28} strokeWidth={1.5} /></div>
              <p className="bk-success__title">Запис підтверджено</p>
              {selectedSlot && selectedDate && (
                <p className="bk-success__sub">{formatDate(selectedDate)}, {selectedSlot.timeLabel}</p>
              )}
              <p className="bk-success__hint">Ми зв&apos;яжемося з вами найближчим часом</p>
              <button onClick={handleClose} className="btn btn-primary" style={{ marginTop: 8 }}>Закрити</button>
            </div>
          ) : (
            <div className="bk-wrap">
              <StepDots current={step} />

              {step === "form" && (
                <StepPanel stepKey="form">
                  {client?.name && (
                    <div className="bk-client-badge">
                      <span className="bk-client-badge__dot" />{client.name}
                    </div>
                  )}

                  <Field label="Марка авто *">
                    <div className="bk-select-wrap">
                      <select value={carBrand} onChange={(e) => handleBrandChange(e.target.value)} className="bk-select">
                        <option value="">— Оберіть марку —</option>
                        <optgroup label="Вантажні / Тягачі / Причепи">
                          {TRUCK_BRANDS_LIST.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
                        </optgroup>
                        <optgroup label="Легкові">
                          {CAR_BRANDS_LIST.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
                        </optgroup>
                      </select>
                      <span className="bk-select-arrow" aria-hidden>▾</span>
                    </div>
                  </Field>

                  {carBrand && carCategory && (
                    <div className="bk-category-row">
                      <div className="bk-category-label">
                        {carCategory === "car" ? <Car size={13} strokeWidth={2} /> : <Truck size={13} strokeWidth={2} />}
                        <span>{getCategoryLabel(carCategory)}</span>
                      </div>
                      {hasCategoryPrices && (
                        <span className="bk-price-badge">
                          {dynamicPrice != null
                            ? `від ${dynamicPrice.toLocaleString("uk-UA")} грн`
                            : <span style={{ color: "var(--text-faint)", fontSize: "var(--text-xs)" }}>ціна за запитом</span>}
                        </span>
                      )}
                    </div>
                  )}

                  {carBrand && (
                    <Field label="Модель авто">
                      <div className="bk-select-wrap">
                        <select value={carModel} onChange={(e) => setCarModel(e.target.value)} className="bk-select">
                          <option value="">— Оберіть модель —</option>
                          {models.map((m) => <option key={m} value={m}>{m}</option>)}
                          <option value="__custom__">Інша модель...</option>
                        </select>
                        <span className="bk-select-arrow" aria-hidden>▾</span>
                      </div>
                      {carModel === "__custom__" && (
                        <input type="text" placeholder="Введіть модель вручну" value={customModel}
                          onChange={(e) => setCustomModel(e.target.value)} className="bk-input"
                          style={{ marginTop: "var(--space-2)" }} />
                      )}
                    </Field>
                  )}

                  <Field label="Телефон *">
                    {profilePhone && !editPhone ? (
                      <div className="bk-phone-row">
                        <div className="bk-phone-display">
                          <PhoneIcon size={12} strokeWidth={2} style={{ color: "var(--text-faint)" }} />
                          {profilePhone}
                        </div>
                        <button type="button" onClick={() => { setEditPhone(true); setPhone(""); }} className="bk-link">
                          Змінити
                        </button>
                      </div>
                    ) : (
                      <input type="tel" placeholder="+380 50 000 00 00" required
                        value={phone} onChange={(e) => setPhone(e.target.value)} className="bk-input" />
                    )}
                  </Field>

                  <Field label="Коментар">
                    <textarea placeholder="необов'язково" value={message}
                      onChange={(e) => setMessage(e.target.value)} rows={2} className="bk-input bk-textarea" />
                  </Field>

                  <div className="bk-actions">
                    <button onClick={() => { if (step1Valid) setStep("date"); }}
                      disabled={!step1Valid} className="btn btn-primary bk-btn-full">
                      Обрати дату та час
                    </button>
                  </div>
                </StepPanel>
              )}

              {step === "date" && (
                <StepPanel stepKey="date">
                  <button onClick={() => setStep("form")} className="bk-back">
                    <ChevronLeft size={14} strokeWidth={2} /> Назад
                  </button>
                  <div className="bk-dates-grid">
                    {availableDates.map((d) => (
                      <button key={toDateKey(d)} onClick={() => handleDateSelect(d)} className="bk-date-btn">
                        <span className="bk-date-weekday">{d.toLocaleDateString("uk-UA", { weekday: "short" })}</span>
                        <span className="bk-date-day">{d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}</span>
                        <Calendar size={11} strokeWidth={1.5} className="bk-date-icon" />
                      </button>
                    ))}
                  </div>
                </StepPanel>
              )}

              {step === "time" && (
                <StepPanel stepKey="time">
                  <div className="bk-time-header">
                    <button onClick={() => { setStep("date"); setSelectedSlot(null); }} className="bk-back">
                      <ChevronLeft size={14} strokeWidth={2} /> Назад
                    </button>
                    {selectedDate && (
                      <span className="bk-time-date"><Calendar size={11} strokeWidth={1.5} />{formatDate(selectedDate)}</span>
                    )}
                  </div>
                  <p className="bk-slots-hint">
                    <Clock size={11} strokeWidth={1.5} />
                    {carCategory === "car" ? "Майстрів для легкових: 2" : "Майстрів для вантажних: 5"}
                  </p>
                  {slotsLoading ? <SlotSkeleton /> : (
                    <div className="bk-slots-grid">
                      {slots.map((slot) => {
                        const busy  = !slot.available;
                        const tight = slot.available && slot.free < totalWorkers;
                        return (
                          <button key={slot.time} disabled={busy}
                            onClick={() => { setSelectedSlot(slot); setStep("confirm"); }}
                            className={`bk-slot ${busy ? "bk-slot--busy" : tight ? "bk-slot--tight" : "bk-slot--free"}`}>
                            <span className="bk-slot-time">{slot.timeLabel}</span>
                            <span className="bk-slot-avail">{busy ? "зайнято" : `${slot.free} вільн.`}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {errorMsg && <p className="bk-error">{errorMsg}</p>}
                </StepPanel>
              )}

              {step === "confirm" && (
                <StepPanel stepKey="confirm">
                  <button onClick={() => setStep("time")} className="bk-back">
                    <ChevronLeft size={14} strokeWidth={2} /> Назад
                  </button>
                  <div className="bk-summary">
                    {([
                      ["Послуга",  serviceTitle],
                      ["Авто",     `${carBrand} ${finalModel}`.trim()],
                      ["Тип",      getCategoryLabel(carCategory)],
                      ["Дата / Час", selectedDate && selectedSlot ? `${formatDate(selectedDate)}, ${selectedSlot.timeLabel}` : "—"],
                      dynamicPrice != null ? ["Вартість", `від ${dynamicPrice.toLocaleString("uk-UA")} грн`] : null,
                      ["Телефон",  finalPhone],
                    ] as ([string, string] | null)[]).filter(Boolean).map(([label, value]) => (
                      <div key={label} className="bk-summary-row">
                        <span className="bk-summary-label">{label}</span>
                        <span className={`bk-summary-value${label === "Вартість" ? " bk-summary-value--accent" : ""}${label === "Дата / Час" ? " bk-summary-value--strong" : ""}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {errorMsg && <p className="bk-error">{errorMsg}</p>}
                  <div className="bk-actions">
                    <button onClick={submit} disabled={sending} className="btn btn-primary bk-btn-full">
                      {sending ? (
                        <span className="bk-sending"><span className="bk-spinner" /> Надсилаємо...</span>
                      ) : "Підтвердити запис"}
                    </button>
                  </div>
                </StepPanel>
              )}
            </div>
          )}
        </BookingModal>
      )}

      <style>{`
        .bk-wrap { display:flex; flex-direction:column; gap:var(--space-4); }
        .bk-panel { display:flex; flex-direction:column; gap:var(--space-3); will-change:opacity,transform; }
        .bk-steps { display:flex; align-items:center; padding-bottom:var(--space-3); border-bottom:1px solid var(--border); }
        .bk-step-item { display:flex; align-items:center; gap:var(--space-1); flex:1; min-width:0; }
        .bk-step-dot { width:22px; height:22px; border-radius:50%; border:1.5px solid var(--border-strong); background:var(--surface); color:var(--text-faint); font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:border-color .22s,background .22s,color .22s; }
        .bk-step-dot--active { border-color:var(--primary); background:var(--primary-subtle); color:var(--primary); }
        .bk-step-dot--done   { border-color:var(--primary); background:var(--primary); color:#fff; }
        .bk-step-label { font-family:var(--font-display); font-size:9px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--text-faint); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; transition:color .22s; }
        .bk-step-label--active { color:var(--text-muted); }
        .bk-step-line { flex:1; height:1px; background:var(--border); margin:0 var(--space-1); transition:background .3s; }
        .bk-step-line--done { background:var(--primary); }
        .bk-client-badge { display:inline-flex; align-items:center; gap:var(--space-2); font-size:var(--text-xs); color:var(--text-muted); background:var(--surface2); border:1px solid var(--border); border-radius:var(--radius-full); padding:4px 10px; width:fit-content; }
        .bk-client-badge__dot { width:6px; height:6px; border-radius:50%; background:var(--primary); flex-shrink:0; }
        .bk-field { display:flex; flex-direction:column; gap:var(--space-1); }
        .bk-label { font-family:var(--font-display); font-size:var(--text-xs); font-weight:600; color:var(--text-faint); text-transform:uppercase; letter-spacing:.08em; }
        .bk-select-wrap { position:relative; }
        .bk-select { width:100%; border:1px solid var(--border-strong); border-radius:var(--radius); padding:9px 34px 9px 12px; font-family:var(--font-body); font-size:var(--text-sm); color:var(--text); background:var(--surface); appearance:none; cursor:pointer; transition:border-color .18s,box-shadow .18s; }
        .bk-select:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-subtle); }
        .bk-select-arrow { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--text-faint); font-size:10px; pointer-events:none; }
        .bk-input { width:100%; border:1px solid var(--border-strong); border-radius:var(--radius); padding:9px 12px; font-family:var(--font-body); font-size:var(--text-sm); color:var(--text); background:var(--surface); transition:border-color .18s,box-shadow .18s; }
        .bk-input:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-subtle); }
        .bk-input::placeholder { color:var(--text-faint); }
        .bk-textarea { resize:none; }
        .bk-category-row { display:flex; align-items:center; justify-content:space-between; border:1px solid var(--border); border-radius:var(--radius); padding:8px 12px; background:var(--surface2); animation:bkFadeIn .22s ease both; }
        .bk-category-label { display:flex; align-items:center; gap:var(--space-2); font-size:var(--text-sm); color:var(--text-muted); }
        .bk-price-badge { font-family:var(--font-display); font-size:var(--text-sm); font-weight:700; color:var(--primary); }
        .bk-phone-row { display:flex; align-items:center; gap:var(--space-2); }
        .bk-phone-display { flex:1; display:flex; align-items:center; gap:var(--space-2); border:1px solid var(--border); border-radius:var(--radius); padding:9px 12px; font-size:var(--text-sm); color:var(--text-muted); background:var(--surface2); }
        .bk-link { font-size:var(--text-xs); font-weight:600; color:var(--primary); white-space:nowrap; transition:opacity .16s; }
        .bk-link:hover { opacity:.75; }
        .bk-dates-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:var(--space-2); }
        .bk-date-btn { display:flex; flex-direction:column; align-items:flex-start; gap:2px; padding:10px 12px; border:1px solid var(--border-strong); border-radius:var(--radius); background:var(--surface); cursor:pointer; transition:border-color .18s,background .18s,transform .18s; position:relative; overflow:hidden; }
        .bk-date-btn:hover { border-color:var(--primary); background:var(--primary-subtle); transform:translateY(-1px); }
        .bk-date-btn:active { transform:translateY(0); }
        .bk-date-weekday { font-family:var(--font-display); font-size:var(--text-xs); font-weight:700; color:var(--text); text-transform:capitalize; }
        .bk-date-day { font-size:var(--text-xs); color:var(--text-muted); }
        .bk-date-icon { position:absolute; right:10px; top:50%; transform:translateY(-50%); color:var(--text-faint); }
        .bk-time-header { display:flex; align-items:center; justify-content:space-between; gap:var(--space-2); }
        .bk-time-date { display:flex; align-items:center; gap:5px; font-size:var(--text-xs); color:var(--text-muted); }
        .bk-slots-hint { display:flex; align-items:center; gap:5px; font-size:var(--text-xs); color:var(--text-faint); }
        .bk-slots-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:var(--space-2); }
        .bk-slot { display:flex; flex-direction:column; gap:2px; padding:10px 12px; border-radius:var(--radius); border:1px solid var(--border); text-align:left; cursor:pointer; transition:border-color .18s,background .18s,transform .15s; }
        .bk-slot:not(:disabled):hover { transform:translateY(-1px); }
        .bk-slot:active:not(:disabled) { transform:translateY(0); }
        .bk-slot--free { background:var(--surface); }
        .bk-slot--free:hover { border-color:var(--primary); background:var(--primary-subtle); }
        .bk-slot--tight { background:rgba(217,119,6,.04); border-color:rgba(217,119,6,.3); }
        .bk-slot--tight:hover { border-color:rgba(217,119,6,.6); }
        .bk-slot--busy { background:var(--surface2); opacity:.45; cursor:not-allowed; }
        .bk-slot-time { font-family:var(--font-display); font-size:var(--text-sm); font-weight:700; color:var(--text); }
        .bk-slot--busy .bk-slot-time { color:var(--text-faint); }
        .bk-slot-avail { font-size:var(--text-xs); color:var(--text-faint); }
        .bk-slot--free .bk-slot-avail { color:var(--primary); }
        .bk-slot--tight .bk-slot-avail { color:var(--accent); }
        .bk-summary { border:1px solid var(--border); border-radius:var(--radius); background:var(--surface2); overflow:hidden; }
        .bk-summary-row { display:flex; align-items:baseline; justify-content:space-between; gap:var(--space-4); padding:9px 14px; border-bottom:1px solid var(--border); font-size:var(--text-sm); }
        .bk-summary-row:last-child { border-bottom:none; }
        .bk-summary-label { color:var(--text-faint); white-space:nowrap; }
        .bk-summary-value { color:var(--text); text-align:right; }
        .bk-summary-value--accent { color:var(--primary); font-weight:700; }
        .bk-summary-value--strong { font-weight:700; }
        .bk-actions { display:flex; flex-direction:column; gap:var(--space-2); padding-top:var(--space-1); }
        .bk-btn-full { width:100%; justify-content:center; }
        .bk-back { display:inline-flex; align-items:center; gap:4px; font-family:var(--font-display); font-size:var(--text-xs); font-weight:600; color:var(--text-muted); background:none; border:none; cursor:pointer; padding:0; transition:color .16s; }
        .bk-back:hover { color:var(--text); }
        .bk-error { font-size:var(--text-xs); color:var(--error,#b91c1c); text-align:center; padding:var(--space-2); background:rgba(185,28,28,.06); border:1px solid rgba(185,28,28,.18); border-radius:var(--radius); animation:bkShake .38s cubic-bezier(.36,.07,.19,.97); }
        @keyframes bkShake { 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(3px)} 30%,50%,70%{transform:translateX(-3px)} 40%,60%{transform:translateX(3px)} }
        .bk-success { display:flex; flex-direction:column; align-items:center; text-align:center; gap:var(--space-2); padding:var(--space-6) var(--space-4); animation:bkSuccessIn .4s cubic-bezier(.22,1,.36,1) both; }
        @keyframes bkSuccessIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        .bk-success__icon { color:var(--primary); animation:bkSuccessIcon .5s cubic-bezier(.22,1,.36,1) .1s both; }
        @keyframes bkSuccessIcon { from{transform:scale(0) rotate(-30deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        .bk-success__title { font-family:var(--font-display); font-size:var(--text-lg); font-weight:800; color:var(--text); }
        .bk-success__sub { font-family:var(--font-display); font-size:var(--text-sm); font-weight:600; color:var(--primary); }
        .bk-success__hint { font-size:var(--text-xs); color:var(--text-muted); }
        .bk-skeleton { border-radius:var(--radius); background:linear-gradient(90deg,var(--surface2) 25%,var(--surface-dynamic,var(--border)) 50%,var(--surface2) 75%); background-size:200% 100%; animation:bkShimmer 1.5s ease-in-out infinite; }
        @keyframes bkShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .bk-sending { display:inline-flex; align-items:center; gap:var(--space-2); }
        .bk-spinner { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:bkSpin .7s linear infinite; }
        @keyframes bkSpin { to{transform:rotate(360deg)} }
        @keyframes bkFadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @media (prefers-reduced-motion:reduce) {
          .bk-panel{transition:none!important} .bk-skeleton{animation:none;background:var(--surface2)}
          .bk-spinner{animation:none} .bk-error{animation:none}
          .bk-success{animation:none} .bk-success__icon{animation:none}
        }
      `}</style>
    </>
  );
}
