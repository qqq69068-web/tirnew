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

      {/* ╔═══ HERO ══════════════════════════════════════════════╗ */}
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
          <div className="hp-hero__scanline" aria-hidden />
        </div>

        <div className="container hp-hero__content">
          <div className="fade-in hp-hero__eyebrow">
            <span className="hp-hero__dot" aria-hidden />
            <span className="hp-hero__eyebrow-text">TIR Truck Service</span>
            <span className="hp-hero__eyebrow-line" aria-hidden />
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

      {/* ╔═══ ADVANTAGES ═══════════════════════════════════════╗ */}
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

      {/* ╔═══ SERVICES PREVIEW ═══════════════════════════════╗ */}
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

      {/* ╔═══ CATEGORIES — inline tags, no box ════════════════╗ */}
      <section className="section-sm">
        <div className="container">
          <div className="reveal hp-cats">
            <p className="hp-cats__label">Категорії послуг</p>
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

      {/* ╔═══ CTA BANNER — crimson brand panel ════════════════╗ */}
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
                Подзвоніть або залиште заявку — майстер зателефонує й підбере зручний час.
              </p>
            </div>

            <div className="hp-cta__actions">
              <a href="tel:+380664188826" className="hp-cta__btn-outline">
                <Phone size={15} aria-hidden /> Зателефонувати
              </a>
              <Link href="/contacts" className="hp-cta__btn-solid">
                Залишити заявку
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ╔═══ PAGE STYLES ════════════════════════════════════════╗ */}
      <style>{`
        .hp-root {
          background: var(--bg);
          color: var(--text);
        }

        /* ── HERO ───────────────────────────────────────── */
        .hp-hero {
          position: relative;
          overflow: hidden;
          min-height: clamp(580px, 80vh, 860px);
          display: flex;
          flex-direction: column;
        }
        .hp-hero__bg { position: absolute; inset: 0; }
        .hp-hero__img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.38) saturate(0.5);
          animation: kenBurns 22s ease-in-out infinite alternate;
          transform-origin: center center;
        }
        @keyframes kenBurns {
          0%   { transform: scale(1.0) translateX(0px); }
          100% { transform: scale(1.08) translateX(-12px); }
        }
        .hp-hero__overlay { position: absolute; inset: 0; background: var(--hero-overlay); }
        .hp-hero__radial {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 50% 60% at 5% 70%, rgba(185,28,28,0.22) 0%, transparent 65%);
        }
        .hp-hero__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 100% 100% at 50% 100%, transparent 0%, black 55%);
          pointer-events: none;
        }
        .hp-hero__scanline {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(185,28,28,0.5) 30%, rgba(185,28,28,0.8) 50%, rgba(185,28,28,0.5) 70%, transparent 100%);
          animation: scanDown 8s ease-in-out infinite;
          pointer-events: none; z-index: 1;
        }
        @keyframes scanDown {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.4; }
          100% { top: 100%; opacity: 0; }
        }
        .hp-hero__bottom-fade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
          background: linear-gradient(to bottom, transparent, var(--bg));
          pointer-events: none; z-index: 2;
        }
        .hp-hero__content {
          position: relative; z-index: 3;
          padding-top: clamp(80px, 12vw, 130px);
          padding-bottom: clamp(80px, 12vw, 140px);
        }
        .hp-hero__eyebrow { display: inline-flex; align-items: center; gap: var(--space-2); }
        .hp-hero__dot {
          display: inline-block; width: 6px; height: 6px; border-radius: 50%;
          background: var(--primary); flex-shrink: 0;
          box-shadow: 0 0 8px rgba(185,28,28,0.6);
        }
        .hp-hero__eyebrow-text {
          font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.6);
        }
        .hp-hero__eyebrow-line {
          display: inline-block; width: 32px; height: 1px;
          background: rgba(255,255,255,0.25); flex-shrink: 0;
        }
        .hp-hero__title {
          font-family: var(--font-display); font-size: var(--text-hero);
          font-weight: 800; line-height: 1.0; letter-spacing: -0.03em;
          color: var(--hero-text); margin-top: var(--space-5); max-width: 13ch;
        }
        .hp-hero__title-accent { color: var(--primary); }
        .hp-hero__sub {
          margin-top: var(--space-5); max-width: 46ch;
          font-size: var(--text-base); line-height: 1.65; color: var(--hero-text-sub);
        }
        .hp-hero__ctas { margin-top: var(--space-8); display: flex; flex-wrap: wrap; gap: var(--space-3); }

        /* Vertical scroll indicator */
        .hp-hero__scroll {
          position: absolute; bottom: var(--space-10);
          right: clamp(var(--space-6), 4vw, var(--space-12));
          z-index: 4; display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
        }
        .hp-hero__scroll-track {
          width: 1px; height: 48px; background: rgba(255,255,255,0.15);
          border-radius: 1px; overflow: hidden; position: relative;
        }
        .hp-hero__scroll-thumb {
          position: absolute; top: 0; left: 0; right: 0; height: 40%;
          background: var(--primary); border-radius: 1px;
          animation: scrollThumb 2.2s ease-in-out infinite;
        }
        @keyframes scrollThumb {
          0%   { top: 0%;   opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        .hp-hero__scroll-label {
          font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.30); writing-mode: vertical-rl;
        }

        /* Stats */
        .hp-stats {
          margin-top: clamp(var(--space-10), 5vw, var(--space-16));
          padding-top: var(--space-6);
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex; flex-wrap: wrap; gap: var(--space-2);
          align-items: center; width: fit-content;
        }
        .hp-stats__item { display: flex; align-items: center; gap: var(--space-2); }
        .hp-stats__divider { width: 1px; height: 28px; background: rgba(255,255,255,0.12); margin-right: var(--space-2); }
        .hp-stats__inner { display: flex; flex-direction: column; gap: 2px; }
        .hp-stats__value {
          font-family: var(--font-display); font-size: var(--text-2xl);
          font-weight: 800; color: #fff; line-height: 1; font-variant-numeric: tabular-nums;
        }
        .hp-stats__label { font-size: var(--text-xs); color: rgba(255,255,255,0.45); white-space: nowrap; letter-spacing: 0.05em; }

        /* ── ADVANTAGES ─────────────────────────────────── */
        .hp-adv {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1px; background: var(--border);
          border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden;
        }
        .hp-adv__item {
          display: flex; flex-direction: column; gap: var(--space-3);
          padding: var(--space-6) var(--space-5) var(--space-5);
          background: var(--surface); transition: background var(--transition-base);
          position: relative; overflow: hidden;
        }
        .hp-adv__item::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--primary); transform: scaleX(0); transform-origin: left center;
          transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
        }
        .hp-adv__accent {
          position: absolute; bottom: var(--space-4); right: var(--space-4);
          width: 20px; height: 20px;
          border-right: 1.5px solid var(--border-strong); border-bottom: 1.5px solid var(--border-strong);
          border-radius: 0 0 3px 0; opacity: 0; transform: scale(0.7);
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .hp-adv__item:hover { background: var(--surface2); }
        .hp-adv__item:hover::before { transform: scaleX(1); }
        .hp-adv__item:hover .hp-adv__accent { opacity: 1; transform: scale(1); }
        .hp-adv__tag { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.14em; color: var(--primary); }
        .hp-adv__title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; color: var(--text); line-height: 1.3; max-width: none; }
        .hp-adv__desc { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; max-width: 30ch; }

        /* ── SERVICES ────────────────────────────────────── */
        .hp-section-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: var(--space-6); gap: var(--space-4); flex-wrap: wrap;
        }
        .hp-section-title { font-family: var(--font-display); font-size: var(--text-xl); font-weight: 800; color: var(--text); margin-top: var(--space-1); line-height: 1.15; }
        .hp-section-sub { font-size: var(--text-sm); color: var(--text-muted); margin-top: var(--space-1); max-width: 48ch; }
        .hp-all-link {
          display: inline-flex; align-items: center; gap: var(--space-2);
          font-size: var(--text-sm); font-weight: 600; color: var(--primary);
          text-decoration: none; white-space: nowrap;
          transition: gap var(--transition-base), color var(--transition-fast);
        }
        .hp-all-link:hover { gap: var(--space-3); }
        .hp-services { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-4); }
        .hp-svc-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
          overflow: hidden; display: flex; flex-direction: column;
          text-decoration: none; color: var(--text);
          transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
          will-change: transform;
        }
        .hp-svc-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-card-hover); border-color: var(--border-accent); }
        .hp-svc-card__img { position: relative; height: 165px; overflow: hidden; }
        .hp-svc-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.55s cubic-bezier(0.22,1,0.36,1); }
        .hp-svc-card:hover .hp-svc-card__img img { transform: scale(1.07); }
        .hp-svc-card__img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--surface) 0%, transparent 55%); }
        .hp-svc-card__line { height: 2px; background: var(--primary); transform: scaleX(0); transform-origin: left center; transition: transform 0.36s cubic-bezier(0.22,1,0.36,1); }
        .hp-svc-card:hover .hp-svc-card__line { transform: scaleX(1); }
        .hp-svc-card__body { flex: 1; padding: var(--space-4) var(--space-5) 0; }
        .hp-svc-card__title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; color: var(--text); margin-bottom: var(--space-2); line-height: 1.3; max-width: none; }
        .hp-svc-card__desc { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.55; max-width: 38ch; }
        .hp-svc-card__footer { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4) var(--space-5); margin-top: var(--space-4); border-top: 1px solid var(--border); }
        .hp-svc-card__price { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 700; color: var(--primary); font-variant-numeric: tabular-nums; }
        .hp-svc-card__arrow { color: var(--text-faint); display: flex; align-items: center; transition: transform var(--transition-base), color var(--transition-fast); }
        .hp-svc-card:hover .hp-svc-card__arrow { transform: translateX(4px); color: var(--primary); }

        /* ── PROCESS ──────────────────────────────────────── */
        .hp-process-section { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .hp-process {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border); border-radius: var(--radius-lg);
          overflow: hidden; margin-top: var(--space-6);
        }
        .hp-process__step {
          position: relative; background: var(--surface);
          padding: var(--space-6) var(--space-5);
          display: flex; flex-direction: column; gap: var(--space-3);
          transition: background var(--transition-fast);
        }
        .hp-process__step:hover { background: var(--surface2); }
        .hp-process__num-row { display: flex; align-items: center; gap: var(--space-3); }
        .hp-process__num { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.12em; color: var(--primary); flex-shrink: 0; }
        .hp-process__connector { flex: 1; display: flex; align-items: center; overflow: hidden; }
        .hp-process__connector-line { flex: 1; height: 1px; background: var(--border-strong); position: relative; overflow: hidden; }
        .hp-process__connector-line::after { content: ''; position: absolute; top: 0; left: -100%; right: 0; height: 100%; background: var(--primary); transition: left 0.6s cubic-bezier(0.22,1,0.36,1); }
        .hp-process__step:hover .hp-process__connector-line::after { left: 0; }
        .hp-process__connector-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border-strong); flex-shrink: 0; margin-left: var(--space-1); transition: background var(--transition-fast); }
        .hp-process__step:hover .hp-process__connector-dot { background: var(--primary); }
        .hp-process__icon { width: 40px; height: 40px; border-radius: var(--radius); background: var(--primary-subtle); display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0; transition: background var(--transition-fast), transform var(--transition-spring); }
        .hp-process__step:hover .hp-process__icon { background: rgba(185,28,28,0.12); transform: scale(1.06); }
        .hp-process__title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; color: var(--text); line-height: 1.2; }
        .hp-process__desc { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; max-width: 28ch; }

        /* ── CATEGORIES ─────────────────────────────────── */
        /* FIX: container тепер має явний фон і бордер для видимості на --bg */
        .hp-cats {
          padding: var(--space-5) var(--space-6);
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }
        .hp-cats__label {
          font-size: var(--text-xs); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--text-faint);
          margin-bottom: var(--space-4);
        }
        .hp-cats__list { display: flex; flex-wrap: wrap; gap: var(--space-2); }

        /* FIX: пілюлі — явний фон surface2, сильніший бордер, читабельний колір */
        .hp-cat-tag {
          display: inline-flex; align-items: center;
          padding: 6px 16px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-strong);
          background: var(--bg);
          font-size: var(--text-sm); font-weight: 500;
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

        /* ── CTA BANNER — CRIMSON BRAND PANEL ───────────── */
        .hp-cta-section {
          background: var(--primary);
          margin-top: var(--space-4);
          padding: clamp(var(--space-10), 5vw, var(--space-16)) 0;
          position: relative;
          overflow: hidden;
        }
        .hp-cta-section::before,
        .hp-cta-section::after {
          content: ''; position: absolute; left: 0; right: 0; height: 1px;
          background: rgba(0,0,0,0.25);
        }
        .hp-cta-section::before { top: 0; }
        .hp-cta-section::after  { bottom: 0; }

        .hp-cta {
          position: relative;
          display: flex; flex-wrap: wrap;
          align-items: center; justify-content: space-between;
          gap: var(--space-8);
          color: #fff;
        }
        .hp-cta__grid {
          position: absolute; inset: -40px;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .hp-cta__glow {
          position: absolute; top: -60px; right: -60px;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%);
          pointer-events: none;
        }
        /* FIX: min-width збільшений щоб текст не переносився передчасно */
        .hp-cta__content { position: relative; z-index: 1; flex: 1; min-width: 280px; }
        .hp-cta__eyebrow {
          font-size: var(--text-xs); font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: var(--space-2);
          display: block;
        }
        .hp-cta__title {
          font-family: var(--font-display); font-size: var(--text-xl);
          font-weight: 800; color: #fff; line-height: 1.1;
        }
        /* FIX: max-width збільшений з 44ch → 52ch, nowrap тексту виключено */
        .hp-cta__sub {
          font-size: var(--text-sm); color: rgba(255,255,255,0.75);
          margin-top: var(--space-2); max-width: 52ch; line-height: 1.6;
        }
        .hp-cta__actions {
          position: relative; z-index: 1;
          display: flex; gap: var(--space-3); flex-wrap: wrap; flex-shrink: 0;
          align-items: center;
        }
        .hp-cta__btn-outline {
          display: inline-flex; align-items: center; gap: var(--space-2);
          padding: 0 var(--space-5); height: 44px;
          border-radius: var(--radius);
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.90);
          font-size: var(--text-sm); font-weight: 500;
          text-decoration: none; cursor: pointer; white-space: nowrap;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }
        .hp-cta__btn-outline:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.55); color: #fff; }
        .hp-cta__btn-solid {
          display: inline-flex; align-items: center; gap: var(--space-2);
          padding: 0 var(--space-6); height: 44px;
          border-radius: var(--radius);
          background: #fff;
          color: var(--primary);
          font-size: var(--text-sm); font-weight: 700;
          text-decoration: none; cursor: pointer; white-space: nowrap;
          transition: background var(--transition-fast), box-shadow var(--transition-fast);
        }
        .hp-cta__btn-solid:hover { background: rgba(255,255,255,0.92); box-shadow: 0 4px 16px rgba(0,0,0,0.18); }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 900px) {
          .hp-process { grid-template-columns: repeat(2, 1fr); }
          .hp-process__connector { display: none; }
          .hp-hero__scroll { display: none; }
        }
        @media (max-width: 640px) {
          .hp-hero__ctas { flex-direction: column; }
          .hp-hero__ctas .btn { width: 100%; justify-content: center; }
          .hp-stats { gap: var(--space-4); }
          .hp-stats__value { font-size: var(--text-xl); }
          .hp-section-head { flex-direction: column; align-items: flex-start; }
          .hp-cta { flex-direction: column; }
          .hp-cta__actions { width: 100%; }
          .hp-cta__actions .hp-cta__btn-outline,
          .hp-cta__actions .hp-cta__btn-solid { flex: 1; justify-content: center; }
          .hp-process { grid-template-columns: 1fr; }
          .hp-svc-card__img { height: 120px; }
          .hp-cats { padding: var(--space-4); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hp-hero__img { animation: none; }
          .hp-hero__scanline { animation: none; opacity: 0; }
          .hp-hero__scroll-thumb { animation: none; }
          .hp-svc-card:hover { transform: none; }
          .hp-svc-card__img img { transition: none; }
          .hp-process__icon { transition: none; }
          .hp-cat-tag:hover { transform: none; }
          .hp-adv__item:hover::before { transform: scaleX(1); }
        }
      `}</style>
    </main>
  );
}
