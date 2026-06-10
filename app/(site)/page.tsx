"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { services } from "@/lib/services";
import { Phone, ArrowRight, ChevronRight } from "lucide-react";

const categories = Array.from(new Set(services.map((s) => s.category)));

const stats = [
  { value: "20+",                label: "Років досвіду" },
  { value: services.length + "+", label: "Видів послуг" },
  { value: "5 000+",             label: "Виконаних ремонтів" },
  { value: "24/7",               label: "Підтримка" },
];

/* Advantages — rendered as engineering-style numbered strip, NOT icon-in-circle */
const advantages = [
  {
    tag:   "01",
    title: "Власний склад запчастин",
    desc:  "Великий асортимент оригінальних і аналогових деталей — мінімальний простій техніки.",
  },
  {
    tag:   "02",
    title: "Швидка діагностика",
    desc:  "AutoCom, VOCOM, WABCO — точно виявляємо несправність за лічені хвилини.",
  },
  {
    tag:   "03",
    title: "Оперативний ремонт",
    desc:  "Досвідчені майстри та налагоджені процеси — мінімальний час простою.",
  },
  {
    tag:   "04",
    title: "Гарантія якості",
    desc:  "Гарантуємо якість усіх виконаних робіт і встановлених запчастин.",
  },
];

const featured = services.slice(0, 3);

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.10 }
    );
    el.querySelectorAll(".reveal").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function HomePage() {
  const ref = useReveal();

  return (
    <main ref={ref} className="hp-root">

      {/* ═══ HERO ══════════════════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=80"
            alt=""
            width={1800}
            height={1200}
            loading="eager"
            decoding="async"
            className="hp-hero__img"
          />
          <div className="hp-hero__overlay" />
          <div className="hp-hero__radial" />
          <div className="hp-hero__grid" aria-hidden />
        </div>

        <div className="container hp-hero__content">
          <div className="fade-in badge badge-primary">
            <span className="hp-hero__dot" aria-hidden />
            TIR Truck Service
          </div>

          <h1 className="fade-in hp-hero__title anim-d1">
            Сервіс
            <span className="hp-hero__title-accent"> вантажних</span>
            <br />автомобілів та причепів
          </h1>

          <p className="fade-in hp-hero__sub anim-d2">
            Діагностика, ремонт, пневмосистеми, електрика й трансмісія для
            комерційного транспорту. Власний склад запчастин.
          </p>

          <div className="fade-in hp-hero__ctas anim-d3">
            <Link href="/contacts" className="btn btn-primary btn-lg">
              Зв&apos;язатись з нами <ChevronRight size={16} aria-hidden />
            </Link>
            <Link href="/services" className="btn btn-outline btn-lg">
              Переглянути послуги
            </Link>
          </div>

          <div className="fade-in hp-stats anim-d4">
            {stats.map((s, i) => (
              <div key={s.label} className="hp-stats__item">
                {i > 0 && <div className="hp-stats__divider" aria-hidden />}
                <div className="hp-stats__inner">
                  <span className="hp-stats__value">{s.value}</span>
                  <span className="hp-stats__label">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hp-hero__bottom-fade" aria-hidden />
      </section>

      {/* ═══ ADVANTAGES STRIP ══════════════════════════════════════ */}
      <section className="section-sm">
        <div className="container">
          <div className="reveal hp-adv">
            {advantages.map((a, i) => (
              <div key={a.tag} className={`hp-adv__item reveal d-${i + 1}`}>
                <span className="hp-adv__tag">{a.tag}</span>
                <div className="hp-adv__body">
                  <p className="hp-adv__title">{a.title}</p>
                  <p className="hp-adv__desc">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES PREVIEW ══════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="reveal hp-section-head">
            <div>
              <p className="section-eyebrow">Що ми робимо</p>
              <h2 className="hp-section-title">Популярні послуги</h2>
              <p className="hp-section-sub">Найчастіші запити від наших клієнтів</p>
            </div>
            <Link href="/services" className="hp-all-link">
              Всі послуги <ArrowRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="hp-services">
            {featured.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={`hp-svc-card reveal d-${i + 1}`}
              >
                <div className="hp-svc-card__line" aria-hidden />
                <div className="hp-svc-card__body">
                  <p className="hp-svc-card__title">{s.title}</p>
                  <p className="hp-svc-card__desc">{s.short}</p>
                </div>
                <div className="hp-svc-card__footer">
                  <span className="hp-svc-card__price">{s.price}</span>
                  <span className="hp-svc-card__arrow" aria-hidden>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ════════════════════════════════════════════ */}
      <section className="section-sm">
        <div className="container">
          <div className="reveal hp-cats">
            <h2 className="hp-cats__title">Категорії послуг</h2>
            <div className="hp-cats__list">
              {categories.map((cat) => (
                <Link key={cat} href="/services" className="hp-cat-tag">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="reveal hp-cta">
            <div className="hp-cta__bg" aria-hidden />
            <div className="hp-cta__content">
              <p className="section-eyebrow">Запис на ремонт</p>
              <h2 className="hp-cta__title">Готові записатись?</h2>
              <p className="hp-cta__sub">
                Подзвоніть або залиште заявку — майстер зателефонує й підбере зручний час.
              </p>
            </div>
            <div className="hp-cta__actions">
              <a href="tel:+380664188826" className="btn btn-outline">
                <Phone size={15} aria-hidden /> Зателефонувати
              </a>
              <Link href="/contacts" className="btn btn-primary">
                Залишити заявку
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PAGE STYLES ═══════════════════════════════════════════ */}
      <style>{`
        .hp-root {
          background: var(--bg);
          color: var(--text);
        }

        /* ── HERO ──────────────────────────────────────────────── */
        .hp-hero {
          position: relative;
          overflow: hidden;
          min-height: clamp(540px, 75vh, 820px);
          display: flex;
          flex-direction: column;
        }
        .hp-hero__bg {
          position: absolute;
          inset: 0;
        }
        .hp-hero__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.42) saturate(0.55);
        }
        .hp-hero__overlay {
          position: absolute;
          inset: 0;
          background: var(--hero-overlay);
        }
        .hp-hero__radial {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 55% 55% at 8% 65%, rgba(185,28,28,0.18) 0%, transparent 68%);
        }
        .hp-hero__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(ellipse 100% 100% at 50% 100%, transparent 0%, black 60%);
          pointer-events: none;
        }
        .hp-hero__bottom-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 80px;
          background: linear-gradient(to bottom, transparent, var(--bg));
          pointer-events: none;
        }
        .hp-hero__content {
          position: relative;
          z-index: 1;
          padding-top: clamp(72px, 10vw, 120px);
          padding-bottom: clamp(80px, 12vw, 140px);
        }
        .hp-hero__dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--primary);
          flex-shrink: 0;
        }
        .hp-hero__title {
          font-family: var(--font-display);
          font-size: var(--text-hero);
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.025em;
          color: var(--hero-text);
          margin-top: var(--space-5);
          max-width: 14ch;
        }
        .hp-hero__title-accent { color: var(--primary); }
        .hp-hero__sub {
          margin-top: var(--space-5);
          max-width: 46ch;
          font-size: var(--text-base);
          line-height: 1.65;
          color: var(--hero-text-sub);
        }
        .hp-hero__ctas {
          margin-top: var(--space-8);
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        /* Stats */
        .hp-stats {
          margin-top: clamp(var(--space-10), 5vw, var(--space-16));
          padding-top: var(--space-6);
          border-top: 1px solid rgba(255,255,255,0.12);
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          align-items: center;
          width: fit-content;
        }
        .hp-stats__item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .hp-stats__divider {
          width: 1px; height: 28px;
          background: rgba(255,255,255,0.15);
          margin-right: var(--space-2);
        }
        .hp-stats__inner {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .hp-stats__value {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .hp-stats__label {
          font-size: var(--text-xs);
          color: rgba(255,255,255,0.50);
          white-space: nowrap;
          letter-spacing: 0.04em;
        }

        /* ── ADVANTAGES ────────────────────────────────────────── */
        .hp-adv {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .hp-adv__item {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-6) var(--space-5);
          background: var(--surface);
          transition: background var(--transition-base);
          position: relative;
        }
        .hp-adv__item::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.32s cubic-bezier(0.22,1,0.36,1);
        }
        .hp-adv__item:hover { background: var(--surface2); }
        .hp-adv__item:hover::after { transform: scaleX(1); }
        .hp-adv__tag {
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--primary);
          font-variant-numeric: tabular-nums;
        }
        .hp-adv__title {
          font-family: var(--font-display);
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text);
          max-width: none;
          line-height: 1.3;
        }
        .hp-adv__desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 30ch;
        }

        /* ── SERVICES ──────────────────────────────────────────── */
        .hp-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: var(--space-6);
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .hp-section-title {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 800;
          color: var(--text);
          margin-top: var(--space-1);
          line-height: 1.15;
        }
        .hp-section-sub {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-top: var(--space-1);
          max-width: 48ch;
        }
        .hp-all-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--primary);
          text-decoration: none;
          white-space: nowrap;
          transition: gap var(--transition-base), color var(--transition-fast);
        }
        .hp-all-link:hover { gap: var(--space-3); }
        .hp-services {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--space-4);
        }
        .hp-svc-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: var(--text);
          transition:
            transform var(--transition-base),
            box-shadow var(--transition-base),
            border-color var(--transition-base);
          will-change: transform;
        }
        .hp-svc-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-card-hover);
          border-color: var(--border-accent);
        }
        .hp-svc-card__line {
          height: 2px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.36s cubic-bezier(0.22,1,0.36,1);
        }
        .hp-svc-card:hover .hp-svc-card__line { transform: scaleX(1); }
        .hp-svc-card__body {
          flex: 1;
          padding: var(--space-5) var(--space-5) 0;
        }
        .hp-svc-card__title {
          font-family: var(--font-display);
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--space-2);
          max-width: none;
          line-height: 1.3;
        }
        .hp-svc-card__desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.55;
          max-width: 38ch;
        }
        .hp-svc-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-5);
          margin-top: var(--space-4);
          border-top: 1px solid var(--border);
        }
        .hp-svc-card__price {
          font-family: var(--font-display);
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--primary);
          font-variant-numeric: tabular-nums;
        }
        .hp-svc-card__arrow {
          color: var(--text-faint);
          display: flex;
          align-items: center;
          transition: transform var(--transition-base), color var(--transition-fast);
        }
        .hp-svc-card:hover .hp-svc-card__arrow {
          transform: translateX(4px);
          color: var(--primary);
        }

        /* ── CATEGORIES ────────────────────────────────────────── */
        .hp-cats {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
        }
        .hp-cats__title {
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-faint);
          margin-bottom: var(--space-4);
        }
        .hp-cats__list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .hp-cat-tag {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
          transition:
            background var(--transition-fast),
            color var(--transition-fast),
            border-color var(--transition-fast),
            transform var(--transition-spring);
        }
        .hp-cat-tag:hover {
          background: var(--primary-subtle);
          border-color: var(--border-accent);
          color: var(--primary);
          transform: translateY(-2px);
        }

        /* ── CTA BANNER ────────────────────────────────────────── */
        .hp-cta {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: clamp(var(--space-8), 4vw, var(--space-12)) clamp(var(--space-6), 4vw, var(--space-10));
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-8);
          overflow: hidden;
        }
        .hp-cta__bg {
          position: absolute;
          top: -60px; right: -60px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(185,28,28,0.10) 0%, transparent 70%);
          pointer-events: none;
        }
        .hp-cta__content {
          position: relative;
          z-index: 1;
          flex: 1;
          min-width: 220px;
        }
        .hp-cta__title {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 800;
          color: var(--text);
          line-height: 1.15;
          margin-top: var(--space-1);
        }
        .hp-cta__sub {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-top: var(--space-2);
          max-width: 44ch;
          line-height: 1.6;
        }
        .hp-cta__actions {
          position: relative;
          z-index: 1;
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
          flex-shrink: 0;
        }

        /* ── RESPONSIVE ────────────────────────────────────────── */
        @media (max-width: 640px) {
          .hp-hero__ctas { flex-direction: column; }
          .hp-hero__ctas .btn { width: 100%; justify-content: center; }
          .hp-stats { gap: var(--space-4); }
          .hp-stats__value { font-size: var(--text-xl); }
          .hp-section-head { flex-direction: column; align-items: flex-start; }
          .hp-cta { flex-direction: column; }
          .hp-cta__actions { width: 100%; }
          .hp-cta__actions .btn { flex: 1; justify-content: center; }
        }
      `}</style>
    </main>
  );
}
