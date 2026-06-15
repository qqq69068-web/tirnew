'use client';
import Link from "next/link";
import { useState } from "react";
import { services, HOUR_RATE_MIN, HOUR_RATE_MAX } from "@/lib/services";
import { Clock, Wrench, ChevronRight, Info } from "lucide-react";

export default function PricePage() {
  const categories = Array.from(new Set(services.map((s) => s.category)));
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all"
      ? categories
      : categories.filter((c) => c === active);

  return (
    <>
      <div className="price-page">

        <section className="page-hero">
          <div className="page-hero__bg" aria-hidden>
            <img
              src="https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4b7ff1d1e9c7337632543ebc2f5e043734922980.jpg"
              alt=""
              width={2200}
              height={1467}
              loading="eager"
              decoding="async"
              className="page-hero__img"
            />
            <div className="page-hero__overlay" />
          </div>
          <div className="page-hero__inner container">
            <p className="page-eyebrow">Вартість робіт</p>
            <h1 className="page-hero__title">Прайс на послуги</h1>
            <p className="page-hero__sub">
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

        <div className="price-content container">

          <div className="price-note">
            <Info size={15} className="price-note__icon" aria-hidden />
            <p className="price-note__text">
              Ціни вказані орієнтовно на основі нормогодин. Точна вартість — після огляду. Запчастини оплачуються окремо.
            </p>
          </div>

          <div className="price-filter" role="tablist" aria-label="Фільтр категорій">
            <button
              role="tab"
              aria-selected={active === "all"}
              className={`price-filter__tab${active === "all" ? " price-filter__tab--active" : ""}`}
              onClick={() => setActive("all")}
            >
              Всі
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={active === cat}
                className={`price-filter__tab${active === cat ? " price-filter__tab--active" : ""}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="price-tables">
            {filtered.map((cat) => {
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
                        {s.priceMax > 0 ? (
                          <p className="price-row-item__price-max">до {s.priceMax.toLocaleString("uk-UA")} грн</p>
                        ) : (
                          <p className="price-row-item__price-max">від 0 грн</p>
                        )}
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
            <Link href="/contacts" className="btn btn-primary">
              Записатись на огляд
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        .price-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }
        .page-hero {
          position: relative;
          min-height: 72vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .page-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .page-hero__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          filter: brightness(0.38) contrast(1.05) saturate(0.7);
        }
        .page-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(108deg, oklch(0.09 0.015 55 / 0.92) 0%, oklch(0.09 0.015 55 / 0.50) 55%, oklch(0.09 0.015 55 / 0.08) 100%);
        }
        .page-hero__inner {
          position: relative;
          z-index: 2;
          padding-block: clamp(3rem, 8vw, 5rem) 3.5rem;
          max-width: 700px;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          text-align: left;
          align-items: flex-start;
          margin-left: 0;
          margin-right: auto;
        }
        .page-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: oklch(1 0 0 / 0.38);
        }
        .page-eyebrow::before {
          content: '';
          display: inline-block;
          width: 22px; height: 1px;
          background: var(--primary);
          flex-shrink: 0;
        }
        .page-hero__title {
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 4.5vw, 3.6rem);
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: #fff;
          text-shadow: 0 2px 12px rgba(0,0,0,0.35);
        }
        .page-hero__sub {
          font-size: var(--text-sm);
          color: oklch(1 0 0 / 0.48);
          max-width: 52ch;
          line-height: 1.75;
        }
        .price-rate-card {
          display: inline-flex; align-items: center; gap: var(--space-4);
          background: var(--surface); border: 1px solid var(--border-strong);
          border-radius: var(--radius-lg); padding: var(--space-3) var(--space-5);
          margin-top: var(--space-2); box-shadow: var(--shadow-sm); width: fit-content;
        }
        .price-rate-card__icon { color: var(--primary); flex-shrink: 0; }
        .price-rate-card__label {
          font-size: var(--text-xs); color: var(--text-faint);
          text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 3px;
        }
        .price-rate-card__value {
          font-family: var(--font-display); font-size: var(--text-xl); font-weight: 900;
          color: var(--text); line-height: 1;
        }
        .price-rate-card__unit { font-size: var(--text-sm); font-weight: 400; color: var(--text-muted); }
        .price-content {
          padding-block: clamp(var(--space-6), 4vw, var(--space-10));
          display: flex; flex-direction: column; gap: var(--space-6);
        }
        .price-note {
          display: flex; align-items: flex-start; gap: var(--space-3);
          background: rgba(217,119,6,0.06); border: 1px solid rgba(217,119,6,0.18);
          border-radius: var(--radius-lg); padding: var(--space-3) var(--space-4);
        }
        .price-note__icon { color: #d97706; flex-shrink: 0; margin-top: 2px; }
        .price-note__text { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; }
        .price-filter {
          display: flex; flex-wrap: wrap; gap: var(--space-2); padding-bottom: var(--space-2);
        }
        .price-filter__tab {
          display: inline-flex; align-items: center; height: 36px;
          padding: 0 var(--space-4); border-radius: var(--radius-pill);
          font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.02em;
          background: var(--surface); border: 1px solid var(--border-strong);
          color: var(--text-muted); cursor: pointer;
          transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
          white-space: nowrap;
        }
        .price-filter__tab:hover { background: var(--surface2); color: var(--text); }
        .price-filter__tab--active { background: var(--primary); color: var(--text-inverse); border-color: var(--primary); }
        .price-tables { display: flex; flex-direction: column; gap: var(--space-4); }
        .price-group {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);
        }
        .price-group__header {
          display: flex; align-items: center; gap: var(--space-2);
          background: var(--surface2); border-bottom: 1px solid var(--border);
          padding: var(--space-3) var(--space-5);
        }
        .price-group__icon { color: var(--primary); flex-shrink: 0; }
        .price-group__title {
          font-size: var(--text-xs); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted);
        }
        .price-table-head {
          display: grid; grid-template-columns: 1fr 100px 130px 28px;
          padding: var(--space-2) var(--space-5);
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .price-th {
          font-size: var(--text-xs); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-faint);
        }
        .price-th--hours { text-align: center; }
        .price-th--price { text-align: right; }
        .price-row-item {
          display: grid; grid-template-columns: 1fr 100px 130px 28px; align-items: center;
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--border);
          text-decoration: none; color: var(--text);
          transition: background var(--transition-fast);
        }
        .price-row-item:last-child { border-bottom: none; }
        .price-row-item:hover { background: var(--surface2); }
        .price-row-item__title { font-size: var(--text-base); font-weight: 600; color: var(--text); line-height: 1.4; }
        .price-row-item__sub { font-size: var(--text-xs); color: var(--text-faint); margin-top: 3px; }
        .price-row-item__hours { display: flex; justify-content: center; align-items: center; }
        .price-hours-badge {
          display: inline-flex; align-items: center; gap: 3px; font-size: var(--text-xs);
          color: var(--text-muted); background: var(--surface2);
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          padding: 2px var(--space-2); white-space: nowrap;
        }
        .price-row-item__price { text-align: right; }
        .price-row-item__price-main { font-size: var(--text-sm); font-weight: 700; color: var(--text); }
        .price-row-item__price-max { font-size: var(--text-xs); color: var(--text-faint); margin-top: 2px; }
        .price-row-item__arrow { display: flex; justify-content: center; color: var(--text-faint); }
        .price-cta {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-xl); padding: clamp(var(--space-8), 5vw, var(--space-12));
          text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
        }
        .price-cta__title {
          font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800; color: var(--text); letter-spacing: -0.02em;
        }
        .price-cta__sub { font-size: var(--text-base); color: var(--text-muted); max-width: 44ch; line-height: 1.65; }
        @media (max-width: 640px) {
          .page-hero__inner { padding-block: 2.5rem 2.5rem; }
          .price-table-head { display: none; }
          .price-row-item { grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: var(--space-1) var(--space-2); }
          .price-row-item__service { grid-row: 1; grid-column: 1; }
          .price-row-item__price { grid-row: 1; grid-column: 2; text-align: right; }
          .price-row-item__hours { grid-row: 2; grid-column: 1; justify-content: flex-start; }
          .price-row-item__arrow { display: none; }
        }
      `}</style>
    </>
  );
}
