"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowRight, CheckCircle2, Package, Truck, Car, Wrench } from "lucide-react";

const tirServices = services.filter((s) => s.vehicleType === "truck");
const carServices = services.filter((s) => s.vehicleType === "car");

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.06 }
    );
    el.querySelectorAll(".reveal").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function ServicesPage() {
  const [tab, setTab] = useState<"tir" | "car">("tir");
  const ref = useReveal();
  const list = tab === "tir" ? tirServices : carServices;

  /* Re-trigger reveal when tab changes */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Reset visibility so stagger re-plays */
    el.querySelectorAll(".reveal").forEach((n) => n.classList.remove("visible"));
    const timeout = setTimeout(() => {
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
        { threshold: 0.06 }
      );
      el.querySelectorAll(".reveal").forEach((n) => obs.observe(n));
      return () => obs.disconnect();
    }, 32);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <>
      <div ref={ref} className="services-page">

        {/* ════ HERO ═════════════════════════════════════════════════ */}
        <section className="services-hero" aria-label="Заголовок">
          <div
            className="services-hero__bg"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)" }}
            aria-hidden
          />
          {/* z-index: 1 — overlay sits above bg but below content */}
          <div className="services-hero__overlay" aria-hidden />
          {/* z-index: 2 — content always on top */}
          <div className="container services-hero__content fade-in">
            <span className="section-eyebrow">
              <Wrench size={10} aria-hidden />
              Каталог
            </span>
            <h1 className="services-hero__title">Каталог послуг</h1>
            <p className="services-hero__sub">
              Повний цикл ремонту та обслуговування вантажного транспорту, причіпної техніки та легкових автомобілів.
            </p>
            {/* stat strip */}
            <div className="services-hero__stats">
              {[
                { value: tirServices.length, label: "Послуг TIR" },
                { value: carServices.length, label: "Послуг легков" },
                { value: "24/7", label: "асистент" },
              ].map(({ value, label }) => (
                <div key={label} className="services-hero__stat">
                  <span className="services-hero__stat-value">{value}</span>
                  <span className="services-hero__stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ TABS ═════════════════════════════════════════════════ */}
        <div className="services-tabs-bar">
          <div className="container services-tabs-bar__inner">
            {(["tir", "car"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`services-tab${tab === t ? " active" : ""}`}
                aria-selected={tab === t}
                role="tab"
              >
                {t === "tir"
                  ? <Truck size={13} strokeWidth={2} aria-hidden />
                  : <Car  size={13} strokeWidth={2} aria-hidden />}
                {t === "tir" ? "Вантажні / ТІР" : "Легкові"}
                <span className="services-tab__count">
                  {t === "tir" ? tirServices.length : carServices.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ════ SERVICES LIST ═══════════════════════════════════════════════ */}
        <section className="services-list-section">
          <div className="container">

            {/* Section header */}
            <div className="services-list__header reveal">
              <div>
                <h2 className="services-list__title">
                  {tab === "tir" ? "Вантажні автомобілі і ТІР" : "Легкові автомобілі"}
                </h2>
                <p className="services-list__subtitle">
                  {tab === "tir"
                    ? "Повний перелік послуг для вантажного транспорту та причіпної техніки"
                    : "Повний перелік послуг для легкового транспорту"}
                </p>
              </div>
              <Link href="/booking" className="btn btn-sm btn-outline">
                Записатись
              </Link>
            </div>

            {/* Service rows */}
            <ul className="services-list" role="list">
              {list.map((s, i) => (
                <li
                  key={s.slug}
                  className={`reveal reveal-delay-${Math.min(i % 6 + 1, 6)}`}
                  style={{ listStyle: "none" }}
                >
                  <Link href={`/services/${s.slug}`} className="service-row-v2">
                    <span className="service-row-v2__index" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <CheckCircle2
                      size={14}
                      className="service-row-v2__check"
                      aria-hidden
                    />
                    <span className="service-row-v2__title">{s.title}</span>
                    {s.price && (
                      <span className="service-row-v2__price">{s.price}</span>
                    )}
                    <ArrowRight size={13} className="service-row-v2__arrow" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Parts banner */}
            <Link href="/parts-order" className="parts-banner reveal">
              <div className="parts-banner__icon" aria-hidden>
                <Package size={18} />
              </div>
              <div className="parts-banner__body">
                <p className="parts-banner__title">Замовлення запчастин через нашу фірму</p>
                <p className="parts-banner__sub">Підберемо оригінал або перевірений аналог, організуємо доставку</p>
              </div>
              <ArrowRight size={16} className="parts-banner__arrow" aria-hidden />
            </Link>

            {/* CTA */}
            <div className="services-cta reveal">
              <p className="services-cta__eyebrow">Не знаєте, яка послуга потрібна?</p>
              <h2 className="services-cta__title">Майстер підкаже і запише</h2>
              <p className="services-cta__text">
                Зв&apos;яжіться з нами — опишемо проблему та запишемо на зручний час.
              </p>
              <Link href="/contacts" className="btn btn-primary">
                Зв&apos;язатись з нами
              </Link>
            </div>

          </div>
        </section>
      </div>

      {/* ════ SCOPED STYLES ═══════════════════════════════════════════════ */}
      <style>{`
        .services-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* ── HERO ──────────────────────────────────────────── */
        .services-hero {
          position: relative;
          overflow: hidden;
          padding: clamp(var(--space-8), 6vw, var(--space-16)) var(--space-4) clamp(var(--space-6), 4vw, var(--space-10));
          border-bottom: 1px solid var(--border);
        }
        .services-hero__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 40%;
          opacity: 0.09;
          z-index: 0;
          transition: opacity var(--transition-base);
        }
        /* FIX: overlay z-index:1 — sits above bg, below content */
        .services-hero__overlay {
          position: absolute;
          inset: 0;
          background: var(--hero-overlay);
          z-index: 1;
        }
        /* FIX: content z-index:2 — always above overlay */
        .services-hero__content {
          position: relative;
          z-index: 2;
          text-align: center;
        }
        .services-hero__title {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          font-weight: 900;
          line-height: 1.1;
          color: var(--hero-text);
          margin-bottom: var(--space-3);
          letter-spacing: -0.01em;
        }
        .services-hero__sub {
          font-size: var(--text-sm);
          color: var(--hero-text-sub);
          max-width: 48ch;
          margin: 0 auto var(--space-6);
          line-height: 1.65;
        }
        /* Stat strip */
        .services-hero__stats {
          display: inline-flex;
          align-items: center;
          gap: 0;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-pill);
          background: var(--surface);
          overflow: hidden;
        }
        .services-hero__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-2) var(--space-5);
          gap: 2px;
          border-right: 1px solid var(--border);
        }
        .services-hero__stat:last-child { border-right: none; }
        .services-hero__stat-value {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }
        .services-hero__stat-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-faint);
          white-space: nowrap;
        }

        /* ── TABS BAR ──────────────────────────────────────── */
        .services-tabs-bar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 60px;
          z-index: 30;
        }
        .services-tabs-bar__inner {
          display: flex;
          gap: 0;
        }
        .services-tab {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          font-family: var(--font-display);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-muted);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition:
            color var(--transition-fast),
            border-color var(--transition-fast),
            background var(--transition-fast);
          border-radius: 0;
          white-space: nowrap;
        }
        .services-tab:hover {
          color: var(--text);
          background: var(--surface2);
        }
        .services-tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .services-tab__count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 18px;
          padding: 0 5px;
          border-radius: var(--radius-pill);
          background: var(--surface2);
          border: 1px solid var(--border);
          font-size: 10px;
          font-weight: 700;
          color: var(--text-faint);
          line-height: 1;
        }
        .services-tab.active .services-tab__count {
          background: var(--primary-subtle);
          border-color: transparent;
          color: var(--primary);
        }

        /* ── LIST SECTION ──────────────────────────────────────── */
        .services-list-section {
          padding: clamp(var(--space-6), 4vw, var(--space-10)) 0 var(--space-12);
        }
        .services-list__header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-4);
          margin-bottom: var(--space-5);
          flex-wrap: wrap;
        }
        .services-list__title {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 800;
          color: var(--text);
          line-height: 1.15;
          margin-bottom: var(--space-1);
        }
        .services-list__subtitle {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }
        .services-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          margin-bottom: var(--space-5);
          padding: 0;
        }

        /* ── SERVICE ROW v2 ─────────────────────────────────────── */
        .service-row-v2 {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: var(--space-3) var(--space-4);
          text-decoration: none;
          color: var(--text);
          transition:
            background var(--transition-fast),
            border-color var(--transition-fast),
            box-shadow var(--transition-fast),
            transform var(--transition-spring);
        }
        .service-row-v2:hover {
          background: var(--surface2);
          border-color: var(--border-accent);
          box-shadow: var(--shadow-sm);
          transform: translateX(3px);
        }
        .service-row-v2__index {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
          color: var(--text-faint);
          min-width: 20px;
          letter-spacing: 0.05em;
        }
        .service-row-v2__check {
          color: var(--accent);
          flex-shrink: 0;
          transition: color var(--transition-fast);
        }
        .service-row-v2:hover .service-row-v2__check {
          color: var(--primary);
        }
        .service-row-v2__title {
          flex: 1;
          font-size: var(--text-sm);
          color: var(--text);
          font-weight: 500;
          line-height: 1.4;
        }
        .service-row-v2__price {
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--accent);
          white-space: nowrap;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          background: rgba(15,118,110,0.08);
          border: 1px solid rgba(15,118,110,0.18);
        }
        .service-row-v2__arrow {
          color: var(--text-faint);
          flex-shrink: 0;
          transition:
            transform var(--transition-spring),
            color var(--transition-fast);
        }
        .service-row-v2:hover .service-row-v2__arrow {
          transform: translateX(4px);
          color: var(--primary);
        }

        /* ── PARTS BANNER ────────────────────────────────────────── */
        .parts-banner {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-4) var(--space-4);
          text-decoration: none;
          margin-bottom: var(--space-5);
          transition:
            background var(--transition-fast),
            border-color var(--transition-fast),
            box-shadow var(--transition-fast);
        }
        .parts-banner:hover {
          background: var(--surface2);
          border-color: var(--border-accent);
          box-shadow: var(--shadow-sm);
        }
        .parts-banner__icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius);
          background: var(--primary-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
          transition: background var(--transition-fast);
        }
        .parts-banner:hover .parts-banner__icon {
          background: rgba(15,118,110,0.18);
        }
        .parts-banner__body { flex: 1; min-width: 0; }
        .parts-banner__title {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text);
          margin-bottom: 2px;
        }
        .parts-banner__sub {
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: 1.5;
        }
        .parts-banner__arrow {
          color: var(--text-faint);
          flex-shrink: 0;
          transition: transform var(--transition-spring), color var(--transition-fast);
        }
        .parts-banner:hover .parts-banner__arrow {
          transform: translateX(4px);
          color: var(--primary);
        }

        /* ── CTA BLOCK ───────────────────────────────────────────── */
        .services-cta {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: clamp(var(--space-6), 4vw, var(--space-10)) var(--space-6);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
        }
        .services-cta__eyebrow {
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-faint);
        }
        .services-cta__title {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 800;
          color: var(--text);
          line-height: 1.2;
        }
        .services-cta__text {
          font-size: var(--text-sm);
          color: var(--text-muted);
          max-width: 34ch;
          line-height: 1.6;
        }

        /* ── RESPONSIVE ────────────────────────────────────────────── */
        @media (max-width: 640px) {
          .services-hero__stats { flex-wrap: wrap; border-radius: var(--radius); }
          .services-hero__stat { border-right: none; border-bottom: 1px solid var(--border); width: 50%; }
          .services-hero__stat:nth-child(2n) { border-right: 1px solid var(--border); }
          .services-hero__stat:last-child { border-bottom: none; width: 100%; }
          .service-row-v2__index { display: none; }
          .service-row-v2__price { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .service-row-v2:hover { transform: none; }
          .parts-banner__arrow, .service-row-v2__arrow { transition: color var(--transition-fast); }
        }
      `}</style>
    </>
  );
}
