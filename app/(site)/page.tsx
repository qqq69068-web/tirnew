"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { services } from "@/lib/services";
import { ArrowRight, ChevronRight, ClipboardList, Wrench, CheckCircle, Headphones } from "lucide-react";

const stats = [
  { value: 20,               suffix: "+",  label: "Років досвіду" },
  { value: services.length,  suffix: "+",  label: "Видів послуг" },
  { value: 5000,             suffix: "+",  label: "Ремонтів" },
  { value: 24,               suffix: "/7", label: "Підтримка" },
];

const advantages = [
  {
    tag: "01",
    title: "Власний склад запчастин",
    desc: "Великий асортимент оригінальних і аналогових деталей — мінімальний простій техніки.",
  },
  {
    tag: "02",
    title: "Швидка діагностика",
    desc: "AutoCom, VOCOM, WABCO — точно виявляємо несправність за лічені хвилини.",
  },
  {
    tag: "03",
    title: "Оперативний ремонт",
    desc: "Досвідчені майстри та налагоджені процеси — мінімальний час простою.",
  },
  {
    tag: "04",
    title: "Гарантія якості",
    desc: "Гарантуємо якість усіх виконаних робіт і встановлених запчастин.",
  },
];

const processSteps = [
  {
    num: "01",
    icon: Headphones,
    title: "Звернення",
    desc: "Зателефонуйте або залиште заявку онлайн. Майстер передзвонить і запише на зручний час.",
  },
  {
    num: "02",
    icon: ClipboardList,
    title: "Діагностика",
    desc: "Професійне обладнання AutoCom / VOCOM. Подаємо чіткий перелік робіт і вартість.",
  },
  {
    num: "03",
    icon: Wrench,
    title: "Ремонт",
    desc: "Виконуємо роботи з власного складу запчастин. Мінімальний час простою.",
  },
  {
    num: "04",
    icon: CheckCircle,
    title: "Гарантія",
    desc: "Видаємо авто з гарантією на виконані роботи і запчастини. Післяпродажний супровід.",
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
      { threshold: 0.08 }
    );
    el.querySelectorAll(".reveal").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useCounter(target: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = String(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return ref;
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const numRef = useCounter(value, 1400);
  return (
    <div className="hp-stats__inner">
      <span className="hp-stats__value">
        <span ref={numRef}>{value}</span>{suffix}
      </span>
      <span className="hp-stats__label">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const ref = useReveal();

  return (
    <main ref={ref} className="hp-root">

      {/* ╔═══ HERO ═══════════════════════════════════════════════╗ */}
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
        </div>

        <div className="container">
          <div className="hp-hero__content">

            <div className="fade-in hp-hero__label">
              <span className="hp-hero__label-dot" aria-hidden />
              TIR Truck Service · Рівне
            </div>

            <h1 className="fade-in hp-hero__title anim-d1">
              Сервіс вантажних<br />
              <span className="hp-hero__title-em">і легкових</span> авто
            </h1>

            <p className="fade-in hp-hero__sub anim-d2">
              Діагностика, ремонт, пневмосистеми, електрика й трансмісія.
              Власний склад запчастин.
            </p>

            <div className="fade-in hp-hero__ctas anim-d3">
              <Link href="/contacts" className="btn btn-primary btn-lg">
                Зв&apos;язатись <ChevronRight size={16} aria-hidden />
              </Link>
              <Link href="/services" className="btn btn-outline btn-lg">
                Послуги
              </Link>
            </div>

            <div className="fade-in hp-stats anim-d4">
              {stats.map((s, i) => (
                <div key={s.label} className="hp-stats__item">
                  {i > 0 && <div className="hp-stats__sep" aria-hidden />}
                  <StatItem value={s.value} suffix={s.suffix} label={s.label} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hp-hero__bottom-fade" aria-hidden />
      </section>

      {/* ╔═══ ADVANTAGES — asymmetric bento ═════════════════════╗ */}
      <section className="hp-adv-section">
        <div className="container">
          <div className="hp-adv-grid">

            {/* Featured left card */}
            <div className="reveal hp-adv-card hp-adv-card--featured">
              <span className="hp-adv-card__num">01</span>
              <div className="hp-adv-card__body">
                <h3 className="hp-adv-card__title">Власний склад<br />запчастин</h3>
                <p className="hp-adv-card__desc">
                  Великий асортимент оригінальних і аналогових деталей — мінімальний простій техніки.
                </p>
              </div>
              <div className="hp-adv-card__corner" aria-hidden />
            </div>

            {/* Right column — 3 smaller cards */}
            <div className="hp-adv-right">
              {advantages.slice(1).map((a, i) => (
                <div key={a.tag} className={`reveal hp-adv-card hp-adv-card--sm d-${i + 1}`}>
                  <span className="hp-adv-card__num">{a.tag}</span>
                  <div className="hp-adv-card__body">
                    <h3 className="hp-adv-card__title">{a.title}</h3>
                    <p className="hp-adv-card__desc">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ╔═══ SERVICES PREVIEW ═══════════════════════════════════╗ */}
      <section className="section">
        <div className="container">
          <div className="reveal hp-svc-head">
            <div className="hp-svc-head__left">
              <p className="hp-label">Що ми робимо</p>
              <h2 className="hp-h2">Популярні послуги</h2>
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
                className={`reveal hp-svc-card d-${i + 1}`}
              >
                {s.image && (
                  <div className="hp-svc-card__img">
                    <img src={s.image} alt={s.title} width={480} height={180} loading="lazy" />
                    <div className="hp-svc-card__img-fade" aria-hidden />
                  </div>
                )}
                <div className="hp-svc-card__body">
                  <h3 className="hp-svc-card__title">{s.title}</h3>
                  <p className="hp-svc-card__desc">{s.short}</p>
                </div>
                <div className="hp-svc-card__foot">
                  <span className="hp-svc-card__price">{s.price}</span>
                  <span className="hp-svc-card__arr" aria-hidden>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ╔═══ PROCESS — numbered timeline ════════════════════════╗ */}
      <section className="section hp-proc-section">
        <div className="container">
          <div className="reveal hp-proc-head">
            <p className="hp-label">Як це працює</p>
            <h2 className="hp-h2">Процес роботи</h2>
          </div>

          <div className="hp-proc">
            {processSteps.map((step, i) => (
              <div key={step.num} className={`reveal hp-proc__step d-${i + 1}`}>
                <div className="hp-proc__top">
                  <span className="hp-proc__num">{step.num}</span>
                  <div className="hp-proc__icon">
                    <step.icon size={17} strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="hp-proc__title">{step.title}</h3>
                <p className="hp-proc__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ══════════════════════════════════════════════════════
           HP ROOT
        ══════════════════════════════════════════════════════ */
        .hp-root { background: var(--bg); }

        /* ══════════════════════════════════════════════════════
           HERO
        ══════════════════════════════════════════════════════ */
        .hp-hero {
          position: relative;
          min-height: 96vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hp-hero__bg {
          position: absolute; inset: 0; z-index: 0;
        }
        .hp-hero__img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 30%;
          filter: brightness(0.45) contrast(1.08) saturate(0.85);
        }
        .hp-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(105deg,
              oklch(0.10 0.01 60 / 0.97) 0%,
              oklch(0.10 0.01 60 / 0.78) 45%,
              oklch(0.10 0.01 60 / 0.18) 100%
            ),
            linear-gradient(to top,
              oklch(0.10 0.01 60 / 0.95) 0%,
              transparent 55%
            );
        }

        .hp-hero__content {
          position: relative;
          z-index: 1;
          padding-block: 10rem 8rem;
          max-width: 760px;
        }

        .hp-hero__label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: oklch(1 0 0 / 0.45);
          margin-bottom: var(--space-6);
        }
        .hp-hero__label-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--primary);
          flex-shrink: 0;
          box-shadow: 0 0 0 3px oklch(from var(--primary) l c h / 0.25);
          animation: dotPulse 2.4s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 0 3px oklch(from var(--primary) l c h / 0.25); }
          50%       { box-shadow: 0 0 0 7px oklch(from var(--primary) l c h / 0.08); }
        }

        .hp-hero__title {
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 7vw, 5.6rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: var(--space-6);
        }
        .hp-hero__title-em {
          font-style: italic;
          color: var(--primary-light);
          font-weight: 800;
        }
        .hp-hero__sub {
          font-size: var(--text-base);
          color: oklch(1 0 0 / 0.60);
          max-width: 46ch;
          margin-bottom: var(--space-10);
          line-height: 1.7;
        }
        .hp-hero__ctas {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
          margin-bottom: var(--space-14);
        }
        .hp-hero__bottom-fade {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 160px;
          background: linear-gradient(to top, var(--bg) 0%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }

        .hp-stats {
          display: flex;
          align-items: stretch;
          flex-wrap: wrap;
          gap: 0;
          padding-top: var(--space-8);
          border-top: 1px solid oklch(1 0 0 / 0.10);
        }
        .hp-stats__item { display: flex; align-items: center; }
        .hp-stats__sep {
          width: 1px; height: 2.2rem;
          background: oklch(1 0 0 / 0.12);
          margin-inline: var(--space-6);
        }
        .hp-stats__inner { display: flex; flex-direction: column; gap: 3px; }
        .hp-stats__value {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 2.2vw, 1.85rem);
          font-weight: 800;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .hp-stats__label {
          font-size: var(--text-xs);
          color: oklch(1 0 0 / 0.42);
          text-transform: uppercase;
          letter-spacing: 0.09em;
          font-weight: 500;
        }

        /* ══════════════════════════════════════════════════════
           ADVANTAGES — asymmetric bento
        ══════════════════════════════════════════════════════ */
        .hp-adv-section {
          padding-block: clamp(var(--space-10), 5vw, var(--space-20));
          background: var(--bg);
          border-top: 1px solid var(--border);
        }
        .hp-adv-grid {
          display: grid;
          grid-template-columns: 1fr 1.8fr;
          gap: var(--space-3);
        }
        @media (max-width: 860px) {
          .hp-adv-grid { grid-template-columns: 1fr; }
        }

        .hp-adv-right {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
        }
        @media (max-width: 640px) {
          .hp-adv-right { grid-template-columns: 1fr; }
        }

        .hp-adv-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          overflow: hidden;
          transition:
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }
        .hp-adv-card:hover {
          border-color: var(--border-accent);
          box-shadow: var(--shadow-md);
        }

        .hp-adv-card--featured {
          padding: var(--space-8);
          min-height: 260px;
        }
        .hp-adv-card__corner {
          position: absolute;
          bottom: -20px; right: -20px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: oklch(from var(--primary) l c h / 0.07);
          border: 1px solid oklch(from var(--primary) l c h / 0.12);
          pointer-events: none;
          transition: transform 0.4s ease;
        }
        .hp-adv-card--featured:hover .hp-adv-card__corner {
          transform: scale(1.3);
        }

        .hp-adv-card__num {
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--primary);
          opacity: 0.75;
          margin-bottom: var(--space-8);
          display: block;
        }
        .hp-adv-card--sm .hp-adv-card__num {
          margin-bottom: var(--space-5);
        }
        .hp-adv-card__body { display: flex; flex-direction: column; gap: var(--space-2); }
        .hp-adv-card__title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text);
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .hp-adv-card--sm .hp-adv-card__title {
          font-size: var(--text-base);
        }
        .hp-adv-card__desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.6;
          max-width: none;
        }

        /* ══════════════════════════════════════════════════════
           SHARED TYPOGRAPHY
        ══════════════════════════════════════════════════════ */
        .hp-label {
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin-bottom: var(--space-2);
        }
        .hp-h2 {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 800;
          color: var(--text);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        /* ══════════════════════════════════════════════════════
           SERVICES
        ══════════════════════════════════════════════════════ */
        .hp-svc-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-4);
          margin-bottom: var(--space-8);
          flex-wrap: wrap;
        }
        .hp-svc-head__left { display: flex; flex-direction: column; gap: 4px; }

        .hp-all-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-muted);
          text-decoration: none;
          white-space: nowrap;
          padding-bottom: 2px;
          border-bottom: 1px solid var(--border);
          transition: color 0.18s ease, border-color 0.18s ease, gap 0.18s ease;
          flex-shrink: 0;
        }
        .hp-all-link:hover {
          color: var(--primary);
          border-color: var(--border-accent);
          gap: var(--space-2);
        }

        .hp-services {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }
        @media (max-width: 900px) { .hp-services { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .hp-services { grid-template-columns: 1fr; } }

        .hp-svc-card {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          text-decoration: none;
          transition:
            transform 0.26s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.26s ease,
            border-color 0.2s ease;
        }
        .hp-svc-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-strong);
        }

        .hp-svc-card__img {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: var(--surface2);
        }
        .hp-svc-card__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: saturate(0.85);
          transition: transform 0.5s ease, filter 0.3s ease;
        }
        .hp-svc-card:hover .hp-svc-card__img img {
          transform: scale(1.05);
          filter: saturate(1);
        }
        .hp-svc-card__img-fade {
          position: absolute; inset: 0;
          background: linear-gradient(to top,
            oklch(from var(--bg) l c h / 0.55) 0%,
            transparent 65%
          );
        }

        .hp-svc-card::before {
          content: '';
          display: block;
          height: 2px;
          background: linear-gradient(90deg, var(--primary) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.25s ease;
          flex-shrink: 0;
        }
        .hp-svc-card:hover::before { opacity: 1; }

        .hp-svc-card__body {
          flex: 1;
          padding: var(--space-5);
        }
        .hp-svc-card__title {
          font-family: var(--font-display);
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--space-2);
          line-height: 1.25;
          max-width: none;
        }
        .hp-svc-card__desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.6;
          max-width: none;
        }
        .hp-svc-card__foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-5) var(--space-4);
          border-top: 1px solid var(--border);
          margin-top: auto;
        }
        .hp-svc-card__price {
          font-size: var(--text-xs);
          color: var(--text-faint);
          font-weight: 500;
          font-variant-numeric: tabular-nums;
        }
        .hp-svc-card__arr {
          color: var(--primary);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          display: flex;
        }
        .hp-svc-card:hover .hp-svc-card__arr {
          opacity: 1;
          transform: translateX(0);
        }

        /* ══════════════════════════════════════════════════════
           PROCESS — numbered timeline
        ══════════════════════════════════════════════════════ */
        .hp-proc-section {
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .hp-proc-head {
          margin-bottom: clamp(var(--space-8), 4vw, var(--space-12));
        }
        .hp-proc {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
        }
        @media (max-width: 860px) {
          .hp-proc { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .hp-proc { grid-template-columns: 1fr; }
        }

        .hp-proc__step {
          position: relative;
          padding: var(--space-6) var(--space-8) var(--space-6) 0;
          border-right: 1px solid var(--border);
        }
        .hp-proc__step:last-child { border-right: none; }

        .hp-proc__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-5);
        }
        .hp-proc__num {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3vw, 2.6rem);
          font-weight: 900;
          color: var(--border-strong);
          line-height: 1;
          letter-spacing: -0.04em;
          transition: color 0.22s ease;
        }
        .hp-proc__step:hover .hp-proc__num { color: var(--primary); }

        .hp-proc__icon {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          color: var(--text-muted);
          background: var(--surface2);
          flex-shrink: 0;
          transition: border-color 0.22s ease, color 0.22s ease, background 0.22s ease;
        }
        .hp-proc__step:hover .hp-proc__icon {
          border-color: var(--border-accent);
          color: var(--primary);
          background: var(--primary-subtle);
        }
        .hp-proc__title {
          font-family: var(--font-display);
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--space-2);
          line-height: 1.2;
        }
        .hp-proc__desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.65;
          max-width: none;
        }

        /* ══════════════════════════════════════════════════════
           ANIMATIONS
        ══════════════════════════════════════════════════════ */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeInUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .anim-d1 { animation-delay: 0.06s; }
        .anim-d2 { animation-delay: 0.16s; }
        .anim-d3 { animation-delay: 0.28s; }
        .anim-d4 { animation-delay: 0.42s; }

        /* ══════════════════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════════════════ */
        @media (max-width: 640px) {
          .hp-hero__content { padding-block: 7rem 5rem; }
          .hp-stats { gap: var(--space-4); }
          .hp-stats__sep { display: none; }
          .hp-hero__ctas { gap: var(--space-2); }
          .hp-proc__step {
            border-right: none;
            border-bottom: 1px solid var(--border);
            padding-right: 0;
            padding-bottom: var(--space-6);
          }
          .hp-proc__step:last-child { border-bottom: none; }
        }
      `}</style>
    </main>
  );
}
