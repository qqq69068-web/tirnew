"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { services } from "@/lib/services";
import { Phone, ArrowRight, ChevronRight, ClipboardList, Wrench, CheckCircle, Headphones } from "lucide-react";

const categories = Array.from(new Set(services.map((s) => s.category)));

const stats = [
  { value: 20,      suffix: "+", label: "Років досвіду" },
  { value: services.length, suffix: "+", label: "Видів послуг" },
  { value: 5000,    suffix: "+", label: "Ремонтів" },
  { value: 24,      suffix: "/7", label: "Підтримка" },
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
          <div className="hp-hero__radial" />
        </div>

        <div className="container hp-hero__content">
          <div className="fade-in hp-hero__eyebrow">
            <span className="hp-hero__dot" aria-hidden />
            <span className="hp-hero__eyebrow-text">TIR Truck Service</span>
            <span className="hp-hero__eyebrow-line" aria-hidden />
          </div>

          <h1 className="fade-in hp-hero__title anim-d1">
            Сервіс
            <span className="hp-hero__title-accent"> вантажних і легкових</span>
            <br />автомобілів та причепів
          </h1>

          <p className="fade-in hp-hero__sub anim-d2">
            Діагностика, ремонт, пневмосистеми, електрика й трансмісія для
            вантажного та легкового транспорту. Власний склад запчастин.
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
                {i > 0 && <div className="hp-stats__divider" aria-hidden />}
                <StatItem value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </div>

        <div className="hp-hero__scroll" aria-hidden>
          <div className="hp-hero__scroll-track">
            <div className="hp-hero__scroll-thumb" />
          </div>
          <span className="hp-hero__scroll-label">Scroll</span>
        </div>

        <div className="hp-hero__bottom-fade" aria-hidden />
      </section>

      {/* ╔═══ ADVANTAGES ═════════════════════════════════════════╗ */}
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
                <div className="hp-adv__accent" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔═══ SERVICES PREVIEW ═══════════════════════════╗ */}
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
                {s.image && (
                  <div className="hp-svc-card__img">
                    <img src={s.image} alt={s.title} width={480} height={180} loading="lazy" />
                    <div className="hp-svc-card__img-overlay" aria-hidden />
                  </div>
                )}
                <div className="hp-svc-card__line" aria-hidden />
                <div className="hp-svc-card__body">
                  <p className="hp-svc-card__title">{s.title}</p>
                  <p className="hp-svc-card__desc">{s.short}</p>
                </div>
                <div className="hp-svc-card__footer">
                  <span className="hp-svc-card__price">{s.price}</span>
                  <span className="hp-svc-card__arrow" aria-hidden><ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ╔═══ PROCESS ═════════════════════════════════════════╗ */}
      <section className="section hp-process-section">
        <div className="container">
          <div className="reveal hp-section-head">
            <div>
              <p className="section-eyebrow">Як це працює</p>
              <h2 className="hp-section-title">Процес роботи</h2>
            </div>
          </div>
          <div className="hp-process">
            {processSteps.map((step, i) => (
              <div key={step.num} className={`hp-process__step reveal d-${i + 1}`}>
                <div className="hp-process__num-row">
                  <span className="hp-process__num">{step.num}</span>
                  {i < processSteps.length - 1 && (
                    <div className="hp-process__connector" aria-hidden>
                      <div className="hp-process__connector-line" />
                      <div className="hp-process__connector-dot" />
                    </div>
                  )}
                </div>
                <div className="hp-process__icon" aria-hidden>
                  <step.icon size={18} strokeWidth={1.75} />
                </div>
                <h3 className="hp-process__title">{step.title}</h3>
                <p className="hp-process__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔═══ CATEGORIES — inline tags, no box ══════════════════╗ */}
      <section className="section-sm">
        <div className="container">
          <div className="reveal hp-cats">
            <p className="hp-cats__label">Напрямки робіт:</p>
            <div className="hp-cats__list">
              {categories.map((c, i) => (
                <span key={c} className={`hp-cat reveal d-${(i % 4) + 1}`}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ╔═══ CTA BANNER — crimson brand panel ═════════════════════╗ */}
      <section className="hp-cta-section">
        <div className="container">
          <div className="reveal hp-cta">
            {/* Engineering grid overlay */}
            <div className="hp-cta__grid" aria-hidden />
            {/* Subtle right-side glow */}
            <div className="hp-cta__glow" aria-hidden />

            <div className="hp-cta__content">
              <p className="hp-cta__eyebrow">Запис на ремонт</p>
              <h2 className="hp-cta__title">Готові записатись?</h2>
              <p className="hp-cta__sub">
                Запишіться онлайн або зателефонуйте. Працюємо з вантажними автомобілями,
                причепами, напівпричепами та легковими авто.
              </p>
            </div>

            <div className="hp-cta__actions">
              <Link href="/booking" className="btn btn-white btn-lg">
                Записатись онлайн
              </Link>
              <a href="tel:+380664188826" className="btn btn-outline-white btn-lg">
                <Phone size={15} aria-hidden /> +380 66 418 88 26
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* ═══ HP ROOT ══════════════════════════════════════════════════ */
        .hp-root { background: var(--bg); }

        /* ═══ HERO ═════════════════════════════════════════════════════ */
        .hp-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hp-hero__bg {
          position: absolute; inset: 0;
          z-index: 0;
        }
        .hp-hero__img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center;
          filter: brightness(0.55) contrast(1.05);
        }
        .hp-hero__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            105deg,
            oklch(0.13 0.005 240 / 0.92) 0%,
            oklch(0.13 0.005 240 / 0.7) 55%,
            oklch(0.13 0.005 240 / 0.15) 100%
          );
        }
        .hp-hero__radial {
          position: absolute; inset: 0;
          background: radial-gradient(
            ellipse 60% 80% at 10% 60%,
            oklch(0.45 0.19 25 / 0.18) 0%,
            transparent 70%
          );
        }
        .hp-hero__content {
          position: relative;
          z-index: 1;
          padding-block: 9rem 7rem;
          max-width: 820px;
        }
        .hp-hero__eyebrow {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }
        .hp-hero__dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--primary);
          flex-shrink: 0;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: .6; transform: scale(1.3); }
        }
        .hp-hero__eyebrow-text {
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .hp-hero__eyebrow-line {
          flex: 1;
          max-width: 48px;
          height: 1px;
          background: oklch(from var(--text-muted) l c h / 0.35);
        }
        .hp-hero__title {
          font-family: var(--font-display);
          font-size: clamp(2.6rem, 6.5vw, 5.2rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: var(--space-6);
          text-shadow: 0 2px 24px oklch(0 0 0 / 0.35);
        }
        .hp-hero__title-accent { color: var(--primary); }
        .hp-hero__sub {
          font-size: var(--text-base);
          color: oklch(1 0 0 / 0.72);
          max-width: 52ch;
          margin-bottom: var(--space-10);
          line-height: 1.65;
        }
        .hp-hero__ctas {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
          margin-bottom: var(--space-12);
        }
        /* STATS */
        .hp-stats {
          display: flex;
          align-items: stretch;
          gap: 0;
          flex-wrap: wrap;
          border-top: 1px solid oklch(1 0 0 / 0.12);
          padding-top: var(--space-6);
        }
        .hp-stats__item {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .hp-stats__divider {
          width: 1px;
          height: 2.5rem;
          background: oklch(1 0 0 / 0.15);
          margin-inline: var(--space-6);
        }
        .hp-stats__inner {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .hp-stats__value {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 800;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .hp-stats__label {
          font-size: var(--text-xs);
          color: oklch(1 0 0 / 0.55);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 500;
        }
        /* SCROLL INDICATOR */
        .hp-hero__scroll {
          position: absolute;
          bottom: var(--space-8);
          right: var(--space-8);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          z-index: 1;
        }
        .hp-hero__scroll-track {
          width: 2px;
          height: 48px;
          background: oklch(1 0 0 / 0.18);
          border-radius: 2px;
          overflow: hidden;
        }
        .hp-hero__scroll-thumb {
          width: 100%;
          height: 40%;
          background: var(--primary);
          border-radius: 2px;
          animation: scrollThumb 2s ease-in-out infinite;
        }
        @keyframes scrollThumb {
          0% { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(160%); opacity: 0.4; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .hp-hero__scroll-label {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: oklch(1 0 0 / 0.4);
          font-weight: 600;
          writing-mode: vertical-rl;
        }
        .hp-hero__bottom-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 120px;
          background: linear-gradient(to top, var(--bg) 0%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }

        /* ═══ ADVANTAGES ══════════════════════════════════════════════ */
        .hp-adv {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .hp-adv__item {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-6) var(--space-5);
          background: var(--surface);
          overflow: hidden;
          transition: background 0.2s ease;
        }
        .hp-adv__item:hover { background: var(--surface-2); }
        .hp-adv__tag {
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--primary);
          opacity: 0.8;
        }
        .hp-adv__title {
          font-family: var(--font-display);
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text);
          line-height: 1.3;
          max-width: none;
        }
        .hp-adv__desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.55;
          max-width: none;
        }
        .hp-adv__accent {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 2px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .hp-adv__item:hover .hp-adv__accent { transform: scaleX(1); }
        @media (max-width: 900px) { .hp-adv { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px) { .hp-adv { grid-template-columns: 1fr; } }

        /* ═══ SECTION HEAD ════════════════════════════════════════════ */
        .hp-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-4);
          margin-bottom: var(--space-10);
          flex-wrap: wrap;
        }
        .hp-section-title { font-family: var(--font-display); font-size: var(--text-xl); font-weight: 800; color: var(--text); margin-top: var(--space-1); line-height: 1.15; }
        .hp-section-sub { font-size: var(--text-sm); color: var(--text-muted); margin-top: var(--space-2); }
        .hp-all-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--primary);
          text-decoration: none;
          white-space: nowrap;
          transition: gap 0.2s ease, color 0.2s ease;
          padding-bottom: 2px;
          flex-shrink: 0;
        }
        .hp-all-link:hover { gap: var(--space-2); color: var(--primary-hover); }

        /* ═══ SERVICE CARDS ═══════════════════════════════════════════ */
        .hp-services {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }
        .hp-svc-card {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.25s ease,
                      border-color 0.2s ease;
        }
        .hp-svc-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-strong);
        }
        .hp-svc-card__img { position: relative; aspect-ratio: 16/7; overflow: hidden; }
        .hp-svc-card__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .hp-svc-card:hover .hp-svc-card__img img { transform: scale(1.04); }
        .hp-svc-card__img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, oklch(from var(--bg) l c h / 0.6) 0%, transparent 60%);
        }
        .hp-svc-card__line {
          height: 2px;
          background: linear-gradient(90deg, var(--primary) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .hp-svc-card:hover .hp-svc-card__line { opacity: 1; }
        .hp-svc-card__body {
          flex: 1;
          padding: var(--space-5) var(--space-5) var(--space-3);
        }
        .hp-svc-card__title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; color: var(--text); margin-bottom: var(--space-2); line-height: 1.3; max-width: none; }
        .hp-svc-card__desc { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.55; max-width: none; }
        .hp-svc-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-5) var(--space-4);
          border-top: 1px solid var(--border);
          margin-top: auto;
        }
        .hp-svc-card__price { font-size: var(--text-xs); color: var(--text-muted); font-weight: 500; }
        .hp-svc-card__arrow { color: var(--primary); opacity: 0; transform: translateX(-4px); transition: opacity 0.2s, transform 0.2s; }
        .hp-svc-card:hover .hp-svc-card__arrow { opacity: 1; transform: translateX(0); }
        @media (max-width: 900px) { .hp-services { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .hp-services { grid-template-columns: 1fr; } }

        /* ═══ PROCESS ═════════════════════════════════════════════════ */
        .hp-process-section { background: var(--surface); }
        .hp-process {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-2);
        }
        .hp-process__step {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          padding: var(--space-6);
          border-radius: var(--radius-lg);
          border: 1px solid transparent;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .hp-process__step:hover {
          background: var(--surface-2);
          border-color: var(--border);
        }
        .hp-process__num-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .hp-process__num {
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--primary);
        }
        .hp-process__connector {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        .hp-process__connector-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .hp-process__connector-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--border-strong);
          flex-shrink: 0;
        }
        .hp-process__icon {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md);
          background: oklch(from var(--primary) l c h / 0.1);
          color: var(--primary);
          flex-shrink: 0;
        }
        .hp-process__title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; color: var(--text); line-height: 1.2; }
        .hp-process__desc { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; max-width: none; }
        @media (max-width: 900px) { .hp-process { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px) { .hp-process { grid-template-columns: 1fr; gap: var(--space-1); } }

        /* ═══ CATEGORIES ══════════════════════════════════════════════ */
        .hp-cats {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .hp-cats__label {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          flex-shrink: 0;
          max-width: none;
        }
        .hp-cats__list { display: flex; gap: var(--space-2); flex-wrap: wrap; }
        .hp-cat {
          display: inline-block;
          padding: var(--space-1) var(--space-3);
          font-size: var(--text-xs);
          font-weight: 500;
          color: var(--text-muted);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          transition: color 0.2s, border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .hp-cat:hover {
          color: var(--primary);
          border-color: var(--primary);
          background: oklch(from var(--primary) l c h / 0.06);
        }

        /* ═══ CTA SECTION ═════════════════════════════════════════════ */
        .hp-cta-section {
          padding-block: var(--space-16);
        }
        .hp-cta {
          position: relative;
          background: var(--primary);
          border-radius: var(--radius-xl);
          padding: var(--space-12) var(--space-12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-8);
          overflow: hidden;
        }
        .hp-cta__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(oklch(1 0 0 / 0.06) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0 / 0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }
        .hp-cta__glow {
          position: absolute;
          top: -40%; right: -10%;
          width: 50%; height: 200%;
          background: radial-gradient(ellipse at center, oklch(1 0 0 / 0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hp-cta__content { position: relative; z-index: 1; flex: 1; }
        .hp-cta__eyebrow {
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: oklch(1 0 0 / 0.6);
          margin-bottom: var(--space-3);
        }
        .hp-cta__title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-3);
        }
        .hp-cta__sub {
          font-size: var(--text-sm);
          color: oklch(1 0 0 / 0.7);
          line-height: 1.6;
          max-width: 48ch;
        }
        .hp-cta__actions {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .hp-cta { flex-direction: column; padding: var(--space-8); }
          .hp-cta__actions { width: 100%; }
          .hp-cta__actions .btn { width: 100%; justify-content: center; }
        }

        /* ═══ ANIMATIONS ══════════════════════════════════════════════ */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .anim-d1 { animation-delay: 0.05s; }
        .anim-d2 { animation-delay: 0.15s; }
        .anim-d3 { animation-delay: 0.25s; }
        .anim-d4 { animation-delay: 0.38s; }

        /* ═══ RESPONSIVE HERO ═════════════════════════════════════════ */
        @media (max-width: 640px) {
          .hp-hero__content { padding-block: 7rem 5rem; }
          .hp-hero__scroll { display: none; }
          .hp-stats { gap: var(--space-4); }
          .hp-stats__divider { display: none; }
        }
      `}</style>
    </main>
  );
}
