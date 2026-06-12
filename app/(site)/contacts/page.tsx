"use client";

import { useState } from "react";
import { Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactsPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name" && !/^[a-zA-Z\u0400-\u04FF\s\-']*$/.test(value)) return;
    if (name === "phone" && !/^[0-9+()\-\s]*$/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Помилка відправки. Спробуйте ще раз або зателефонуйте.");
    } finally {
      setLoading(false);
    }
  };

  const info = [
    {
      icon: Phone,
      label: "Телефон",
      value: "+38 (066) 418-88-26",
      href: "tel:+380664188826",
    },
    {
      icon: MapPin,
      label: "Адреса",
      value: "Рівненська обл., с. Велика Омеляна, вул. Шевченка 35",
      href: "https://maps.google.com/?q=Велика+Омеляна+вул.Шевченка+35",
    },
    {
      icon: Clock,
      label: "Графік роботи",
      value: "Пн–Сб: 08:00 – 18:00",
      href: null,
    },
  ];

  return (
    <>
      <main className="ct">

        {/* ═══ HERO ════════════════════════════════ */}
        <section className="ct-hero">
          <div className="container ct-hero__inner">
            <div>
              <p className="ct-label">Зв&apos;язок</p>
              <h1 className="ct-hero__title">Контакти</h1>
            </div>
            <p className="ct-hero__sub">
              Маєте питання чи хочете записатись?
              <br />Напишіть або зателефонуйте — відповімо протягом дня.
            </p>
          </div>
          <div className="ct-hero__line" aria-hidden />
        </section>

        {/* ═══ INFO CARDS ══════════════════════════ */}
        <section className="ct-info">
          <div className="container ct-info__grid">
            {info.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="ct-card">
                <Icon size={14} className="ct-card__ico" aria-hidden />
                <div>
                  <p className="ct-card__label">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="ct-card__val ct-card__val--link"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="ct-card__val">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ MAP + FORM ══════════════════════════ */}
        <section className="ct-main">
          <div className="container ct-main__grid">

            {/* MAP */}
            <div className="ct-map">
              <iframe
                title="Тірнью на карті"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.0!2d26.2300!3d50.6200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0JLQtdC70LjQutCwINCe0LzQtdC70Y_QvdCwLCDQstGD0LsuINCo0LXQstGH0LXQvdC60LAsIDM1!5e0!3m2!1suk!2sua!4v1700000000000"
                width="100%"
                height="100%"
                className="ct-map__iframe"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* FORM */}
            <div className="ct-form-wrap">
              {submitted ? (
                <div className="ct-success">
                  <div className="ct-success__icon" aria-hidden>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="ct-success__title">Повідомлення надіслано</h3>
                  <p className="ct-success__text">
                    Ми отримали ваше повідомлення і зв&apos;яжемось найближчим часом.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", message: "" }); }}
                    className="ct-success__repeat"
                  >
                    Надіслати ще одне
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="ct-form" noValidate>
                  <div className="ct-form__head">
                    <h2 className="ct-form__title">Напишіть нам</h2>
                    <p className="ct-form__sub">Відповімо протягом робочого дня</p>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="name" className="ct-label-txt">Ім&apos;я</label>
                    <input
                      id="name" name="name" required
                      value={form.name} onChange={handleChange}
                      placeholder="Олексій"
                      autoComplete="name"
                      className="ct-input"
                    />
                  </div>

                  <div className="ct-field">
                    <label htmlFor="phone" className="ct-label-txt">Телефон</label>
                    <input
                      id="phone" name="phone" type="tel" required
                      value={form.phone} onChange={handleChange}
                      placeholder="+380 66 418 88 26"
                      autoComplete="tel"
                      inputMode="tel"
                      className="ct-input"
                    />
                  </div>

                  <div className="ct-field">
                    <label htmlFor="message" className="ct-label-txt">Повідомлення</label>
                    <textarea
                      id="message" name="message" required rows={4}
                      value={form.message} onChange={handleChange}
                      placeholder="Опишіть ваше питання або проблему..."
                      className="ct-input ct-textarea"
                    />
                  </div>

                  {error && (
                    <p className="ct-form__error" role="alert">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary ct-submit"
                  >
                    {loading ? (
                      <span className="ct-spinner" aria-hidden />
                    ) : (
                      <Send size={13} aria-hidden />
                    )}
                    {loading ? "Надсилається..." : "Надіслати повідомлення"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      <style>{`
        .ct {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* ══ HERO ═══════════════════════════════════ */
        .ct-hero {
          padding-block: clamp(3.5rem, 7vw, 5.5rem) clamp(2rem, 4vw, 3rem);
          border-bottom: 1px solid var(--border);
        }
        .ct-hero__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: end;
          gap: clamp(var(--space-4), 4vw, var(--space-12));
        }
        .ct-label {
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
        .ct-label::before {
          content: '';
          display: inline-block;
          width: 16px; height: 1.5px;
          background: currentColor;
          border-radius: 2px;
        }
        .ct-hero__title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 6vw, 4rem);
          font-weight: 900;
          line-height: 1.0;
          color: var(--text);
          letter-spacing: -0.035em;
        }
        .ct-hero__sub {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.75;
          max-width: 34ch;
          align-self: end;
        }
        .ct-hero__line {
          display: none;
        }

        /* ══ INFO CARDS ═════════════════════════════ */
        .ct-info {
          padding-block: clamp(var(--space-6), 3vw, var(--space-8));
          border-bottom: 1px solid var(--border);
        }
        .ct-info__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
        }
        .ct-card {
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-5) var(--space-5);
          transition: border-color 0.16s ease;
        }
        .ct-card:hover {
          border-color: oklch(from var(--primary) l c h / 0.28);
        }
        .ct-card__ico {
          color: var(--primary);
          opacity: 0.65;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .ct-card__label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.11em;
          color: var(--text-faint);
          margin-bottom: var(--space-1);
        }
        .ct-card__val {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text);
          line-height: 1.5;
        }
        .ct-card__val--link {
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .ct-card__val--link:hover { color: var(--primary); }

        /* ══ MAP + FORM ═════════════════════════════ */
        .ct-main {
          padding-block: clamp(var(--space-8), 4vw, var(--space-12)) var(--space-16);
        }
        .ct-main__grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: clamp(var(--space-4), 3vw, var(--space-8));
          align-items: start;
        }
        .ct-map {
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--border);
          aspect-ratio: 4 / 3;
          background: var(--surface);
        }
        .ct-map__iframe {
          display: block;
          width: 100%; height: 100%;
          border: none;
          filter: grayscale(0.25) contrast(0.95);
        }

        /* FORM */
        .ct-form-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: clamp(var(--space-6), 3vw, var(--space-8));
        }
        .ct-form__head {
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-5);
          border-bottom: 1px solid var(--border);
        }
        .ct-form__title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.015em;
          margin-bottom: var(--space-1);
        }
        .ct-form__sub {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }
        .ct-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .ct-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .ct-label-txt {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }
        .ct-input {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-sm);
          color: var(--text);
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          font-family: var(--font-body);
        }
        .ct-input::placeholder {
          color: var(--text-faint);
        }
        .ct-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px oklch(from var(--primary) l c h / 0.12);
        }
        .ct-textarea {
          resize: none;
          line-height: 1.65;
        }
        .ct-form__error {
          font-size: var(--text-xs);
          color: oklch(0.55 0.18 15);
          padding: var(--space-2) var(--space-3);
          background: oklch(0.55 0.18 15 / 0.06);
          border-radius: var(--radius-sm);
          border: 1px solid oklch(0.55 0.18 15 / 0.18);
        }
        .ct-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          width: 100%;
          padding-block: var(--space-3);
          font-size: var(--text-sm);
          font-weight: 600;
        }
        .ct-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ct-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid oklch(1 0 0 / 0.25);
          border-top-color: #fff;
          animation: ct-spin 0.65s linear infinite;
        }
        @keyframes ct-spin {
          to { transform: rotate(360deg); }
        }

        /* SUCCESS STATE */
        .ct-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(var(--space-8), 4vw, var(--space-12)) var(--space-6);
          gap: var(--space-3);
        }
        .ct-success__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 1.5px solid oklch(from var(--primary) l c h / 0.30);
          color: var(--primary);
          margin-bottom: var(--space-1);
        }
        .ct-success__title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .ct-success__text {
          font-size: var(--text-sm);
          color: var(--text-muted);
          max-width: 28ch;
          line-height: 1.65;
        }
        .ct-success__repeat {
          margin-top: var(--space-2);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--primary);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          opacity: 0.75;
          transition: opacity 0.15s ease;
        }
        .ct-success__repeat:hover { opacity: 1; }

        /* ══ RESPONSIVE ═════════════════════════════ */
        @media (max-width: 900px) {
          .ct-main__grid {
            grid-template-columns: 1fr;
          }
          .ct-map { aspect-ratio: 16 / 7; }
        }
        @media (max-width: 700px) {
          .ct-hero__inner {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }
          .ct-info__grid {
            grid-template-columns: 1fr;
          }
          .ct-hero__sub { max-width: 100%; }
        }
        @media (max-width: 480px) {
          .ct-map { aspect-ratio: 4 / 3; }
        }
      `}</style>
    </>
  );
}
