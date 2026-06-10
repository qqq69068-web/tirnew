"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Помилка входу"); return; }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Мережева помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="al-root">

        {/* ── Left panel — branding ── */}
        <div className="al-brand" aria-hidden="true">
          {/* Grid pattern */}
          <div className="al-brand__grid" />

          {/* Diagonal accent line */}
          <div className="al-brand__line" />

          {/* Content */}
          <div className="al-brand__content">
            <div className="al-logo">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-label="TIR NEW">
                <polygon
                  points="16,2 30,9 30,23 16,30 2,23 2,9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <text
                  x="16" y="21"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="var(--font-display, sans-serif)"
                  fill="currentColor"
                >
                  T
                </text>
              </svg>
              <span className="al-logo__name">TIR NEW</span>
            </div>

            <div className="al-brand__text">
              <p className="al-brand__eyebrow">Сервісний центр</p>
              <h1 className="al-brand__title">Панель<br/>керування</h1>
              <p className="al-brand__desc">
                Доступ до замовлень, клієнтів та послуг автосервісу.
              </p>
            </div>

            {/* Decorative stats */}
            <div className="al-brand__stats">
              <div className="al-stat">
                <span className="al-stat__value">24/7</span>
                <span className="al-stat__label">Онлайн-запис</span>
              </div>
              <div className="al-stat__divider" />
              <div className="al-stat">
                <span className="al-stat__value">100%</span>
                <span className="al-stat__label">Безпека</span>
              </div>
              <div className="al-stat__divider" />
              <div className="al-stat">
                <span className="al-stat__value">SSL</span>
                <span className="al-stat__label">Шифрування</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel — form ── */}
        <div className="al-form-panel">
          <div className="al-form-wrap">

            {/* Mobile logo */}
            <div className="al-mobile-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="TIR NEW">
                <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="var(--font-display,sans-serif)" fill="currentColor">T</text>
              </svg>
              <span>TIR NEW</span>
            </div>

            <div className="al-form-header">
              <p className="section-eyebrow">Адміністратор</p>
              <h2 className="al-form-title">Вхід в систему</h2>
              <p className="al-form-sub">Введіть ваші облікові дані для продовження</p>
            </div>

            <form onSubmit={handleSubmit} className="al-form" noValidate>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="al-input-wrap">
                  <span className="al-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input al-input al-input--icon"
                    placeholder="admin@tirnew.ua"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Пароль</label>
                <div className="al-input-wrap">
                  <span className="al-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input al-input al-input--icon al-input--with-toggle"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="al-pass-toggle"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? "Сховати пароль" : "Показати пароль"}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="al-error" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary al-submit"
              >
                {loading ? (
                  <>
                    <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                    </svg>
                    Вхід...
                  </>
                ) : (
                  <>
                    Увійти
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </>
                )}
              </button>

            </form>

            {/* Security note */}
            <p className="al-security-note">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Захищено за допомогою JWT аутентифікації
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* ─── Root layout ─────────────────────────────────────────────── */
        .al-root {
          min-height: 100dvh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--color-bg, #0c0c0c);
        }
        @media (max-width: 768px) {
          .al-root { grid-template-columns: 1fr; }
        }

        /* ─── Left brand panel ──────────────────────────────────────── */
        .al-brand {
          position: relative;
          background: var(--color-bg, #0c0c0c);
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 48px;
        }
        @media (max-width: 768px) {
          .al-brand { display: none; }
        }

        /* Precision engineering grid */
        .al-brand__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(185,28,28,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(185,28,28,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 30% 60%, black 20%, transparent 80%);
          pointer-events: none;
        }

        /* Diagonal accent slash */
        .al-brand__line {
          position: absolute;
          top: 0;
          right: 80px;
          width: 1px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(185,28,28,0.3) 30%,
            rgba(185,28,28,0.6) 55%,
            rgba(185,28,28,0.3) 75%,
            transparent 100%
          );
          transform: skewX(-12deg);
          pointer-events: none;
        }

        .al-brand__content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* Logo */
        .al-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--color-accent, #b91c1c);
        }
        .al-logo__name {
          font-family: var(--font-display, 'Cabinet Grotesk', sans-serif);
          font-size: 1.125rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--color-text, #e8e4dc);
        }

        /* Brand text */
        .al-brand__eyebrow {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-accent, #b91c1c);
          margin-bottom: 12px;
          max-width: none;
        }
        .al-brand__title {
          font-family: var(--font-display, 'Cabinet Grotesk', sans-serif);
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 800;
          line-height: 1.0;
          color: var(--color-text, #e8e4dc);
          letter-spacing: -0.02em;
          max-width: none;
        }
        .al-brand__desc {
          margin-top: 16px;
          font-size: 0.9375rem;
          color: var(--color-text-muted, #7a7672);
          line-height: 1.6;
          max-width: 28ch;
        }

        /* Stats row */
        .al-brand__stats {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 8px;
        }
        .al-stat {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .al-stat__value {
          font-family: var(--font-display, sans-serif);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text, #e8e4dc);
          letter-spacing: -0.01em;
          font-variant-numeric: tabular-nums;
        }
        .al-stat__label {
          font-size: 0.6875rem;
          color: var(--color-text-muted, #7a7672);
          letter-spacing: 0.04em;
        }
        .al-stat__divider {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.08);
        }

        /* Light mode brand panel */
        :root:not([data-theme="dark"]) .al-brand {
          background: var(--color-surface, #f9f8f5);
          border-right-color: var(--color-border, #e4e1da);
        }
        :root:not([data-theme="dark"]) .al-brand__grid {
          background-image:
            linear-gradient(rgba(185,28,28,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(185,28,28,0.06) 1px, transparent 1px);
        }
        :root:not([data-theme="dark"]) .al-stat__divider {
          background: rgba(0,0,0,0.1);
        }

        /* ─── Right form panel ───────────────────────────────────────── */
        .al-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: var(--color-bg, #0c0c0c);
        }
        @media (max-width: 768px) {
          .al-form-panel { padding: 40px 24px; }
        }

        .al-form-wrap {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          animation: fadeIn 0.35s ease both;
        }

        /* Mobile logo (only shown on small screens) */
        .al-mobile-logo {
          display: none;
          align-items: center;
          gap: 10px;
          color: var(--color-accent, #b91c1c);
          font-family: var(--font-display, sans-serif);
          font-weight: 800;
          font-size: 0.9375rem;
          letter-spacing: 0.1em;
        }
        @media (max-width: 768px) {
          .al-mobile-logo { display: flex; }
        }

        .al-form-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .al-form-title {
          font-family: var(--font-display, 'Cabinet Grotesk', sans-serif);
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 800;
          color: var(--color-text, #e8e4dc);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .al-form-sub {
          font-size: 0.875rem;
          color: var(--color-text-muted, #7a7672);
          line-height: 1.5;
          max-width: none;
        }

        /* Form */
        .al-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Input with icon */
        .al-input-wrap {
          position: relative;
        }
        .al-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-faint, #5a5957);
          display: flex;
          align-items: center;
          pointer-events: none;
          transition: color 180ms ease;
        }
        .al-input {
          width: 100%;
        }
        .al-input--icon {
          padding-left: 42px !important;
        }
        .al-input--with-toggle {
          padding-right: 42px !important;
        }
        .al-input:focus + .al-input-icon,
        .al-input-wrap:focus-within .al-input-icon {
          color: var(--color-accent, #b91c1c);
        }

        /* Password toggle */
        .al-pass-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-faint, #5a5957);
          border-radius: var(--radius-sm, 4px);
          transition: color 180ms ease, background 180ms ease;
        }
        .al-pass-toggle:hover {
          color: var(--color-text, #e8e4dc);
          background: rgba(255,255,255,0.06);
        }

        /* Error alert */
        .al-error {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: var(--color-error, #ef4444);
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: var(--radius-md, 8px);
          padding: 10px 14px;
          animation: fadeIn 0.2s ease both;
        }

        /* Submit button — full width */
        .al-submit {
          width: 100%;
          justify-content: center;
          padding: 13px 20px !important;
          font-size: var(--text-sm) !important;
          margin-top: 4px;
          gap: 8px;
        }
        .al-submit svg:last-child {
          transition: transform 180ms ease;
        }
        .al-submit:hover:not(:disabled) svg:last-child {
          transform: translateX(3px);
        }

        /* Security note */
        .al-security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.6875rem;
          color: var(--color-text-faint, #5a5957);
          max-width: none;
        }

        /* Spinner */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 0.7s linear infinite;
        }

        /* Light mode overrides */
        :root:not([data-theme="dark"]) .al-form-panel {
          background: var(--color-bg, #f5f2ed);
        }
        :root:not([data-theme="dark"]) .al-form-title {
          color: var(--color-text, #1c1a17);
        }
        :root:not([data-theme="dark"]) .al-pass-toggle:hover {
          background: rgba(0,0,0,0.06);
          color: var(--color-text, #1c1a17);
        }
      `}</style>
    </>
  );
}
