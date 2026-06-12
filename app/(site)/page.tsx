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
  { tag: "01", title: "Власний склад запчастин",  desc: "Великий асортимент оригінальних і аналогових деталей — мінімальний простій техніки." },
  { tag: "02", title: "Швидка діагностика",       desc: "AutoCom, VOCOM, WABCO — точно виявляємо несправність за лічені хвилини." },
  { tag: "03", title: "Оперативний ремонт",       desc: "Досвідчені майстри та налагоджені процеси — мінімальний час простою." },
  { tag: "04", title: "Гарантія якості",          desc: "Гарантуємо якість усіх виконаних робіт і встановлених запчастин." },
];

const processSteps = [
  { num: "01", icon: Headphones,   title: "Звернення",   desc: "Зателефонуйте або залиште заявку онлайн. Майстер передзвонить і запише на зручний час." },
  { num: "02", icon: ClipboardList,title: "Діагностика", desc: "Професійне обладнання AutoCom / VOCOM. Подаємо чіткий перелік робіт і вартість." },
  { num: "03", icon: Wrench,       title: "Ремонт",      desc: "Виконуємо роботи з власного складу запчастин. Мінімальний час простою." },
  { num: "04", icon: CheckCircle,  title: "Гарантія",    desc: "Видаємо авто з гарантією на виконані роботи і запчастини. Після-продажний супровід." },
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

// ─── Flat-illustration semi-truck SVG, facing LEFT ───────────────────────────
// viewBox 960×260  |  ground y=230  |  cab LEFT, trailer RIGHT
// Colour palette: dark graphite body, amber accent, steel details
// ─────────────────────────────────────────────────────────────────────────────
function TruckSVG() {
  /* Wheel helper */
  const Wheel = ({ cx, cy, r = 32 }: { cx: number; cy: number; r?: number }) => {
    const bolts = [0, 60, 120, 180, 240, 300];
    return (
      <g>
        {/* tyre */}
        <circle cx={cx} cy={cy} r={r}     fill="#1a1917" stroke="#2e2c27" strokeWidth="2.5" />
        {/* rim */}
        <circle cx={cx} cy={cy} r={r*.58} fill="#242220" stroke="#3a3835" strokeWidth="2" />
        {/* spokes */}
        {bolts.map(deg => {
          const a = deg * Math.PI / 180;
          return (
            <line
              key={deg}
              x1={cx + r * .22 * Math.cos(a)} y1={cy + r * .22 * Math.sin(a)}
              x2={cx + r * .52 * Math.cos(a)} y2={cy + r * .52 * Math.sin(a)}
              stroke="#3a3835" strokeWidth="3" strokeLinecap="round"
            />
          );
        })}
        {/* hub */}
        <circle cx={cx} cy={cy} r={r*.14} fill="#2e2c27" stroke="#48453f" strokeWidth="1.5" />
      </g>
    );
  };

  return (
    <div className="hp-truck" aria-hidden>
      <svg
        className="hp-truck__svg truck-entrance"
        viewBox="0 0 960 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          {/* amber gradient for cab front */}
          <linearGradient id="cabGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a1815" />
            <stop offset="100%" stopColor="#252220" />
          </linearGradient>
          {/* window glass */}
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3348" />
            <stop offset="100%" stopColor="#0e1e2e" />
          </linearGradient>
          {/* ground shadow */}
          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity=".35" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ════ GROUND SHADOW ════ */}
        <ellipse cx="500" cy="248" rx="460" ry="14" fill="url(#shadowGrad)" />

        {/* ════ TRAILER ════ */}
        {/* Chassis rail */}
        <rect x="240" y="190" width="700" height="14" rx="3" fill="#1a1815" />
        {/* Main box body */}
        <rect x="255" y="68" width="680" height="128" rx="4" fill="#232120" stroke="#302e2a" strokeWidth="1.5" />
        {/* Roof */}
        <rect x="255" y="68" width="680" height="12" rx="4" fill="#2a2826" />
        {/* Vertical ribs */}
        {[330, 415, 500, 585, 670, 755, 840].map(x => (
          <line key={x} x1={x} y1="82" x2={x} y2="196" stroke="#2a2826" strokeWidth="1.5" />
        ))}
        {/* Subtle horizontal mid-line */}
        <line x1="256" y1="132" x2="934" y2="132" stroke="#2a2826" strokeWidth="1" strokeDasharray="6 4" />

        {/* Branding panel */}
        <rect x="290" y="92" width="200" height="58" rx="4" fill="#161412" stroke="#2a2826" strokeWidth="1" />
        <text x="390" y="125" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="18" fontWeight="800" fill="#c8860e" letterSpacing="4">TIRNEW</text>
        <text x="390" y="140" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8"  fontWeight="500" fill="#48453f" letterSpacing="5">TRUCK SERVICE</text>

        {/* Rear doors (right side) */}
        <rect x="928" y="68" width="10" height="128" rx="3" fill="#2a2826" stroke="#302e2a" strokeWidth="1" />
        <rect x="930" y="120" width="5" height="26" rx="2.5" fill="#48453f" />
        {/* Rear light strip */}
        <rect x="934" y="80"  width="5" height="18" rx="2" fill="#c0392b" opacity=".8" />
        <rect x="934" y="164" width="5" height="12" rx="2" fill="#e67e22" opacity=".7" />

        {/* Fifth-wheel plate */}
        <rect x="215" y="196" width="68" height="8" rx="3" fill="#2e2c27" />

        {/* ════ TRAILER WHEELS (tandem × 2) ════ */}
        <Wheel cx={810} cy={228} r={28} />
        <Wheel cx={866} cy={228} r={28} />
        <Wheel cx={680} cy={228} r={28} />
        <Wheel cx={736} cy={228} r={28} />

        {/* ════ CAB / TRACTOR ════ */}
        {/* Sleeper box */}
        <rect x="148" y="86" width="54" height="118" rx="3" fill="#201e1b" stroke="#302e2a" strokeWidth="1.5" />
        <rect x="154" y="96" width="40" height="30" rx="3" fill="url(#glassGrad)" stroke="#1e3045" strokeWidth="1" />
        {/* Cab main body */}
        <rect x="38"  y="86" width="114" height="118" rx="4" fill="url(#cabGrad)" stroke="#302e2a" strokeWidth="1.5" />

        {/* Cab roof — slopes forward (left) */}
        <path d="M38 86 L46 44 L192 40 L202 86 Z" fill="#1c1a17" stroke="#302e2a" strokeWidth="1.5" />
        {/* Roof fairing */}
        <rect x="148" y="84" width="54" height="8" rx="2" fill="#181614" />
        {/* Clearance lights on roof */}
        {[56, 76, 96, 116, 136].map(x => (
          <rect key={x} x={x} y="40" width="13" height="6" rx="2" fill="#c8860e" opacity=".9" />
        ))}

        {/* ── WINDSHIELD ── */}
        <path d="M44 86 L52 46 L188 42 L196 86 Z" fill="url(#glassGrad)" stroke="#1e3045" strokeWidth="1" />
        {/* glare */}
        <path d="M60 50 L100 47 L98 56 L58 59 Z" fill="white" opacity=".045" />
        <path d="M108 46 L150 44 L148 54 L106 56 Z" fill="white" opacity=".03" />

        {/* A-pillars */}
        <line x1="44" y1="86" x2="52" y2="46" stroke="#302e2a" strokeWidth="2.5" />
        <line x1="196" y1="86" x2="188" y2="42" stroke="#302e2a" strokeWidth="2.5" />

        {/* ── DOOR ── */}
        {/* Door panel line */}
        <line x1="100" y1="86" x2="100" y2="204" stroke="#302e2a" strokeWidth="1.5" />
        {/* Door handle */}
        <rect x="82" y="140" width="22" height="5" rx="2.5" fill="#48453f" />
        <rect x="78" y="138" width="6" height="9" rx="3" fill="#3a3835" />
        {/* Grab bar */}
        <rect x="40" y="106" width="5" height="44" rx="2.5" fill="#302e2a" />
        {/* Step */}
        <rect x="38"  y="196" width="70" height="8" rx="3" fill="#2a2826" />
        <rect x="44"  y="202" width="56" height="4" rx="2" fill="#242220" />

        {/* ── FRONT FACE ── */}
        <rect x="10" y="86" width="32" height="118" rx="4" fill="#1a1815" stroke="#302e2a" strokeWidth="1.5" />
        {/* Grille */}
        <rect x="12" y="104" width="22" height="68" rx="3" fill="#141210" stroke="#2a2826" strokeWidth="1" />
        {[112, 122, 132, 142, 152, 162].map(y => (
          <line key={y} x1="13" y1={y} x2="33" y2={y} stroke="#252220" strokeWidth="1.5" />
        ))}
        <line x1="23" y1="105" x2="23" y2="171" stroke="#252220" strokeWidth="1.5" />
        {/* Headlight housing */}
        <rect x="10" y="88" width="24" height="18" rx="3" fill="#10192a" stroke="#1e3045" strokeWidth="1" />
        {/* DRL strip */}
        <rect x="12" y="90" width="20" height="5" rx="2" fill="#c8860e" opacity=".75" />
        {/* Headlight lens */}
        <rect x="12" y="96" width="20" height="8" rx="2" fill="#afc3d8" opacity=".45" />
        {/* Fog light */}
        <circle cx="21" cy="185" r="7"  fill="#10192a" stroke="#1e3045" strokeWidth="1" />
        <circle cx="21" cy="185" r="4.5" fill="#8aa0b8" opacity=".4" />
        {/* Bumper */}
        <rect x="8"  y="196" width="36" height="14" rx="4" fill="#181614" stroke="#2a2826" strokeWidth="1" />
        <rect x="12" y="206" width="28" height="5" rx="2" fill="#242220" />
        {/* Amber side marker */}
        <rect x="10" y="174" width="8" height="14" rx="2" fill="#c8860e" opacity=".65" />

        {/* ── EXHAUST STACKS (twin) behind cab ── */}
        <rect x="193" y="6" width="9" height="60" rx="4.5" fill="#242220" stroke="#302e2a" strokeWidth="1" />
        <rect x="205" y="10" width="7" height="56" rx="3.5" fill="#242220" stroke="#302e2a" strokeWidth="1" />
        <ellipse cx="197.5" cy="6"  rx="4.5" ry="3" fill="#1a1815" />
        <ellipse cx="208.5" cy="10" rx="3.5" ry="2.5" fill="#1a1815" />

        {/* Exhaust puffs — animate after parking */}
        <circle className="puff puff-1" cx="197" cy="6"  r="7" fill="#555" />
        <circle className="puff puff-2" cx="208" cy="10" r="5" fill="#555" />
        <circle className="puff puff-3" cx="202" cy="2"  r="4" fill="#555" />

        {/* ── CAB WHEELS ── */}
        {/* Steer axle (front) */}
        <Wheel cx={62}  cy={228} r={32} />
        {/* Drive tandem */}
        <Wheel cx={520} cy={228} r={32} />
        <Wheel cx={572} cy={228} r={32} />
      </svg>
    </div>
  );
}

export default function HomePage() {
  const ref = useReveal();

  return (
    <main ref={ref} className="hp-root">

      {/* ╔═══ HERO ════════════════════════════════════════════════╗ */}
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
              <span className="hp-hero__label-line" aria-hidden />
              TIR Truck Service · Рівне
            </div>
            <h1 className="fade-in hp-hero__title anim-d1">
              Сервіс вантажних<br />
              і легкових авто
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

        {/* Animated truck illustration */}
        <TruckSVG />

        <div className="hp-hero__bottom-fade" aria-hidden />
      </section>

      {/* ╔═══ ADVANTAGES ═════════════════════════════════════════╗ */}
      <section className="hp-adv-section">
        <div className="container">
          <div className="reveal hp-adv-header">
            <p className="hp-label">Чому обирають нас</p>
            <h2 className="hp-h2">Переваги сервісу</h2>
          </div>
          <div className="hp-adv-grid">
            <div className="reveal hp-adv-card hp-adv-card--featured">
              <span className="hp-adv-card__num">01</span>
              <div className="hp-adv-card__body">
                <h3 className="hp-adv-card__title">Власний склад<br />запчастин</h3>
                <p className="hp-adv-card__desc">
                  Великий асортимент оригінальних і аналогових деталей — мінімальний простій техніки.
                </p>
              </div>
              <div className="hp-adv-card__glyph" aria-hidden>✶</div>
            </div>
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
      </section>

      {/* ╔═══ SERVICES PREVIEW ════════════════════════════════════╗ */}
      <section className="section hp-svc-section">
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
              <Link key={s.slug} href={`/services/${s.slug}`} className={`reveal hp-svc-card d-${i + 1}`}>
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
                  <span className="hp-svc-card__arr" aria-hidden><ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ╔═══ PROCESS ════════════════════════════════════════════╗ */}
      <section className="section hp-proc-section">
        <div className="container">
          <div className="reveal hp-proc-head">
            <p className="hp-label">Як це працює</p>
            <h2 className="hp-h2">Процес роботи</h2>
          </div>
          <div className="hp-proc">
            {processSteps.map((step, i) => (
              <div key={step.num} className={`reveal hp-proc__step d-${i + 1}`}>
                <div className="hp-proc__num-wrap">
                  <span className="hp-proc__num">{step.num}</span>
                  {i < processSteps.length - 1 && <span className="hp-proc__connector" aria-hidden />}
                </div>
                <div className="hp-proc__icon"><step.icon size={18} strokeWidth={1.6} /></div>
                <h3 className="hp-proc__title">{step.title}</h3>
                <p className="hp-proc__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .hp-root { background: var(--bg); }

        /* ══ HERO ══ */
        .hp-hero {
          position: relative; min-height: 96vh;
          display: flex; align-items: center; overflow: hidden;
        }
        .hp-hero__bg { position: absolute; inset: 0; z-index: 0; }
        .hp-hero__img {
          width: 100%; height: 100%; object-fit: cover; object-position: center 30%;
          filter: brightness(0.38) contrast(1.10) saturate(0.75);
        }
        .hp-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(108deg,
              oklch(0.09 0.015 55 / 0.98) 0%,
              oklch(0.09 0.015 55 / 0.72) 42%,
              oklch(0.09 0.015 55 / 0.08) 100%
            ),
            linear-gradient(to top, oklch(0.09 0.015 55 / 0.98) 0%, transparent 52%);
        }
        .hp-hero__content {
          position: relative; z-index: 1;
          padding-block: 11rem 8rem; max-width: 680px;
        }
        .hp-hero__label {
          display: inline-flex; align-items: center; gap: 12px;
          font-size: var(--text-xs); font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: oklch(1 0 0 / 0.38); margin-bottom: var(--space-7);
        }
        .hp-hero__label-line {
          display: inline-block; width: 28px; height: 1px;
          background: var(--primary); flex-shrink: 0;
        }
        .hp-hero__title {
          font-family: var(--font-display);
          font-size: clamp(2.6rem, 6.5vw, 5.2rem);
          font-weight: 900; line-height: 1.02;
          letter-spacing: -0.035em; color: #fff; margin-bottom: var(--space-6);
        }
        .hp-hero__sub {
          font-size: var(--text-base); color: oklch(1 0 0 / 0.55);
          max-width: 44ch; margin-bottom: var(--space-10);
          line-height: 1.75; font-weight: 400;
        }
        .hp-hero__ctas {
          display: flex; gap: var(--space-3); flex-wrap: wrap;
          margin-bottom: clamp(var(--space-12), 5vw, var(--space-16));
        }
        .hp-hero__bottom-fade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 180px;
          background: linear-gradient(to top, var(--bg) 0%, transparent 100%);
          z-index: 1; pointer-events: none;
        }

        /* ══ TRUCK ══ */
        .hp-truck {
          position: absolute; bottom: 38px; right: -4px;
          z-index: 2; pointer-events: none;
          width: clamp(380px, 52vw, 720px);
        }
        .hp-truck__svg { width: 100%; height: auto; display: block; overflow: visible; }

        /* Drive in from right — decelerate — micro-bounce — park */
        @keyframes truckDrive {
          0%   { transform: translateX(112%); }
          50%  { transform: translateX(2.8%); animation-timing-function: cubic-bezier(0.25,0.46,0.45,0.94); }
          68%  { transform: translateX(-1.6%); }
          82%  { transform: translateX(0.7%); }
          91%  { transform: translateX(-0.3%); }
          100% { transform: translateX(0); }
        }
        .truck-entrance {
          animation: truckDrive 2.6s cubic-bezier(0.16,1,0.3,1) 0.25s both;
        }

        /* Exhaust puffs */
        @keyframes puffRise {
          0%   { opacity: 0; transform: translateY(0) scale(0.3); }
          18%  { opacity: 0.55; }
          100% { opacity: 0; transform: translateY(-32px) scale(2.8); }
        }
        .puff-1 { animation: puffRise 1.8s ease-out 2.7s 3; }
        .puff-2 { animation: puffRise 1.8s ease-out 3.0s 3; }
        .puff-3 { animation: puffRise 1.8s ease-out 3.2s 3; }

        /* Wheel spin while driving (subtle) */
        @keyframes wheelSpin { from { transform-origin: center; transform: rotate(0deg); } to { transform: rotate(-360deg); } }

        @media (max-width: 640px) { .hp-truck { display: none; } }

        /* ══ STATS ══ */
        .hp-stats {
          display: flex; align-items: stretch; flex-wrap: wrap; gap: 0;
          padding-top: var(--space-8); border-top: 1px solid oklch(1 0 0 / 0.08);
        }
        .hp-stats__item { display: flex; align-items: center; }
        .hp-stats__sep {
          width: 1px; height: 2rem; background: oklch(1 0 0 / 0.10);
          margin-inline: var(--space-6);
        }
        .hp-stats__inner { display: flex; flex-direction: column; gap: 4px; }
        .hp-stats__value {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.4vw, 2rem);
          font-weight: 900; color: #fff; line-height: 1;
          letter-spacing: -0.04em; font-variant-numeric: tabular-nums;
        }
        .hp-stats__label {
          font-size: 0.65rem; color: oklch(1 0 0 / 0.38);
          text-transform: uppercase; letter-spacing: 0.10em; font-weight: 600;
        }

        /* ══ ADVANTAGES ══ */
        .hp-adv-section {
          padding-block: clamp(var(--space-12), 6vw, var(--space-24));
          background: var(--bg); border-top: 1px solid var(--border);
        }
        .hp-adv-header { margin-bottom: clamp(var(--space-8), 4vw, var(--space-12)); }
        .hp-adv-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto auto; gap: var(--space-3);
        }
        @media (max-width: 860px) { .hp-adv-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .hp-adv-grid { grid-template-columns: 1fr; } }

        .hp-adv-card {
          position: relative; display: flex; flex-direction: column;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-xl); padding: var(--space-7); overflow: hidden;
          transition: border-color .20s ease, box-shadow .20s ease, transform .22s cubic-bezier(.22,1,.36,1);
        }
        .hp-adv-card:hover { border-color: var(--border-accent); box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .hp-adv-card--featured {
          grid-column: 1/2; grid-row: 1/3;
          padding: var(--space-8); background: var(--surface2);
          min-height: 280px; justify-content: space-between;
        }
        .hp-adv-card__glyph {
          font-size: 3.5rem; line-height: 1;
          color: oklch(from var(--primary) l c h / 0.12);
          font-family: serif; user-select: none; pointer-events: none;
          margin-top: auto; align-self: flex-end;
          transition: color .3s ease, transform .4s ease;
        }
        .hp-adv-card--featured:hover .hp-adv-card__glyph { color: oklch(from var(--primary) l c h / 0.22); transform: scale(1.1) rotate(-8deg); }
        .hp-adv-card__num {
          font-family: var(--font-display); font-size: var(--text-xs); font-weight: 700;
          letter-spacing: 0.14em; color: var(--primary); margin-bottom: var(--space-6);
          display: block; opacity: .7;
        }
        .hp-adv-card--sm .hp-adv-card__num { margin-bottom: var(--space-4); }
        .hp-adv-card__body { display: flex; flex-direction: column; gap: var(--space-2); }
        .hp-adv-card__title {
          font-family: var(--font-display); font-size: var(--text-lg); font-weight: 700;
          color: var(--text); line-height: 1.18; letter-spacing: -0.015em;
        }
        .hp-adv-card--sm .hp-adv-card__title { font-size: var(--text-base); font-weight: 700; }
        .hp-adv-card__desc { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.65; max-width: none; }

        /* ══ SHARED TYPOGRAPHY ══ */
        .hp-label {
          font-size: var(--text-xs); font-weight: 700;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: var(--primary); margin-bottom: var(--space-2);
          display: flex; align-items: center; gap: var(--space-2);
        }
        .hp-label::before {
          content: ''; display: inline-block;
          width: 16px; height: 1.5px; background: currentColor;
          border-radius: 2px; flex-shrink: 0;
        }
        .hp-h2 {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 2.8vw, 2.2rem);
          font-weight: 800; color: var(--text);
          line-height: 1.08; letter-spacing: -0.025em;
        }

        /* ══ SERVICES ══ */
        .hp-svc-section { border-top: 1px solid var(--border); }
        .hp-svc-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: var(--space-4); margin-bottom: var(--space-8); flex-wrap: wrap;
        }
        .hp-svc-head__left { display: flex; flex-direction: column; gap: 4px; }
        .hp-all-link {
          display: inline-flex; align-items: center; gap: var(--space-2);
          font-size: var(--text-sm); font-weight: 600;
          color: var(--text-muted); text-decoration: none; white-space: nowrap;
          transition: color .18s ease, gap .18s ease; flex-shrink: 0;
        }
        .hp-all-link:hover { color: var(--primary); gap: var(--space-3); }
        .hp-services { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--space-4); }
        @media (max-width: 900px) { .hp-services { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .hp-services { grid-template-columns: 1fr; } }
        .hp-svc-card {
          display: flex; flex-direction: column;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); overflow: hidden; text-decoration: none;
          transition: transform .26s cubic-bezier(.22,1,.36,1), box-shadow .26s ease, border-color .20s ease;
        }
        .hp-svc-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }
        .hp-svc-card__img { position: relative; aspect-ratio: 16/7; overflow: hidden; background: var(--surface2); }
        .hp-svc-card__img img {
          width: 100%; height: 100%; object-fit: cover;
          filter: saturate(.80) brightness(.95);
          transition: transform .55s ease, filter .35s ease;
        }
        .hp-svc-card:hover .hp-svc-card__img img { transform: scale(1.06); filter: saturate(1) brightness(1); }
        .hp-svc-card__img-fade {
          position: absolute; inset: 0;
          background: linear-gradient(to top, oklch(from var(--surface) l c h / 0.6) 0%, transparent 60%);
        }
        .hp-svc-card__body { flex: 1; padding: var(--space-5) var(--space-5) var(--space-3); }
        .hp-svc-card__title {
          font-family: var(--font-display); font-size: var(--text-base); font-weight: 700;
          color: var(--text); margin-bottom: var(--space-2); line-height: 1.25;
          max-width: none; letter-spacing: -0.01em;
        }
        .hp-svc-card__desc { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; max-width: none; }
        .hp-svc-card__foot {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--space-3) var(--space-5) var(--space-4);
          border-top: 1px solid var(--border); margin-top: auto;
        }
        .hp-svc-card__price { font-size: var(--text-xs); color: var(--text-faint); font-weight: 500; font-variant-numeric: tabular-nums; }
        .hp-svc-card__arr {
          display: flex; align-items: center; justify-content: center;
          width: 26px; height: 26px; border-radius: 50%;
          background: var(--primary-subtle); color: var(--primary);
          opacity: 0; transform: scale(.8);
          transition: opacity .22s ease, transform .22s cubic-bezier(.34,1.56,.64,1);
        }
        .hp-svc-card:hover .hp-svc-card__arr { opacity: 1; transform: scale(1); }

        /* ══ PROCESS ══ */
        .hp-proc-section { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .hp-proc-head { margin-bottom: clamp(var(--space-10), 5vw, var(--space-14)); }
        .hp-proc { display: grid; grid-template-columns: repeat(4,1fr); gap: var(--space-8); }
        @media (max-width: 860px) { .hp-proc { grid-template-columns: repeat(2,1fr); gap: var(--space-8) var(--space-6); } }
        @media (max-width: 480px) { .hp-proc { grid-template-columns: 1fr; gap: var(--space-6); } }
        .hp-proc__step { position: relative; }
        .hp-proc__num-wrap { display: flex; align-items: center; gap: 0; margin-bottom: var(--space-5); }
        .hp-proc__num {
          font-family: var(--font-display); font-size: var(--text-xl); font-weight: 900;
          color: var(--text); line-height: 1; letter-spacing: -0.04em; opacity: .15;
          flex-shrink: 0; transition: opacity .22s ease, color .22s ease;
        }
        .hp-proc__step:hover .hp-proc__num { opacity: 1; color: var(--primary); }
        .hp-proc__connector { flex: 1; height: 1px; background: var(--border); margin-left: var(--space-4); }
        .hp-proc__icon {
          width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md); border: 1px solid var(--border-strong);
          color: var(--text-muted); background: var(--surface2); margin-bottom: var(--space-4);
          transition: border-color .22s ease, color .22s ease, background .22s ease, transform .22s cubic-bezier(.34,1.56,.64,1);
        }
        .hp-proc__step:hover .hp-proc__icon { border-color: var(--border-accent); color: var(--primary); background: var(--primary-subtle); transform: scale(1.08); }
        .hp-proc__title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; color: var(--text); margin-bottom: var(--space-2); line-height: 1.2; letter-spacing: -0.01em; }
        .hp-proc__desc { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.65; max-width: none; }

        /* ══ ANIMATIONS ══ */
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { opacity: 0; animation: fadeInUp .60s cubic-bezier(.22,1,.36,1) forwards; }
        .anim-d1 { animation-delay: .06s; }
        .anim-d2 { animation-delay: .18s; }
        .anim-d3 { animation-delay: .30s; }
        .anim-d4 { animation-delay: .44s; }

        @media (max-width: 640px) {
          .hp-hero__content { padding-block: 7rem 4rem; }
          .hp-stats { gap: var(--space-4); }
          .hp-stats__sep { display: none; }
          .hp-hero__ctas { gap: var(--space-2); }
        }
      `}</style>
    </main>
  );
}
