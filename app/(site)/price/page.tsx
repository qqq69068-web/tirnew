import Link from "next/link";
import { services, HOUR_RATE_MIN, HOUR_RATE_MAX } from "@/lib/services";
import { Clock, Wrench, ChevronRight, Info } from "lucide-react";

export const metadata = {
  title: "Прайс на роботи — Tirnew Truck Service",
  description: "Вартість ремонтних робіт для вантажних автомобілів і причепів.",
};

const categories = Array.from(new Set(services.map((s) => s.category)));

export default function PricePage() {
  return (
    <>
      <div className="price-page">

        {/* ─── HERO ──────────────────────────────────────────── */}
        <section className="price-hero">
          <div className="price-hero__bg" aria-hidden />
          <div className="price-hero__inner container">
            <p className="price-eyebrow">Вартість робіт</p>
            <h1 className="price-hero__title">Прайс на послуги</h1>
            <p className="price-hero__sub">
              Вартість розраховується за нормогодинами. Кінцева ціна — після огляду та дефектації.
            </p>
            <div className="price-rate-card">
              <Clock size={20} className="price-rate-card__icon" aria-hidden />
              <div>
                <p className="price-rate-card__label">Нормогодина</p>
                <p className="price-rate-card__value">
                  {HOUR_RATE_MIN}–{HOUR_RATE_MAX} <span className="price-rate-card__unit">грн</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CONTENT ─────────────────────────────────────────── */}
        <div className="price-content container">

          <div className="price-note">
            <Info size={15} className="price-note__icon" aria-hidden />
            <p className="price-note__text">
              Ціни вказані орієнтовно на основі нормогодин. Точна вартість — після огляду. Запчастини оплачуються окремо.
            </p>
          </div>

          <div className="price-tables">
            {categories.map((cat) => {
              const items = services.filter((s) => s.category === cat);
              return (
                <div key={cat} className="price-group">
                  <div className="price-group__header">
                    <Wrench size={14} className="price-group__icon" aria-hidden />
                    <h2 className="price-group__title">{cat}</h2>
                  </div>
                  <div className="price-table-head">
                    <span className="price-th price-th--service">Послуга</span>
                    <span className="price-th price-th--hours">Н/ГОД</span>
                    <span className="price-th price-th--price">ВАРТІСТЬ</span>
                    <span className="price-th price-th--action" />
                  </div>
                  {items.map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`} className="price-row-item">
                      <div className="price-row-item__service">
                        <p className="price-row-item__title">{s.title}</p>
                        {s.short && <p className="price-row-item__sub">{s.short}</p>}
                      </div>
                      <div className="price-row-item__hours">
                        {s.hours && (
                          <span className="price-hours-badge">
                            <Clock size={10} aria-hidden />
                            {s.hours}
                          </span>
                        )}
                      </div>
                      <div className="price-row-item__price">
                        <p className="price-row-item__price-main">{s.price}</p>
                        <p className="price-row-item__price-max">до {s.priceMax.toLocaleString("uk-UA")} грн</p>
                      </div>
                      <div className="price-row-item__arrow">
                        <ChevronRight size={16} aria-hidden />
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="price-cta">
            <h2 className="price-cta__title">Потрібен точний розрахунок?</h2>
            <p className="price-cta__sub">
              Привезіть авто на огляд — майстер визначить обсяг робіт і озвучить фінальну ціну.
            </p>
            <Link href="/contacts" className="price-cta__btn">
              Записатись на огляд
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        /* === FIX: white gap above hero ===
           The global body/html has a light-mode bg.
           We override it when .price-page is present
           so any sub-pixel gap is dark, not white. */
        body:has(.price-page) {
          background-color: #141618 !important;
        }

        /* === LOCAL PALETTE (dark steel, price page only) === */
        .price-page {
          --p-bg:            #141618;
          --p-surface:       #1c1f22;
          --p-surface2:      #22262a;
          --p-surface3:      #282d32;
          --p-border:        rgba(255,255,255,0.07);
          --p-border-strong: rgba(255,255,255,0.12);
          --p-text:          #e8eaec;
          --p-text-muted:    #8f9499;
          --p-text-faint:    #535c63;
          --p-accent:        #dc2626;
          --p-accent-glow:   rgba(220,38,38,0.15);
          --p-amber:         #d97706;
          --p-amber-bg:      rgba(217,119,6,0.08);
          --p-amber-border:  rgba(217,119,6,0.2);

          min-height: 100vh;
          background: var(--p-bg);
          color: var(--p-text);
        }

        /* === HERO === */
        .price-hero {
          position: relative;
          overflow: hidden;
          padding: clamp(3rem, 6vw, 5rem) 0 clamp(2.5rem, 5vw, 4rem);
          border-bottom: 1px solid var(--p-border);
          background: linear-gradient(160deg, #1a1d20 0%, #111315 100%);
        }
        .price-hero__bg {
          position: absolute; inset: 0;
          background-image: url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80);
          background-size: cover; background-position: center;
          opacity: 0.06; mix-blend-mode: luminosity;
        }
        .price-hero::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--p-accent), transparent);
          opacity: 0.7;
        }
        .price-hero__inner { position: relative; display: flex; flex-direction: column; gap: 0.875rem; }
        .price-eyebrow {
          font-size: var(--text-xs); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--p-accent);
        }
        .price-hero__title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900;
          color: var(--p-text); line-height: 1.08; letter-spacing: -0.02em; margin-top: 0.125rem;
        }
        .price-hero__sub {
          font-size: var(--text-base); color: var(--p-text-muted); max-width: 52ch; line-height: 1.7;
        }
        .price-rate-card {
          display: inline-flex; align-items: center; gap: 1rem;
          background: var(--p-surface2); border: 1px solid var(--p-border-strong);
          border-radius: var(--radius-lg); padding: 0.875rem 1.25rem; margin-top: 0.5rem;
          box-shadow: 0 0 0 1px rgba(220,38,38,0.08), 0 4px 16px rgba(0,0,0,0.3); width: fit-content;
        }
        .price-rate-card__icon { color: var(--p-accent); flex-shrink: 0; }
        .price-rate-card__label {
          font-size: var(--text-xs); color: var(--p-text-faint);
          text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 3px;
        }
        .price-rate-card__value {
          font-family: var(--font-display); font-size: var(--text-xl); font-weight: 900;
          color: var(--p-text); line-height: 1;
        }
        .price-rate-card__unit { font-size: var(--text-sm); font-weight: 400; color: var(--p-text-muted); }

        /* === CONTENT === */
        .price-content {
          padding-block: clamp(1.5rem, 4vw, 2.5rem); display: flex; flex-direction: column; gap: 1.5rem;
        }
        .price-note {
          display: flex; align-items: flex-start; gap: 0.75rem;
          background: var(--p-amber-bg); border: 1px solid var(--p-amber-border);
          border-radius: var(--radius-lg); padding: 0.875rem 1.125rem;
        }
        .price-note__icon { color: var(--p-amber); flex-shrink: 0; margin-top: 2px; }
        .price-note__text { font-size: var(--text-sm); color: var(--p-text-muted); line-height: 1.6; max-width: 100%; }

        /* === TABLES === */
        .price-tables { display: flex; flex-direction: column; gap: 1rem; }
        .price-group {
          background: var(--p-surface); border: 1px solid var(--p-border);
          border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.25);
        }
        .price-group__header {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--p-surface3); border-bottom: 1px solid var(--p-border); padding: 0.75rem 1.25rem;
        }
        .price-group__icon { color: var(--p-accent); flex-shrink: 0; }
        .price-group__title {
          font-size: var(--text-xs); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--p-text-muted);
        }
        .price-table-head {
          display: grid; grid-template-columns: 1fr 80px 130px 28px;
          padding: 0.5rem 1.25rem; border-bottom: 1px solid var(--p-border); background: rgba(0,0,0,0.15);
        }
        .price-th {
          font-size: var(--text-xs); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em; color: var(--p-text-faint);
        }
        .price-th--hours { text-align: center; }
        .price-th--price { text-align: right; }
        .price-row-item {
          display: grid; grid-template-columns: 1fr 80px 130px 28px; align-items: center;
          padding: 0.9375rem 1.25rem; border-bottom: 1px solid var(--p-border);
          text-decoration: none; color: var(--p-text); transition: background 150ms ease; cursor: pointer;
        }
        .price-row-item:last-child { border-bottom: none; }
        .price-row-item:hover { background: var(--p-surface2); }
        .price-row-item__service { min-width: 0; }
        .price-row-item__title { font-size: var(--text-base); font-weight: 600; color: var(--p-text); line-height: 1.4; }
        .price-row-item__sub { font-size: var(--text-xs); color: var(--p-text-faint); margin-top: 3px; line-height: 1.5; }
        .price-row-item__hours { display: flex; justify-content: center; }
        .price-hours-badge {
          display: inline-flex; align-items: center; gap: 3px; font-size: var(--text-xs);
          color: var(--p-text-muted); background: var(--p-surface3);
          border: 1px solid var(--p-border-strong); border-radius: 999px; padding: 3px 8px; white-space: nowrap;
        }
        .price-row-item__price { text-align: right; }
        .price-row-item__price-main { font-size: var(--text-base); font-weight: 700; color: var(--p-text); line-height: 1.3; }
        .price-row-item__price-max { font-size: var(--text-xs); color: var(--p-text-faint); margin-top: 2px; }
        .price-row-item__arrow {
          display: flex; justify-content: center; color: var(--p-text-faint);
          transition: color 150ms ease, transform 150ms ease;
        }
        .price-row-item:hover .price-row-item__arrow { color: var(--p-accent); transform: translateX(3px); }

        /* === CTA === */
        .price-cta {
          background: var(--p-surface); border: 1px solid var(--p-border-strong);
          border-radius: var(--radius-xl); padding: clamp(1.75rem, 4vw, 2.5rem);
          text-align: center; display: flex; flex-direction: column; align-items: center;
          gap: 0.875rem; margin-top: 0.5rem; margin-bottom: 1rem;
          box-shadow: 0 0 0 1px rgba(220,38,38,0.06), 0 4px 24px rgba(0,0,0,0.25);
        }
        .price-cta__title {
          font-family: var(--font-display); font-size: var(--text-xl); font-weight: 800;
          color: var(--p-text); line-height: 1.2;
        }
        .price-cta__sub { font-size: var(--text-base); color: var(--p-text-muted); max-width: 40ch; line-height: 1.65; }
        .price-cta__btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--p-accent); color: #fff; font-size: var(--text-sm); font-weight: 700;
          text-decoration: none; border-radius: var(--radius-md); padding: 0.75rem 1.5rem;
          letter-spacing: 0.01em; transition: background 150ms ease, box-shadow 150ms ease;
        }
        .price-cta__btn:hover { background: #b91c1c; box-shadow: 0 4px 16px rgba(220,38,38,0.35); }

        /* === MOBILE === */
        @media (max-width: 600px) {
          .price-table-head { display: none; }
          .price-row-item {
            grid-template-columns: 1fr auto; grid-template-rows: auto auto;
            gap: 0.25rem 0.5rem; padding: 0.875rem 1rem;
          }
          .price-row-item__hours { display: none; }
          .price-row-item__price { grid-row: 1; grid-column: 2; text-align: right; }
          .price-row-item__arrow { display: none; }
          .price-row-item__service { grid-row: 1 / 3; grid-column: 1; }
        }
      `}</style>
    </>
  );
}
