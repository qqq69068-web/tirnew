"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowRight, Package, Truck, Car, Wrench, Phone, Sparkles } from "lucide-react";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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

  function openAiChat() {
    const btn = document.getElementById("ai-chat-trigger") as HTMLButtonElement | null;
    if (btn) btn.click();
  }

  return (
    <>
      <div ref={ref} className="svc-page">

        {/* ═══ HERO ══════════════════════════════════ */}
        <section className="svc-hero">
          <div className="svc-hero__bg" aria-hidden>
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80"
              alt=""
              width={1600}
              height={900}
              loading="eager"
              decoding="async"
              className="svc-hero__img"
            />
            <div className="svc-hero__overlay" />
          </div>

          <div className="container svc-hero__content fade-in">
            <div className="svc-hero__label">
              <span className="svc-hero__label-line" aria-hidden />
              <Wrench size={10} aria-hidden />
              Каталог послуг
            </div>
            <h1 className="svc-hero__title">Ремонт і обслуговування<br />вантажного транспорту</h1>
            <p className="svc-hero__sub">
              Повний цикл діагностики, ремонту та обслуговування TIR,<br />
              причіпної техніки та легкових автомобілів.
            </p>

            <div className="svc-hero__meta">
              <div className="svc-hero__stat">
                <span className="svc-hero__stat-num">{tirServices.length}+</span>
                <span className="svc-hero__stat-lbl">Послуг TIR</span>
              </div>
              <div className="svc-hero__divider" aria-hidden />
              <div className="svc-hero__stat">
                <span className="svc-hero__stat-num">{carServices.length}+</span>
                <span className="svc-hero__stat-lbl">Послуг легкових</span>
              </div>
              <div className="svc-hero__divider" aria-hidden />
              <div className="svc-hero__stat">
                <span className="svc-hero__stat-num">24/7</span>
                <span className="svc-hero__stat-lbl">AI-асистент</span>
              </div>
            </div>
          </div>

          {/* Extended fade — covers hero bottom AND overlaps into tabs-bar */}
          <div className="svc-hero__fade" aria-hidden />
        </section>

        {/* ═══ TABS ══════════════════════════════════ */}
        <div className="svc-tabs-bar">
          <div className="container svc-tabs-bar__inner">
            {(["tir", "car"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`svc-tab${tab === t ? " active" : ""}`}
                aria-selected={tab === t}
                role="tab"
              >
                {t === "tir"
                  ? <Truck size={13} strokeWidth={2} aria-hidden />
                  : <Car   size={13} strokeWidth={2} aria-hidden />}
                {t === "tir" ? "Вантажні / ТІР" : "Легкові"}
                <span className="svc-tab__count">
                  {t === "tir" ? tirServices.length : carServices.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ═══ LIST ══════════════════════════════════ */}
        <section className="svc-list-section">
          <div className="svc-list-container">

            <div className="svc-list-head reveal">
              <div>
                <p className="hp-label">
                  {tab === "tir" ? "Вантажні автомобілі і ТІР" : "Легкові автомобілі"}
                </p>
                <h2 className="svc-list-h2">
                  {tab === "tir"
                    ? "Повний перелік послуг для вантажного транспорту"
                    : "Повний перелік послуг для легкових авто"}
                </h2>
              </div>
              <span className="svc-list-count">{list.length} послуг</span>
            </div>

            <ul className="svc-list" role="list">
              {list.map((s, i) => (
                <li
                  key={s.slug}
                  className={`reveal reveal-delay-${Math.min(i % 6 + 1, 6)}`}
                  style={{ listStyle: "none" }}
                >
                  <Link href={`/services/${s.slug}`} className="svc-row">
                    <span className="svc-row__idx" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="svc-row__title">{s.title}</span>
                    {s.price && (
                      <span className="svc-row__price">{s.price}</span>
                    )}
                    <span className="svc-row__arr" aria-hidden>
                      <ArrowRight size={13} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Parts banner */}
            <Link href="/parts-order" className="parts-banner reveal">
              <div className="parts-banner__left">
                <Package size={16} className="parts-banner__ico" aria-hidden />
                <div>
                  <p className="parts-banner__title">Замовлення запчастин</p>
                  <p className="parts-banner__sub">Підберемо оригінал або перевірений аналог, організуємо доставку</p>
                </div>
              </div>
              <span className="parts-banner__cta">
                Детальніше <ArrowRight size={12} aria-hidden />
              </span>
            </Link>

            {/* CTA — asymmetric two-column */}
            <div className="svc-cta reveal">
              <div className="svc-cta__left">
                <p className="hp-label">Консультація</p>
                <h2 className="svc-cta__title">Не знаєте,<br />яка послуга потрібна?</h2>
                <p className="svc-cta__text">
                  Зателефонуйте — опишемо проблему і запишемо на зручний час.
                  Або задайте питання AI‑асистенту прямо на сайті.
                </p>
              </div>
              <div className="svc-cta__right">
                <Link href="/contacts" className="btn btn-primary svc-cta__btn">
                  <Phone size={14} aria-hidden />
                  Зв&apos;язатись з майстром
                </Link>
                <button
                  type="button"
                  onClick={openAiChat}
                  className="btn btn-outline svc-cta__btn"
                >
                  <Sparkles size={14} aria-hidden />
                  Запитати AI‑агента
                </button>
              </div>
            </div>

          </div>
        </section>
      </div>

      <style>{`
        .svc-page {
          min-height: 100vh;
          background: var(--bg);
        }

        /* ═══════════════════════════════════════════
           HERO
        ═══════════════════════════════════════════ */
        .svc-hero {
          position: relative;
          /* Tighter height — no extra void at top */
          min-height: 44vh;
          display: flex;
          align-items: flex-end;
          overflow: visible;
          /* Let fade bleed below */
        }
        .svc-hero__bg {
          position: absolute; inset: 0; z-index: 0;
          overflow: hidden;
        }
        .svc-hero__img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 35%;
          filter: brightness(0.32) contrast(1.08) saturate(0.65);
        }
        .svc-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(
              108deg,
              oklch(0.09 0.015 55 / 0.96) 0%,
              oklch(0.09 0.015 55 / 0.60) 50%,
              oklch(0.09 0.015 55 / 0.10) 100%
            ),
            linear-gradient(to top, oklch(0.09 0.015 55 / 0.98) 0%, transparent 50%);
        }
        .svc-hero__content {
          position: relative; z-index: 2;
          /* Reduced top padding — navbar is 60px, 4rem gives natural breathing room */
          padding-block: clamp(3rem, 8vw, 5rem) 3.5rem;
          max-width: 700px;
          text-align: left;
          margin-left: 0;
          margin-right: auto;
        }
        .svc-hero__label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: oklch(1 0 0 / 0.38);
          margin-bottom: var(--space-5);
        }
        .svc-hero__label-line {
          display: inline-block;
          width: 22px; height: 1px;
          background: var(--primary);
          flex-shrink: 0;
        }
        .svc-hero__title {
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 4.5vw, 3.6rem);
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: var(--space-4);
          text-align: left;
        }
        .svc-hero__sub {
          font-size: var(--text-sm);
          color: oklch(1 0 0 / 0.48);
          line-height: 1.75;
          margin-bottom: var(--space-8);
          max-width: 52ch;
          text-align: left;
        }
        .svc-hero__meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0;
          padding-top: var(--space-5);
          border-top: 1px solid oklch(1 0 0 / 0.08);
          justify-content: flex-start;
        }
        .svc-hero__stat { display: flex; flex-direction: column; gap: 3px; }
        .svc-hero__divider {
          width: 1px; height: 2rem;
          background: oklch(1 0 0 / 0.10);
          margin-inline: var(--space-6);
        }
        .svc-hero__stat-num {
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 2vw, 1.7rem);
          font-weight: 900;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.04em;
          font-variant-numeric: tabular-nums;
        }
        .svc-hero__stat-lbl {
          font-size: 0.63rem;
          color: oklch(1 0 0 / 0.38);
          text-transform: uppercase;
          letter-spacing: 0.10em;
          font-weight: 600;
        }

        /*
          FADE — tall enough to cover the full bottom of the photo
          AND bleed past the hero edge so the tabs-bar sits inside
          the faded zone, removing the sharp colour jump entirely.
        */
        .svc-hero__fade {
          position: absolute;
          bottom: -48px;   /* bleed below hero into tabs-bar territory */
          left: 0; right: 0;
          height: 260px;
          background: linear-gradient(
            to top,
            var(--bg) 0%,
            var(--bg) 18%,
            transparent 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        /* ═══════════════════════════════════════════
           TABS — sits above the fade bleed
        ═══════════════════════════════════════════ */
        .svc-tabs-bar {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 58px;
          z-index: 30;
        }
        .svc-tabs-bar__inner { display: flex; gap: 0; }
        .svc-tab {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-muted);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.16s ease, border-color 0.16s ease, background 0.16s ease;
        }
        .svc-tab:hover {
          color: var(--text);
          background: oklch(from var(--text) l c h / 0.03);
        }
        .svc-tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .svc-tab__count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px; height: 18px;
          padding: 0 5px;
          border-radius: var(--radius-full);
          background: var(--surface2, var(--surface-offset, #eee));
          border: 1px solid var(--border);
          font-size: 10px;
          font-weight: 700;
          color: var(--text-faint);
          line-height: 1;
        }
        .svc-tab.active .svc-tab__count {
          background: oklch(from var(--primary) l c h / 0.10);
          border-color: transparent;
          color: var(--primary);
        }

        /* ═══════════════════════════════════════════
           LIST SECTION
        ═══════════════════════════════════════════ */
        .svc-list-section {
          padding-block: clamp(var(--space-8), 4vw, var(--space-12)) var(--space-16);
          background: var(--bg);
        }

        .svc-list-container {
          max-width: 860px;
          margin-inline: auto;
          padding-inline: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .svc-list-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .svc-list-h2 {
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 2.2vw, 1.75rem);
          font-weight: 800;
          color: var(--text);
          line-height: 1.12;
          letter-spacing: -0.02em;
          margin-top: var(--space-1);
        }
        .svc-list-count {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-faint);
          white-space: nowrap;
          letter-spacing: 0.04em;
          flex-shrink: 0;
          padding-bottom: 4px;
        }

        .svc-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          padding: 0;
          margin: 0;
        }

        .svc-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-5);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: var(--text);
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .svc-row:hover {
          background: var(--surface2);
          border-color: oklch(from var(--primary) l c h / 0.28);
          box-shadow: 0 2px 12px oklch(0 0 0 / 0.06);
          transform: translateX(5px);
        }
        .svc-row__idx {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
          color: var(--text-faint);
          min-width: 22px;
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }
        .svc-row__title {
          flex: 1;
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text);
          line-height: 1.4;
        }
        .svc-row__price {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--primary);
          white-space: nowrap;
          flex-shrink: 0;
          opacity: 0.8;
        }
        .svc-row__arr {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px; height: 24px;
          border-radius: 50%;
          color: var(--text-faint);
          flex-shrink: 0;
          transition: color 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .svc-row:hover .svc-row__arr {
          color: var(--primary);
          transform: translateX(3px);
        }

        /* Parts banner */
        .parts-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          padding: var(--space-4) var(--space-5);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: background 0.18s ease, border-color 0.18s ease;
        }
        .parts-banner:hover {
          border-color: oklch(from var(--primary) l c h / 0.28);
          background: var(--surface2);
        }
        .parts-banner__left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          min-width: 0;
        }
        .parts-banner__ico { color: var(--primary); opacity: 0.7; flex-shrink: 0; }
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
        .parts-banner__cta {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--primary);
          white-space: nowrap;
          flex-shrink: 0;
          opacity: 0.8;
          transition: opacity 0.16s ease, gap 0.16s ease;
        }
        .parts-banner:hover .parts-banner__cta { opacity: 1; gap: var(--space-2); }

        /* ═══════════════════════════════════════════
           CTA
        ═══════════════════════════════════════════ */
        .svc-cta {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: clamp(var(--space-6), 4vw, var(--space-12));
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: clamp(var(--space-6), 3vw, var(--space-10)) clamp(var(--space-6), 3vw, var(--space-10));
        }
        .svc-cta__title {
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 2.2vw, 1.9rem);
          font-weight: 800;
          color: var(--text);
          line-height: 1.12;
          letter-spacing: -0.025em;
          margin-block: var(--space-2) var(--space-3);
        }
        .svc-cta__text {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.65;
          max-width: 44ch;
        }
        .svc-cta__right {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          flex-shrink: 0;
        }
        .svc-cta__btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          white-space: nowrap;
        }

        .hp-label {
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: var(--space-2);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .hp-label::before {
          content: '';
          display: inline-block;
          width: 16px; height: 1.5px;
          background: currentColor;
          border-radius: 2px;
          flex-shrink: 0;
        }

        /* ═══════════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════════ */
        @media (max-width: 860px) {
          .svc-cta { grid-template-columns: 1fr; }
          .svc-cta__right { flex-direction: row; flex-wrap: wrap; }
        }
        @media (max-width: 640px) {
          .svc-hero__content { padding-block: 2.5rem 2.5rem; }
          .svc-hero__divider { margin-inline: var(--space-4); }
          .svc-row__idx   { display: none; }
          .svc-row__price { display: none; }
          .svc-row { padding: var(--space-3) var(--space-4); }
          .parts-banner { flex-wrap: wrap; }
          .svc-cta__right { flex-direction: column; }
          .svc-cta__btn { justify-content: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .svc-row:hover { transform: none; }
        }
      `}</style>
    </>
  );
}
