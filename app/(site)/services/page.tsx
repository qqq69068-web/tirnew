"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { ChevronRight, Wrench, Car, ArrowRight } from "lucide-react";

const tirServices = services.filter((s) => s.vehicleType !== "car");
const carServices = services.filter((s) => s.vehicleType !== "truck");

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"tir" | "car">("tir");
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll("[data-observe]").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [activeTab]);

  const displayedServices = activeTab === "tir" ? tirServices : carServices;

  const categories = Array.from(
    new Set(displayedServices.map((s) => s.category))
  );

  return (
    <>
      <div className="svc-page">

        {/* ─── HERO ────────────────────────────────────────── */}
        <section className="page-hero">
          <div className="page-hero__bg" aria-hidden>
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2400&q=80"
              alt=""
              width={2400}
              height={1600}
              loading="eager"
              decoding="async"
              className="page-hero__img"
            />
            <div className="page-hero__overlay" />
          </div>
          <div className="container page-hero__inner fade-in">
            <p className="page-eyebrow">
              <span>Каталог послуг</span>
            </p>
            <h1 className="page-hero__title">Ремонт і обслуговування вантажного транспорту</h1>
            <p className="page-hero__sub">
              Повний цикл діагностики, ремонту та обслуговування TIR, причіпної техніки та легкових автомобілів.
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
        </section>

        {/* ─── TAB SWITCHER ─────────────────────────────── */}
        <div className="svc-tabs-bar">
          <div className="container svc-tabs-inner">
            <button
              className={`svc-tab${activeTab === "tir" ? " svc-tab--active" : ""}`}
              onClick={() => setActiveTab("tir")}
              aria-pressed={activeTab === "tir"}
            >
              <Wrench size={15} aria-hidden />
              Вантажні / ТІР
              <span className="svc-tab__count">{tirServices.length}</span>
            </button>
            <button
              className={`svc-tab${activeTab === "car" ? " svc-tab--active" : ""}`}
              onClick={() => setActiveTab("car")}
              aria-pressed={activeTab === "car"}
            >
              <Car size={15} aria-hidden />
              Легкові
              <span className="svc-tab__count">{carServices.length}</span>
            </button>
          </div>
        </div>

        {/* ─── SERVICE LIST ─────────────────────────────── */}
        <div className="svc-content container">

          {activeTab === "tir" && (
            <div className="svc-intro">
              <div className="svc-intro__text">
                <p className="svc-section-eyebrow">— Вантажні автомобілі і ТІР</p>
                <h2 className="svc-intro__title">Повний перелік послуг для вантажного транспорту</h2>
              </div>
              <Link href="/contacts" className="btn btn-ghost svc-intro__cta">
                Записатись <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          )}
          {activeTab === "car" && (
            <div className="svc-intro">
              <div className="svc-intro__text">
                <p className="svc-section-eyebrow">— Легкові автомобілі</p>
                <h2 className="svc-intro__title">Послуги для легкого транспорту</h2>
              </div>
              <Link href="/contacts" className="btn btn-ghost svc-intro__cta">
                Записатись <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          )}

          {categories.map((cat) => {
            const catItems = displayedServices.filter((s) => s.category === cat);
            return (
              <div key={cat} className="svc-group">
                <h3 className="svc-group__title">{cat}</h3>
                <div className="svc-grid">
                  {catItems.map((svc) => (
                    <Link
                      key={svc.slug}
                      href={`/services/${svc.slug}`}
                      id={`svc-${svc.slug}`}
                      data-observe
                      className={`svc-card${visibleItems.has(`svc-${svc.slug}`) ? " svc-card--visible" : ""}`}
                    >
                      <div className="svc-card__body">
                        <p className="svc-card__title">{svc.title}</p>
                        {svc.short && (
                          <p className="svc-card__desc">{svc.short}</p>
                        )}
                      </div>
                      <div className="svc-card__footer">
                        <span className="svc-card__price">{svc.price}</span>
                        <span className="svc-card__arrow">
                          <ChevronRight size={16} aria-hidden />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .svc-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* ── HERO ───────────────────────────────────────── */
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
          object-position: center 40%;
          filter: brightness(0.38) contrast(1.05) saturate(0.7);
        }
        .page-hero__overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              108deg,
              oklch(0.09 0.015 55 / 0.92) 0%,
              oklch(0.09 0.015 55 / 0.50) 55%,
              oklch(0.09 0.015 55 / 0.08) 100%
            );
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

        .svc-hero__meta {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          margin-top: var(--space-4);
          flex-wrap: wrap;
        }
        .svc-hero__stat { display: flex; flex-direction: column; gap: 3px; }
        .svc-hero__stat-num {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }
        .svc-hero__stat-lbl {
          font-size: var(--text-xs);
          color: oklch(1 0 0 / 0.38);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }
        .svc-hero__divider {
          width: 1px; height: 32px;
          background: oklch(1 0 0 / 0.15);
          flex-shrink: 0;
        }

        /* ── TABS ───────────────────────────────────────── */
        .svc-tabs-bar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .svc-tabs-inner {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .svc-tab {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          height: 52px;
          padding: 0 var(--space-5);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-muted);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: color var(--transition-fast), border-color var(--transition-fast);
          white-space: nowrap;
          margin-bottom: -1px;
        }
        .svc-tab:hover { color: var(--text); }
        .svc-tab--active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .svc-tab__count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          height: 20px;
          padding: 0 6px;
          font-size: 11px;
          font-weight: 700;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          color: var(--text-muted);
        }
        .svc-tab--active .svc-tab__count {
          background: oklch(from var(--primary) l c h / 0.12);
          border-color: oklch(from var(--primary) l c h / 0.25);
          color: var(--primary);
        }

        /* ── CONTENT ────────────────────────────────────── */
        .svc-content {
          padding-block: clamp(var(--space-6), 4vw, var(--space-10));
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        .svc-intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .svc-section-eyebrow {
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--primary);
          margin-bottom: var(--space-2);
        }
        .svc-intro__title {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.15;
          max-width: 32ch;
        }
        .svc-intro__cta {
          white-space: nowrap;
          flex-shrink: 0;
        }

        .svc-group { display: flex; flex-direction: column; gap: var(--space-4); }
        .svc-group__title {
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-faint);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--border);
        }

        .svc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
          gap: var(--space-3);
        }

        .svc-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: var(--space-3);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-4) var(--space-5);
          text-decoration: none;
          color: var(--text);
          cursor: pointer;
          opacity: 0;
          transform: translateY(12px);
          transition:
            opacity 0.35s ease,
            transform 0.35s ease,
            background var(--transition-fast),
            box-shadow var(--transition-fast);
        }
        .svc-card--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .svc-card:hover {
          background: var(--surface2);
          box-shadow: var(--shadow-md);
        }
        .svc-card__body { display: flex; flex-direction: column; gap: var(--space-1); }
        .svc-card__title {
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--text);
          line-height: 1.4;
        }
        .svc-card__desc {
          font-size: var(--text-xs);
          color: var(--text-faint);
          line-height: 1.55;
        }
        .svc-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: var(--space-2);
        }
        .svc-card__price {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--primary);
        }
        .svc-card__arrow { color: var(--text-faint); }

        /* ── ANIMATIONS ─────────────────────────────────── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeUp 0.5s ease forwards; }

        /* ── MOBILE ─────────────────────────────────────── */
        @media (max-width: 640px) {
          .page-hero__inner { padding-block: 2.5rem 2.5rem; }
          .svc-hero__meta { gap: var(--space-4); }
          .svc-hero__divider { display: none; }
          .svc-grid { grid-template-columns: 1fr; }
          .svc-intro { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </>
  );
}
