"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Suspense } from "react";
import {
  LogOut, Clock, CheckCircle2, Wrench, Search, User,
  ReceiptText, Timer, Mail, Package, ChevronRight, ArrowRight,
} from "lucide-react";

/* ─── Types ─── */
interface Booking {
  id: string; service: string | null; carBrand: string | null; carModel: string | null;
  progress: string; price: number | null; partsCost: number | null;
  workItems: string[]; createdAt: string; status: string;
}
interface Client { email: string; name: string | null; phone: string | null; bookings: Booking[]; }

/* ─── Constants ─── */
const PROGRESS_STEPS = [
  { key: "received",    label: "Прийнято",    icon: <Clock    size={12} /> },
  { key: "diagnostics", label: "Діагностика", icon: <Search   size={12} /> },
  { key: "in_progress", label: "В роботі",    icon: <Wrench   size={12} /> },
  { key: "done",        label: "Готово",      icon: <CheckCircle2 size={12} /> },
];

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

/* ─── ProgressTrack ─── */
function ProgressTrack({ current }: { current: string }) {
  const idx = PROGRESS_STEPS.findIndex((s) => s.key === current);
  return (
    <div className="cb-progress-track">
      {PROGRESS_STEPS.map((step, i) => (
        <div key={step.key} className="cb-progress-item">
          <div className={`cb-progress-step ${i < idx ? "cb-progress-step--done" : i === idx ? "cb-progress-step--active" : "cb-progress-step--future"}`}>
            {i < idx ? <CheckCircle2 size={11} /> : step.icon}
            <span>{step.label}</span>
          </div>
          {i < PROGRESS_STEPS.length - 1 && (
            <ChevronRight size={10} className={`cb-progress-arrow ${i < idx ? "cb-progress-arrow--done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── StatsBar ─── */
function StatsBar({ bookings }: { bookings: Booking[] }) {
  const total    = bookings.length;
  const done     = bookings.filter((b) => b.progress === "done").length;
  const totalPrc = bookings.reduce((s, b) => s + (b.price || 0) + (b.partsCost || 0), 0);
  const cTotal   = useCountUp(total);
  const cDone    = useCountUp(done);
  const cPrice   = useCountUp(totalPrc, 1200);

  const stats = [
    { icon: <ReceiptText size={16} />, val: cTotal, label: "Замовлень",  suffix: "" },
    { icon: <CheckCircle2 size={16} />, val: cDone,  label: "Виконано",  suffix: "" },
    { icon: <Timer size={16} />, val: totalPrc > 0 ? cPrice : null, label: "Витрачено", suffix: " ₴" },
  ];

  return (
    <div className="cb-stats">
      {stats.map(({ icon, val, label, suffix }) => (
        <div key={label} className="cb-stat-card">
          <div className="cb-stat-icon">{icon}</div>
          <p className="cb-stat-value">
            {val === null ? "—" : `${val.toLocaleString("uk-UA")}${suffix}`}
          </p>
          <p className="cb-stat-label">{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── CostPill ─── */
function CostPill({ icon, label, amount }: { icon: React.ReactNode; label: string; amount: number }) {
  return (
    <span className="cb-cost-pill">
      {icon}
      {label}: {amount.toLocaleString("uk-UA")} ₴
    </span>
  );
}

/* ─── BookingCard ─── */
function BookingCard({ b, index }: { b: Booking; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 0.45s ease, transform 0.45s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 90 + 60);
    return () => clearTimeout(t);
  }, [index]);

  const totalCost = (b.price || 0) + (b.partsCost || 0);

  return (
    <div ref={ref} className="cb-card">
      <div className="cb-card-header">
        <div className="cb-card-header-left">
          <p className="cb-card-car">
            {b.carBrand || b.carModel
              ? `${b.carBrand || ""} ${b.carModel || ""}`.trim()
              : "Авто не вказано"}
          </p>
          <p className="cb-card-service">{b.service || "Послуга"}</p>
        </div>
        <div className="cb-card-header-right">
          {totalCost > 0 ? (
            <p className="cb-card-price">{totalCost.toLocaleString("uk-UA")} ₴</p>
          ) : (
            <p className="cb-card-price-tbd">Ціна уточнюється</p>
          )}
          <p className="cb-card-date">
            {new Date(b.createdAt).toLocaleDateString("uk-UA", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      {(b.price || b.partsCost) && (
        <div className="cb-cost-row">
          {b.price    && <CostPill icon={<Wrench  size={10} />} label="Робота"  amount={b.price} />}
          {b.partsCost && <CostPill icon={<Package size={10} />} label="Деталі" amount={b.partsCost} />}
        </div>
      )}

      {b.workItems && b.workItems.length > 0 && (
        <div className="cb-work-items">
          <p className="cb-section-eyebrow">Виконані роботи</p>
          {b.workItems.map((item, i) => (
            <div key={i} className="cb-work-item">
              <span className="cb-work-check">✓</span>
              {item}
            </div>
          ))}
        </div>
      )}

      <ProgressTrack current={b.progress} />
    </div>
  );
}

/* ─── Skeleton ─── */
function CabinetSkeleton() {
  return (
    <div className="cb-skeleton-wrap">
      <div className="cb-stats">
        {[1, 2, 3].map((n) => (
          <div key={n} className="cb-stat-card">
            <div className="skeleton cb-sk-icon" />
            <div className="skeleton cb-sk-val" />
            <div className="skeleton cb-sk-lbl" />
          </div>
        ))}
      </div>
      {[1, 2].map((n) => (
        <div key={n} className="cb-card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div><div className="skeleton" style={{ height: 15, width: 140, borderRadius: 6, marginBottom: 8 }} /><div className="skeleton" style={{ height: 12, width: 100, borderRadius: 6 }} /></div>
            <div className="skeleton" style={{ height: 20, width: 70, borderRadius: 6 }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {[1, 2, 3, 4].map((k) => <div key={k} className="skeleton" style={{ height: 24, flex: 1, borderRadius: 99 }} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── AuthForm ─── */
function AuthForm({ onLogin }: { onLogin: (client: Client) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start polling /api/client/me after magic link is sent.
  // When verify runs in another tab and sets the cookie, this poll catches it.
  useEffect(() => {
    if (!sent) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/client/me", { credentials: "include" });
        if (res.ok) {
          const data: Client = await res.json();
          clearInterval(pollRef.current!);
          onLogin(data);
        }
      } catch { /* network error, keep polling */ }
    }, 2000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [sent, onLogin]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await fetch("/api/client/send-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false); setSent(true);
  };

  if (sent) return (
    <div className="cb-auth-wrap cb-auth-sent">
      <div className="cb-auth-icon-wrap cb-auth-icon-pulse">
        <Mail size={26} style={{ color: "var(--cb-green)" }} />
      </div>
      <h2 className="cb-auth-title">Перевірте пошту</h2>
      <p className="cb-auth-sub">
        Надіслали посилання для входу на{" "}
        <strong style={{ color: "var(--text)" }}>{email}</strong>. Воно діє 30 хвилин.
      </p>
      <div className="cb-auth-waiting">
        <span className="cb-dot" /><span className="cb-dot" /><span className="cb-dot" />
        <span>Чекаємо підтвердження…</span>
      </div>
      <button className="cb-auth-back" onClick={() => { setSent(false); setEmail(""); }}>
        ← Ввести інший email
      </button>
    </div>
  );

  return (
    <div className="cb-auth-wrap">
      <div className="cb-auth-icon-wrap">
        <User size={22} style={{ color: "var(--cb-green)" }} />
      </div>
      <h2 className="cb-auth-title">Увійти / зареєструватись</h2>
      <p className="cb-auth-sub">Введіть email — надішлемо посилання для входу. Без пароля.</p>

      <form onSubmit={submit} className="cb-auth-form">
        <div className="cb-field">
          <label className="cb-label">
            Email <span style={{ color: "var(--cb-green)" }}>*</span>
          </label>
          <div className="cb-input-wrap">
            <Mail size={14} className="cb-input-icon" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" required className="cb-input"
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--cb-green)")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className={`cb-submit-btn ${loading ? "cb-submit-btn--loading" : ""}`}>
          {loading ? (
            <span className="cb-spinner" />
          ) : (
            <><span>Отримати посилання</span><ArrowRight size={15} /></>
          )}
        </button>
      </form>
      <p className="cb-auth-hint">Акаунт створюється автоматично при першому вході.</p>
    </div>
  );
}

/* ─── Main cabinet ─── */
function CabinetContent() {
  const [client, setClient]   = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch("/api/client/me", { credentials: "include" });
      if (res.ok) setClient(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const logout = async () => {
    await fetch("/api/client/logout", { method: "POST", credentials: "include" });
    setClient(null);
  };

  if (loading) return <CabinetSkeleton />;
  if (!client)  return <AuthForm onLogin={(data) => setClient(data)} />;

  return (
    <div className="cb-content">
      <div className="cb-user-header">
        <div>
          <h1 className="cb-user-name">
            {client.name ? `Вітаємо, ${client.name}!` : "Особистий кабінет"}
          </h1>
          <p className="cb-user-email">{client.email}</p>
        </div>
        <button onClick={logout} className="cb-logout-btn">
          <LogOut size={14} /> Вийти
        </button>
      </div>

      {client.bookings.length > 0 && <StatsBar bookings={client.bookings} />}

      {client.bookings.length === 0 ? (
        <div className="cb-empty">
          <Wrench size={34} className="cb-empty-icon" />
          <p className="cb-empty-text">У вас ще немає замовлень</p>
          <a href="/services" className="cb-empty-link">
            Переглянути послуги <ArrowRight size={13} style={{ display: "inline" }} />
          </a>
        </div>
      ) : (
        <div>
          <p className="cb-section-eyebrow" style={{ marginBottom: 12 }}>Історія замовлень</p>
          <div className="cb-cards-list">
            {client.bookings.map((b, i) => <BookingCard key={b.id} b={b} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Page ─── */
export default function CabinetPage() {
  return (
    <>
      <style>{`
        /* ── Sage green palette (scoped to cabinet only) ── */
        .cb-root, .cb-root * {
          --cb-green:        #4a9e6b;
          --cb-green-hover:  #3a8459;
          --cb-green-subtle: rgba(74,158,107,0.10);
          --cb-green-border: rgba(74,158,107,0.30);
          --cb-green-text:   #ffffff;
        }

        /* ── Layout ── */
        .cb-page-hero {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 52px 16px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cb-page-hero::before {
          content: "";
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 120%, rgba(74,158,107,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .cb-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; color: #4a9e6b; margin-bottom: 10px;
        }
        .cb-page-title {
          font-size: clamp(1.6rem, 4vw, 2.6rem); font-weight: 800;
          color: var(--text); line-height: 1.15;
        }
        .cb-page-section { padding: 32px 0 64px; }
        .cb-content { max-width: 680px; margin: 0 auto; padding: 24px 16px 40px; }
        .cb-skeleton-wrap { max-width: 680px; margin: 0 auto; padding: 24px 16px; }

        /* ── User header ── */
        .cb-user-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 24px;
        }
        .cb-user-name { font-size: 18px; font-weight: 700; color: var(--text); }
        .cb-user-email { font-size: 13px; color: var(--text-muted); margin-top: 3px; }
        .cb-logout-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: var(--text-muted); background: none; border: none;
          cursor: pointer; padding: 6px 10px; border-radius: 8px;
          transition: background 0.18s, color 0.18s;
        }
        .cb-logout-btn:hover { background: var(--surface2); color: var(--text); }

        /* ── Stats ── */
        .cb-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 28px; }
        .cb-stat-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 16px 12px; text-align: center;
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .cb-stat-card:hover { box-shadow: 0 4px 16px rgba(74,158,107,0.12); transform: translateY(-2px); }
        .cb-stat-icon { display: flex; justify-content: center; color: #4a9e6b; margin-bottom: 8px; }
        .cb-stat-value { font-size: 22px; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; }
        .cb-stat-label { font-size: 11px; color: var(--text-faint); margin-top: 3px; }

        /* ── Skeleton cells ── */
        .cb-sk-icon { width: 20px; height: 20px; border-radius: 50%; margin: 0 auto 8px; }
        .cb-sk-val  { height: 22px; width: 50%; border-radius: 6px; margin: 0 auto 6px; }
        .cb-sk-lbl  { height: 11px; width: 60%; border-radius: 6px; margin: 0 auto; }

        /* ── Card ── */
        .cb-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 18px 20px;
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .cb-card:hover { box-shadow: 0 6px 24px rgba(74,158,107,0.10); transform: translateY(-2px); }
        .cb-cards-list { display: flex; flex-direction: column; gap: 12px; }

        .cb-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px; }
        .cb-card-header-right { text-align: right; flex-shrink: 0; margin-left: 12px; }
        .cb-card-car  { font-size: 14px; font-weight: 700; color: var(--text); }
        .cb-card-service { font-size: 13px; color: var(--text-muted); margin-top: 3px; }
        .cb-card-price { font-size: 17px; font-weight: 800; color: #4a9e6b; }
        .cb-card-price-tbd { font-size: 12px; color: var(--text-faint); }
        .cb-card-date { font-size: 12px; color: var(--text-faint); margin-top: 3px; }

        /* ── Cost pills ── */
        .cb-cost-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
        .cb-cost-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: var(--text-muted);
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 99px; padding: 3px 10px;
        }

        /* ── Work items ── */
        .cb-work-items { margin-top: 14px; }
        .cb-work-item { display: flex; gap: 8px; font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
        .cb-work-check { color: #4a9e6b; flex-shrink: 0; }

        /* ── Progress track ── */
        .cb-progress-track { display: flex; align-items: center; gap: 4px; margin-top: 16px; flex-wrap: wrap; }
        .cb-progress-item  { display: flex; align-items: center; gap: 4px; }
        .cb-progress-step {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600; padding: 4px 10px;
          border-radius: 99px; border: 1px solid transparent;
          transition: background 0.2s, color 0.2s;
        }
        .cb-progress-step--future {
          background: var(--surface2); color: var(--text-faint);
          border-color: var(--border);
        }
        .cb-progress-step--active {
          background: rgba(74,158,107,0.10);
          color: #4a9e6b; border-color: rgba(74,158,107,0.30);
        }
        .cb-progress-step--done {
          background: #4a9e6b; color: #fff; border-color: #4a9e6b;
        }
        .cb-progress-arrow { color: var(--text-faint); flex-shrink: 0; }
        .cb-progress-arrow--done { color: #4a9e6b; }

        /* ── Section eyebrow ── */
        .cb-section-eyebrow {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.12em; color: var(--text-faint);
        }

        /* ── Empty state ── */
        .cb-empty { text-align: center; padding: 56px 0; color: var(--text-faint); }
        .cb-empty-icon { margin: 0 auto 14px; opacity: 0.25; }
        .cb-empty-text { font-size: 14px; color: var(--text-muted); margin-bottom: 14px; }
        .cb-empty-link {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 13px; font-weight: 600; color: #4a9e6b;
          text-decoration: none; border-bottom: 1px solid rgba(74,158,107,0.30);
          padding-bottom: 1px; transition: border-color 0.18s;
        }
        .cb-empty-link:hover { border-color: #4a9e6b; }

        /* ── Auth form ── */
        .cb-auth-wrap {
          max-width: 360px; margin: 0 auto; padding: 0 16px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }
        .cb-auth-sent { padding-top: 24px; }
        .cb-auth-icon-wrap {
          width: 56px; height: 56px; border-radius: 14px;
          background: rgba(74,158,107,0.10);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
        }
        /* Pulse animation on icon when waiting */
        .cb-auth-icon-pulse {
          animation: iconPulse 2s ease-in-out infinite;
        }
        @keyframes iconPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,158,107,0.0); }
          50%       { box-shadow: 0 0 0 10px rgba(74,158,107,0.12); }
        }
        .cb-auth-title { font-size: 19px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
        .cb-auth-sub   { font-size: 13px; color: var(--text-muted); max-width: 30ch; line-height: 1.55; }
        .cb-auth-back  {
          margin-top: 18px; font-size: 13px; color: #4a9e6b;
          background: none; border: none; cursor: pointer;
          text-decoration: underline; text-underline-offset: 3px;
        }
        .cb-auth-form  {
          width: 100%; background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 24px 20px;
          display: flex; flex-direction: column; gap: 14px; margin-top: 22px;
        }
        .cb-auth-hint { font-size: 11px; color: var(--text-faint); margin-top: 12px; }

        /* ── Waiting indicator ── */
        .cb-auth-waiting {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: 18px; font-size: 12px; color: var(--text-faint);
        }
        .cb-dot {
          display: inline-block; width: 5px; height: 5px; border-radius: 50%;
          background: #4a9e6b; opacity: 0.5;
          animation: dotBounce 1.3s ease-in-out infinite;
        }
        .cb-dot:nth-child(2) { animation-delay: 0.15s; }
        .cb-dot:nth-child(3) { animation-delay: 0.30s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%           { transform: translateY(-5px); opacity: 1; }
        }

        /* ── Field / input ── */
        .cb-field { display: flex; flex-direction: column; gap: 6px; text-align: left; }
        .cb-label  { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
        .cb-input-wrap { position: relative; }
        .cb-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-faint); }
        .cb-input {
          width: 100%; border-radius: 10px; padding: 10px 12px 10px 36px;
          font-size: 13px; color: var(--text); background: var(--surface2);
          border: 1px solid var(--border); outline: none;
          transition: border-color 0.18s;
        }

        /* ── Submit button ── */
        .cb-submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #4a9e6b; color: #fff; font-weight: 700; font-size: 13px;
          padding: 12px; border-radius: 10px; border: none; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .cb-submit-btn:hover:not(:disabled) {
          background: #3a8459; transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(74,158,107,0.30);
        }
        .cb-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .cb-submit-btn--loading { opacity: 0.65; cursor: not-allowed; }

        /* ── Spinner ── */
        .cb-spinner {
          display: inline-block; width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          animation: spin 0.65s linear infinite;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .cb-stats { grid-template-columns: repeat(3,1fr); gap: 6px; }
          .cb-stat-value { font-size: 18px; }
          .cb-card { padding: 14px 14px; }
          .cb-progress-track { gap: 2px; }
          .cb-progress-step  { font-size: 10px; padding: 3px 7px; }
          .cb-progress-arrow { display: none; }
        }
      `}</style>

      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        <section className="cb-page-hero">
          <p className="cb-eyebrow">Клієнтам</p>
          <h1 className="cb-page-title">Особистий кабінет</h1>
        </section>

        <section className="cb-page-section">
          <Suspense fallback={<CabinetSkeleton />}>
            <CabinetContent />
          </Suspense>
        </section>
      </main>
    </>
  );
}
