"use client";

import { useState, useEffect } from "react";
import { Package, Phone, User, Car, FileText, Hash, Info } from "lucide-react";

function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) {
  setter(e.target.value.replace(/[^\d+\s\-]/g, ""));
}

export default function PartsOrderPage() {
  const [session, setSession] = useState<{ email: string; name: string | null; phone?: string | null } | null>(null);
  const [form, setForm] = useState({
    name: "", phone: "", carBrand: "", carModel: "",
    vin: "", partName: "", partNumber: "", comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/client/me", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.email) {
          setSession({ email: data.email, name: data.name, phone: data.phone });
          setForm((f) => ({
            ...f,
            name:  f.name  || data.name  || "",
            phone: f.phone || data.phone || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const msgParts = [
        form.vin        ? `VIN: ${form.vin}` : "",
        form.partNumber ? `Артикул: ${form.partNumber}` : "",
        form.comment    ? `Коментар: ${form.comment}` : "",
      ].filter(Boolean).join(" | ");
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, phone: form.phone,
          carBrand: form.carBrand || null, carModel: form.carModel || null,
          service: `Замовлення запчастин: ${form.partName}`,
          message: msgParts || null,
          clientEmail: session?.email || null,
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Сталася помилка. Спробуйте ще раз або зателефонуйте.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── SUCCESS ────────────────────────────────────── */
  if (sent) {
    return (
      <>
        <main className="po-success-page">
          <div className="po-success">
            <div className="po-success__ico" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="po-success__title">Заявку отримано</h2>
            <p className="po-success__text">
              Наш менеджер зв’яжеться з вами найближчим часом.
            </p>
            {session && (
              <p className="po-success__cabinet">
                Замовлення відобразиться в особистому кабінеті
              </p>
            )}
            <div className="po-success__btns">
              <a href="/" className="btn btn-outline">На головну</a>
              {session && (
                <a href="/cabinet" className="btn btn-primary">Мій кабінет</a>
              )}
            </div>
          </div>
        </main>
        <style>{successStyles}</style>
      </>
    );
  }

  /* ─── MAIN FORM ─────────────────────────────────── */
  return (
    <>
      <main className="po">

        {/* HERO */}
        <section className="po-hero">
          <div className="container po-hero__inner">
            <div>
              <p className="po-label">Запчастини</p>
              <h1 className="po-hero__title">Замовлення<br />деталей</h1>
            </div>
            <p className="po-hero__sub">
              Підберемо оригінал або перевірений аналог,
              <br />організуємо доставку. Залишайте заявку — ми займемось усім.
            </p>
          </div>
        </section>

        {/* FORM AREA */}
        <section className="po-body">
          <div className="po-body__inner">

            {session && (
              <div className="po-session-banner">
                <Info size={13} className="po-session-banner__ico" aria-hidden />
                <p className="po-session-banner__text">
                  Замовлення буде прив’язано до вашого кабінету{" "}
                  <strong>{session.email}</strong>
                </p>
              </div>
            )}

            <form onSubmit={submit} className="po-form" noValidate>

              {/* ── 01: Що потрібно */}
              <fieldset className="po-fieldset">
                <legend className="po-legend">
                  <span className="po-legend__num">01</span>
                  Що потрібно
                </legend>
                <div className="po-fields">
                  <div className="po-field">
                    <label htmlFor="partName" className="po-field__label">
                      Назва деталі <span className="po-required" aria-hidden>*</span>
                    </label>
                    <div className="po-input-wrap">
                      <Package size={13} className="po-input-ico" aria-hidden />
                      <input
                        id="partName" type="text" required
                        placeholder="Супорт, підшипник, повітряний ремінь..."
                        value={form.partName}
                        onChange={(e) => set("partName", e.target.value)}
                        className="po-input"
                      />
                    </div>
                  </div>
                  <div className="po-field">
                    <label htmlFor="partNumber" className="po-field__label">
                      Артикул (якщо знаєте)
                    </label>
                    <div className="po-input-wrap">
                      <FileText size={13} className="po-input-ico" aria-hidden />
                      <input
                        id="partNumber" type="text"
                        placeholder="K58351"
                        value={form.partNumber}
                        onChange={(e) => set("partNumber", e.target.value)}
                        className="po-input"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* ── 02: Для якого авто */}
              <fieldset className="po-fieldset">
                <legend className="po-legend">
                  <span className="po-legend__num">02</span>
                  Для якого авто
                </legend>
                <div className="po-fields po-fields--2col">
                  <div className="po-field">
                    <label htmlFor="carBrand" className="po-field__label">Марка</label>
                    <div className="po-input-wrap">
                      <Car size={13} className="po-input-ico" aria-hidden />
                      <input
                        id="carBrand" type="text"
                        placeholder="Volvo, DAF, MAN..."
                        value={form.carBrand}
                        onChange={(e) => set("carBrand", e.target.value)}
                        className="po-input"
                      />
                    </div>
                  </div>
                  <div className="po-field">
                    <label htmlFor="carModel" className="po-field__label">Модель / рік</label>
                    <div className="po-input-wrap">
                      <Car size={13} className="po-input-ico" aria-hidden />
                      <input
                        id="carModel" type="text"
                        placeholder="FH16, 2018"
                        value={form.carModel}
                        onChange={(e) => set("carModel", e.target.value)}
                        className="po-input"
                      />
                    </div>
                  </div>
                </div>
                <div className="po-field">
                  <label htmlFor="vin" className="po-field__label">
                    VIN-код (необов’язково)
                  </label>
                  <div className="po-input-wrap">
                    <Hash size={13} className="po-input-ico" aria-hidden />
                    <input
                      id="vin" type="text"
                      placeholder="17 символів"
                      value={form.vin}
                      onChange={(e) => set("vin", e.target.value.toUpperCase())}
                      maxLength={17}
                      className="po-input po-input--mono"
                    />
                  </div>
                </div>
              </fieldset>

              {/* ── 03: Ваші контакти */}
              <fieldset className="po-fieldset">
                <legend className="po-legend">
                  <span className="po-legend__num">03</span>
                  Ваші контакти
                </legend>
                <div className="po-fields po-fields--2col">
                  <div className="po-field">
                    <label htmlFor="name" className="po-field__label">
                      Ім’я <span className="po-required" aria-hidden>*</span>
                    </label>
                    <div className="po-input-wrap">
                      <User size={13} className="po-input-ico" aria-hidden />
                      <input
                        id="name" type="text" required
                        placeholder="Іван"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        autoComplete="name"
                        className="po-input"
                      />
                    </div>
                  </div>
                  <div className="po-field">
                    <label htmlFor="phone" className="po-field__label">
                      Телефон <span className="po-required" aria-hidden>*</span>
                    </label>
                    <div className="po-input-wrap">
                      <Phone size={13} className="po-input-ico" aria-hidden />
                      <input
                        id="phone" type="tel" required inputMode="tel"
                        placeholder="+38 050 000 00 00"
                        value={form.phone}
                        onChange={(e) => handlePhoneInput(e, (v) => set("phone", v))}
                        autoComplete="tel"
                        className="po-input"
                      />
                    </div>
                  </div>
                </div>
                <div className="po-field">
                  <label htmlFor="comment" className="po-field__label">Коментар</label>
                  <textarea
                    id="comment"
                    placeholder="Кількість, терміновість, особливості..."
                    value={form.comment}
                    onChange={(e) => set("comment", e.target.value)}
                    className="po-textarea"
                    rows={3}
                  />
                </div>
              </fieldset>

              {error && (
                <p className="po-error" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary po-submit"
              >
                {loading && <span className="po-spinner" aria-hidden />}
                {loading ? "Надсилаємо..." : "Надіслати заявку"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <style>{pageStyles}</style>
    </>
  );
}

const successStyles = `
  .po-success-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
    background: var(--bg);
  }
  .po-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 400px;
    gap: var(--space-3);
  }
  .po-success__ico {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px; height: 52px;
    border-radius: 50%;
    border: 1.5px solid oklch(from var(--primary) l c h / 0.35);
    color: var(--primary);
    margin-bottom: var(--space-2);
  }
  .po-success__title {
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    font-weight: 900;
    color: var(--text);
    letter-spacing: -0.02em;
  }
  .po-success__text {
    font-size: var(--text-sm);
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 28ch;
  }
  .po-success__cabinet {
    font-size: var(--text-xs);
    color: var(--primary);
    opacity: 0.75;
  }
  .po-success__btns {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-2);
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const pageStyles = `
  .po {
    min-height: 100vh;
    background: var(--bg);
  }

  /* ══ HERO ════════════════════════════════ */
  .po-hero {
    padding-block: clamp(3.5rem, 7vw, 5.5rem) clamp(2rem, 4vw, 3rem);
    border-bottom: 1px solid var(--border);
  }
  .po-hero__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: end;
    gap: clamp(var(--space-4), 4vw, var(--space-12));
  }
  .po-label {
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: var(--space-3);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  .po-label::before {
    content: '';
    display: inline-block;
    width: 16px; height: 1.5px;
    background: currentColor;
    border-radius: 2px;
  }
  .po-hero__title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 6vw, 4rem);
    font-weight: 900;
    line-height: 1.0;
    color: var(--text);
    letter-spacing: -0.035em;
  }
  .po-hero__sub {
    font-size: var(--text-sm);
    color: var(--text-muted);
    line-height: 1.75;
    max-width: 34ch;
    align-self: end;
  }

  /* ══ BODY ════════════════════════════════ */
  .po-body {
    padding-block: clamp(var(--space-8), 4vw, var(--space-12)) var(--space-16);
  }
  .po-body__inner {
    max-width: 680px;
    margin-inline: auto;
    padding-inline: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  /* Session banner */
  .po-session-banner {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: oklch(from var(--primary) l c h / 0.06);
    border: 1px solid oklch(from var(--primary) l c h / 0.20);
    border-radius: var(--radius-md);
  }
  .po-session-banner__ico {
    color: var(--primary);
    flex-shrink: 0;
    margin-top: 1px;
    opacity: 0.7;
  }
  .po-session-banner__text {
    font-size: var(--text-xs);
    color: var(--text-muted);
    line-height: 1.6;
  }
  .po-session-banner__text strong {
    color: var(--text);
    font-weight: 600;
  }

  /* ══ FORM ════════════════════════════════ */
  .po-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  /* Fieldset */
  .po-fieldset {
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding-block: var(--space-5);
    border-bottom: 1px solid var(--border);
  }
  .po-fieldset:last-of-type {
    border-bottom: none;
  }
  .po-legend {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.10em;
    color: var(--text-faint);
    margin-bottom: var(--space-1);
    float: left;
    width: 100%;
    padding-bottom: var(--space-3);
  }
  .po-legend__num {
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 900;
    color: var(--primary);
    letter-spacing: 0.04em;
  }

  /* Fields grid */
  .po-fields {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  .po-fields--2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }

  /* Field */
  .po-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  .po-field__label {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-muted);
  }
  .po-required { color: var(--primary); }

  /* Input */
  .po-input-wrap {
    position: relative;
  }
  .po-input-ico {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-faint);
    pointer-events: none;
    flex-shrink: 0;
  }
  .po-input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4) var(--space-3) 2.25rem;
    font-size: var(--text-sm);
    color: var(--text);
    outline: none;
    caret-color: var(--text);
    font-family: var(--font-body);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .po-input::placeholder { color: var(--text-faint); }
  .po-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px oklch(from var(--primary) l c h / 0.12);
  }
  .po-input--mono {
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 0.06em;
  }

  /* Autofill */
  .po-input:-webkit-autofill,
  .po-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 9999px var(--bg) inset !important;
    -webkit-text-fill-color: var(--text) !important;
    caret-color: var(--text);
  }

  /* Textarea */
  .po-textarea {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4);
    font-size: var(--text-sm);
    color: var(--text);
    outline: none;
    resize: none;
    line-height: 1.65;
    font-family: var(--font-body);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .po-textarea::placeholder { color: var(--text-faint); }
  .po-textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px oklch(from var(--primary) l c h / 0.12);
  }

  /* Error */
  .po-error {
    font-size: var(--text-xs);
    color: oklch(0.55 0.18 15);
    padding: var(--space-2) var(--space-3);
    background: oklch(0.55 0.18 15 / 0.06);
    border: 1px solid oklch(0.55 0.18 15 / 0.18);
    border-radius: var(--radius-sm);
  }

  /* Submit */
  .po-submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    width: 100%;
    padding-block: var(--space-3);
    margin-top: var(--space-4);
  }
  .po-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .po-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid oklch(1 0 0 / 0.25);
    border-top-color: #fff;
    animation: po-spin 0.65s linear infinite;
    flex-shrink: 0;
  }
  @keyframes po-spin { to { transform: rotate(360deg); } }

  /* ══ RESPONSIVE ══════════════════════════════ */
  @media (max-width: 700px) {
    .po-hero__inner {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
    .po-hero__sub { max-width: 100%; }
    .po-fields--2col { grid-template-columns: 1fr; }
  }
`;
