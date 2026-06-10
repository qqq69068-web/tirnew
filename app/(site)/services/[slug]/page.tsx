import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowLeft, CheckCircle2, Package, Clock, Tag, ChevronRight } from "lucide-react";
import BookingButton from "@/components/BookingButton";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: `${service.title} | Тірнью Truck Service`, description: service.short };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <main className="sd">

        {/* ─── HERO ───────────────────────────────────────────── */}
        <div className="sd__hero">
          <img
            src={service.image}
            alt={service.title}
            className="sd__hero-img"
            width={1600}
            height={560}
            loading="eager"
          />
          <div className="sd__hero-overlay" aria-hidden />
          <div className="sd__hero-content container">
            <Link href="/services" className="sd__back">
              <ArrowLeft size={14} aria-hidden /> Усі послуги
            </Link>
            <div className="sd__hero-meta">
              <span className="sd__category-badge">{service.category}</span>
            </div>
            <h1 className="sd__hero-title">{service.title}</h1>
            {service.short && (
              <p className="sd__hero-sub">{service.short}</p>
            )}
          </div>
        </div>

        {/* ─── BREADCRUMB ─────────────────────────────────────── */}
        <div className="sd__breadcrumb">
          <div className="container">
            <nav className="sd__bread-nav" aria-label="breadcrumb">
              <Link href="/" className="sd__bread-link">Головна</Link>
              <ChevronRight size={12} aria-hidden />
              <Link href="/services" className="sd__bread-link">Послуги</Link>
              <ChevronRight size={12} aria-hidden />
              <span className="sd__bread-current">{service.title}</span>
            </nav>
          </div>
        </div>

        {/* ─── BODY ───────────────────────────────────────────── */}
        <div className="sd__body container">
          <div className="sd__grid">

            {/* ── LEFT: content ── */}
            <div className="sd__content">

              {/* About */}
              <section className="sd__section">
                <h2 className="sd__section-title">Про послугу</h2>
                <p className="sd__desc">{service.description}</p>
              </section>

              {/* Includes */}
              {service.details && service.details.length > 0 && (
                <section className="sd__section">
                  <h2 className="sd__section-title">Що включає</h2>
                  <ul className="sd__checklist" role="list">
                    {service.details.map((d) => (
                      <li key={d} className="sd__check-item">
                        <CheckCircle2 size={15} className="sd__check-icon" aria-hidden />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Related */}
              {related.length > 0 && (
                <section className="sd__section sd__section--related">
                  <h2 className="sd__section-title">Схожі послуги</h2>
                  <div className="sd__related">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/services/${r.slug}`} className="sd-related">
                        <div className="sd-related__img">
                          <img
                            src={r.image}
                            alt={r.title}
                            width={300}
                            height={140}
                            loading="lazy"
                          />
                        </div>
                        <div className="sd-related__body">
                          <p className="sd-related__title">{r.title}</p>
                          <span className="sd-related__arrow">→</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* ── RIGHT: price sidebar ── */}
            <aside className="sd__sidebar">
              <div className="sd-price">

                <div className="sd-price__eyebrow">
                  <Tag size={11} aria-hidden />
                  <span>Вартість</span>
                </div>

                <div className="sd-price__value">{service.price}</div>

                {service.hours && (
                  <div className="sd-price__hours">
                    <Clock size={12} aria-hidden />
                    <span>{service.hours}</span>
                  </div>
                )}

                <div className="sd-price__divider" aria-hidden />

                <div className="sd-price__actions">
                  {service.isPartsOrder ? (
                    <Link href="/parts-order" className="btn btn-primary btn-block btn-lg">
                      <Package size={15} aria-hidden /> Замовити запчастини
                    </Link>
                  ) : (
                    <BookingButton serviceSlug={service.slug} serviceTitle={service.title} />
                  )}
                  <Link href="/services" className="btn btn-outline btn-block">
                    ← Усі послуги
                  </Link>
                </div>

                {/* Trust signals */}
                <ul className="sd-price__trust" role="list">
                  <li>✔ Офіційна гарантія на роботи</li>
                  <li>✔ Запчастини від виробника</li>
                  <li>✔ Досвідчені майстри</li>
                </ul>
              </div>
            </aside>

          </div>
        </div>
      </main>

      {/* ─── SCOPED STYLES ────────────────────────────────────── */}
      <style>{`

        /* ── PAGE SHELL ─────────────────────────────── */
        .sd {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* ── HERO ───────────────────────────────────── */
        .sd__hero {
          position: relative;
          height: clamp(300px, 38vw, 480px);
          overflow: hidden;
        }
        .sd__hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sd__hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.88) 0%,
            rgba(0,0,0,0.45) 45%,
            rgba(0,0,0,0.10) 100%
          );
        }
        .sd__hero-content {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          padding-bottom: clamp(1.5rem, 4vw, 2.5rem);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .sd__back {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: var(--text-xs);
          color: rgba(255,255,255,0.60);
          text-decoration: none;
          width: fit-content;
          transition: color var(--transition-fast);
          margin-bottom: 0.25rem;
        }
        .sd__back:hover { color: rgba(255,255,255,0.9); }
        .sd__category-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          background: rgba(185,28,28,0.18);
          border: 1px solid rgba(185,28,28,0.38);
          color: #fca5a5;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          width: fit-content;
        }
        .sd__hero-meta { display: flex; align-items: center; gap: 0.5rem; }
        .sd__hero-title {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          font-weight: 900;
          line-height: 1.08;
          color: #fff;
          letter-spacing: -0.02em;
          max-width: 700px;
        }
        .sd__hero-sub {
          font-size: var(--text-sm);
          color: rgba(255,255,255,0.62);
          max-width: 560px;
          line-height: 1.6;
        }

        /* ── BREADCRUMB ─────────────────────────────── */
        .sd__breadcrumb {
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .sd__bread-nav {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem 0;
          color: var(--text-faint);
          font-size: var(--text-xs);
        }
        .sd__bread-link {
          color: var(--text-muted);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .sd__bread-link:hover { color: var(--primary); }
        .sd__bread-current { color: var(--text); font-weight: 500; }

        /* ── BODY LAYOUT ────────────────────────────── */
        .sd__body {
          padding-block: clamp(2rem, 5vw, 3.5rem);
        }
        .sd__grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: clamp(2rem, 4vw, 3rem);
          align-items: start;
        }

        /* ── CONTENT (left) ─────────────────────────── */
        .sd__content {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .sd__section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .sd__section-title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text);
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 0.25rem;
        }
        .sd__desc {
          font-size: var(--text-base);
          line-height: 1.78;
          color: var(--text-muted);
        }

        /* Checklist */
        .sd__checklist {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 0;
          list-style: none;
        }
        .sd__check-item {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          font-size: var(--text-base);
          color: var(--text-muted);
          line-height: 1.55;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius);
          transition: background var(--transition-fast);
        }
        .sd__check-item:hover { background: var(--surface); }
        .sd__check-icon {
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 3px;
        }

        /* Related */
        .sd__section--related { gap: 1.25rem; }
        .sd__related {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 0.875rem;
        }
        .sd-related {
          background: var(--surface);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: box-shadow var(--transition-base), border-color var(--transition-base), transform var(--transition-spring);
        }
        .sd-related:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--border-accent);
          transform: translateY(-3px);
        }
        .sd-related__img {
          height: 110px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .sd-related__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .sd-related:hover .sd-related__img img { transform: scale(1.05); }
        .sd-related__body {
          padding: 0.625rem 0.875rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .sd-related__title {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text);
          line-height: 1.4;
        }
        .sd-related__arrow {
          font-size: var(--text-xs);
          color: var(--text-faint);
          flex-shrink: 0;
          transition: color var(--transition-fast), transform var(--transition-fast);
        }
        .sd-related:hover .sd-related__arrow { color: var(--primary); transform: translateX(3px); }

        /* ── PRICE SIDEBAR ──────────────────────────── */
        .sd__sidebar {
          position: sticky;
          top: 80px;
          align-self: flex-start;
        }
        .sd-price {
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xl);
          padding: 1.75rem;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .sd-price__eyebrow {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          color: var(--text-faint);
          font-weight: 700;
        }
        .sd-price__value {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 900;
          color: var(--accent);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .sd-price__hours {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          color: var(--text-faint);
        }
        .sd-price__divider {
          height: 1px;
          background: var(--border);
          margin-block: 0.25rem;
        }
        .sd-price__actions {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .btn-block {
          width: 100%;
          justify-content: center;
        }
        .sd-price__trust {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-top: 0.25rem;
        }
        .sd-price__trust li {
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* ── RESPONSIVE ─────────────────────────────── */
        @media (max-width: 768px) {
          .sd__grid {
            grid-template-columns: 1fr;
          }
          .sd__sidebar {
            position: static;
            order: -1;
          }
          .sd-price {
            border-radius: var(--radius-lg);
            padding: 1.25rem;
          }
          .sd__hero {
            height: clamp(240px, 55vw, 360px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sd-related:hover { transform: none; }
          .sd-related__img img { transition: none; }
        }
      `}</style>
    </>
  );
}
