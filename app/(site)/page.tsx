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

function TruckPhoto() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const hero = el.closest(".hp-hero") as HTMLElement | null;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      el.style.transform = `translateX(${progress * 60}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="hp-truck" aria-hidden ref={wrapRef}>
      <div className="hp-truck__road" />
      <div className="hp-truck__shadow" />
      <div className="hp-truck__headlight" />

      <div className="hp-truck__img-mask truck-entrance">
        <img
          className="hp-truck__img"
          src="https://pngimg.com/uploads/truck/truck_PNG16209.png"
          alt=""
          width={1247}
          height={710}
          loading="eager"
          decoding="async"
          style={{ transform: "scaleX(-1)" }}
        />
      </div>

      <div className="hp-truck__exhaust">
        <span className="smoke smoke-1" />
        <span className="smoke smoke-2" />
        <span className="smoke smoke-3" />
        <span className="smoke smoke-4" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const ref = useReveal();

  return (
    <main ref={ref} className="hp-root">

      <section className="hp-hero">
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

        <TruckPhoto />
        <div className="hp-hero__bottom-fade" aria-hidden />
      </section>

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

        .hp-hero {
          position: relative; min-height: 96vh;
          display: flex; align-items: center; overflow: hidden;
          background:
            radial-gradient(ellipse 80% 60% at 72% 55%, oklch(0.14 0.025 200 / 0.55) 0%, transparent 65%),
            radial-gradient(ellipse 60% 80% at 90% 20%, oklch(0.12 0.02 55 / 0.4) 0%, transparent 60%),
            linear-gradient(160deg, oklch(0.10 0.018 55) 0%, oklch(0.08 0.010 200) 100%);
        }

        .hp-hero__content {
          position: relative; z-index: 2;
          padding-block: 11rem 8rem; max-width: 620px;
        }
        .hp-hero__label {
          display: inline-flex; align-items: center; gap: 12px;
          font-size: var(--text-xs); font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: oklch(1 0 0 / 0.36); margin-bottom: var(--space-7);
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
          font-size: var(--text-base); color: oklch(1 0 0 / 0.52);
          max-width: 44ch; margin-bottom: var(--space-10);
          line-height: 1.75; font-weight: 400;
        }
        .hp-hero__ctas {
          display: flex; gap: var(--space-3); flex-wrap: wrap;
          margin-bottom: clamp(var(--space-12), 5vw, var(--space-16));
        }

        /* ══ BOTTOM FADE — тільки під колесами, НЕ на кузові ══ */
        .hp-hero__bottom-fade {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 80px;
          background: linear-gradient(to top, var(--bg) 0%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }

        /* ══ TRUCK — z-index вище за bottom-fade ══ */
        .hp-truck {
          position: absolute;
          bottom: 0; right: -2%;
          z-index: 4;
          pointer-events: none;
          width: clamp(420px, 56vw, 860px);
          will-change: transform;
          transition: transform 0.1s linear;
        }

        .hp-truck__img-mask {
          display: block;
          width: 100%;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            rgba(0,0,0,0.3) 20%,
            black 45%,
            black 80%,
            rgba(0,0,0,0.4) 92%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            rgba(0,0,0,0.3) 20%,
            black 45%,
            black 80%,
            rgba(0,0,0,0.4) 92%,
            transparent 100%
          );
        }

        .hp-truck__img {
          display: block;
          width: 100%;
          height: auto;
          filter:
            drop-shadow(0 24px 48px oklch(0 0 0 / 0.55))
            drop-shadow(0 4px 12px oklch(0 0 0 / 0.40))
            contrast(1.05) saturate(0.92) brightness(0.96);
          position: relative; z-index: 2;
          transform: scaleX(-1);
        }

        @keyframes truckDrive {
          0%   { opacity: 0; transform: translateX(110%); }
          8%   { opacity: 1; }
          58%  { transform: translateX(2.5%); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
          72%  { transform: translateX(-1.2%); }
          84%  { transform: translateX(0.5%); }
          93%  { transform: translateX(-0.2%); }
          100% { transform: translateX(0); }
        }
        .hp-truck__img-mask.truck-entrance {
          animation: truckDrive 2.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        .hp-truck__shadow {
          position: absolute;
          bottom: 4%; left: 5%; right: 5%;
          height: 40px;
          background: radial-gradient(ellipse at center, oklch(0 0 0 / 0.55) 0%, transparent 70%);
          filter: blur(16px);
          z-index: 1;
          animation: shadowAppear 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both;
        }
        @keyframes shadowAppear {
          from { opacity: 0; transform: scaleX(0.4); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        .hp-truck__road {
          position: absolute;
          bottom: 0; left: -5%; right: -5%;
          height: 18px;
          background: linear-gradient(to top, oklch(0.18 0.01 55 / 0.6) 0%, transparent 100%);
          z-index: 0;
          animation: shadowAppear 1s ease 0.3s both;
        }
        .hp-truck__headlight {
          position: absolute;
          bottom: 3%; left: -8%;
          width: 44%; height: 60%;
          background: radial-gradient(
            ellipse 80% 50% at 12% 90%,
            oklch(0.92 0.12 88 / 0.12) 0%,
            oklch(0.92 0.12 88 / 0.05) 40%,
            transparent 70%
          );
          z-index: 1;
          pointer-events: none;
          animation: headlightPulse 3s ease-in-out 3.2s infinite alternate;
        }
        @keyframes headlightPulse {
          from { opacity: 0.7; }
          to   { opacity: 1; }
        }
        .hp-truck__exhaust {
          position: absolute; top: 8%; left: 42%;
          z-index: 3; pointer-events: none;
        }
        .smoke {
          display: block; position: absolute; border-radius: 50%;
          background: radial-gradient(circle, oklch(0.7 0 0 / 0.35) 0%, transparent 70%);
          animation: smokePuff 2.2s ease-out infinite;
        }
        .smoke-1 { width: 28px; height: 28px; left: 0;   top: 0;   animation-delay: 3.1s; }
        .smoke-2 { width: 22px; height: 22px; left: 10px; top: 2px; animation-delay: 3.5s; }
        .smoke-3 { width: 18px; height: 18px; left: 4px;  top: 4px; animation-delay: 3.8s; }
        .smoke-4 { width: 14px; height: 14px; left: 14px; top: 0;   animation-delay: 4.1s; }
        @keyframes smokePuff {
          0%   { opacity: 0;    transform: translateY(0) scale(0.3); }
          15%  { opacity: 0.6; }
          100% { opacity: 0;    transform: translateY(-52px) scale(3.2); }
        }

        @media (max-width: 600px) { .hp-truck { display: none; } }
        @media (max-width: 900px) { .hp-truck { width: clamp(300px, 70vw, 500px); } }

        /* ══ STATS ══ */
        .hp-stats {
          display: flex; align-items: stretch; flex-wrap: wrap; gap: 0;
          padding-top: var(--space-8); border-top: 1px solid oklch(1 0 0 / 0.08);
        }
        .hp-stats__item { display: flex; align-items: center; }
        .hp-stats__sep { width: 1px; height: 2rem; background: oklch(1 0 0 / 0.10); margin-inline: var(--space-6); }
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

        /* ══ REVEAL ANIMATION ══ */
        .reveal {
          opacity: 0; transform: translateY(22px);
          transition: opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1);
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal.d-1 { transition-delay: .08s; }
        .reveal.d-2 { transition-delay: .16s; }
        .reveal.d-3 { transition-delay: .24s; }

        /* ══ HERO FADE-IN ══ */
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
