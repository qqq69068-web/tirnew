import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, ChevronRight } from "lucide-react";
import BookingButton from "@/components/BookingButton";
import { services } from "@/lib/services";

interface Props { params: Promise<{ slug: string }> }

export const dynamic = "force-static";

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

        {/* ─── HERO ────────────────────────────────────────────── */}
        <div className="sd__hero">
          <img
            src={service.image}
            alt={service.title}
            className="sd__hero-img"
            width={1600}
            height={560}
            loading="eager"
            decoding="async"
          />
          <div className="sd__hero-overlay" aria-hidden />
          <div className="sd__hero-content container">
            <Link href="/services" className="sd__back">
              <ArrowLeft size={13} aria-hidden />
              Усі послуги
            </Link>
            <span className="sd__category-tag">{service.category}</span>
            <h1 className="sd__hero-title">{service.title}</h1>
            {service.short && (
              <p className="sd__hero-sub">{service.short}</p>
            )}
          </div>
        </div>

        {/* ─── BREADCRUMB ────────────────────────────────────────── */}
        <div className="sd__breadcrumb">
          <div className="container">
            <nav className="sd__bread-nav" aria-label="breadcrumb">
              <Link href="/" className="sd__bread-link">Головна</Link>
              <ChevronRight size={11} aria-hidden />
              <Link href="/services" className="sd__bread-link">Послуги</Link>
              <ChevronRight size={11} aria-hidden />
              <span className="sd__bread-current">{service.title}</span>
            </nav>
          </div>
        </div>

        {/* ─── BODY ──────────────────────────────────────────────── */}
        <div className="sd__body container">
          <div className="sd__grid">

            {/* LEFT: content */}
            <div className="sd__content">

              <section className="sd__section">
                <h2 className="sd__section-title">Про послугу</h2>
                <p className="sd__desc">{service.description}</p>
              </section>

              {service.details && service.details.length > 0 && (
                <section className="sd__section">
                  <h2 className="sd__section-title">Що включає</h2>
                  <ul className="sd__checklist" role="list">
                    {service.details.map((d) => (
                      <li key={d} className="sd__check-item">
                        <span className="sd__check-dot" aria-hidden />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {related.length > 0 && (
                <section className="sd__section sd__section--related">
                  <h2 className="sd__section-title">Схожі послуги</h2>
                  <div className="sd__related">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/services/${r.slug}`} className="sd-rel">
                        <div className="sd-rel__img">
                          <img
                            src={r.image}
                            alt={r.title}
                            width={300}
                            height={140}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="sd-rel__body">
                          <span className="sd-rel__title">{r.title}</span>
                          <span className="sd-rel__arr" aria-hidden>&#8594;</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* RIGHT: sidebar */}
            <aside className="sd__sidebar">
              <div className="sd-price">

                <div className="sd-price__label">
                  <Tag size={10} aria-hidden />
                  <span>Вартість</span>
                </div>

                <div className="sd-price__value">{service.price}</div>

                {service.hours && (
                  <div className="sd-price__hours">
                    <Clock size={11} aria-hidden />
                    <span>{service.hours}</span>
                  </div>
                )}

                <hr className="sd-price__hr" />

                <div className="sd-price__actions">
                  <BookingButton fullWidth />
                  <Link href="/services" className="btn btn-outline btn-block">
                    ← Усі послуги
                  </Link>
                </div>

                <ul className="sd-price__trust" role="list">
                  <li>Гарантія на всі роботи</li>
                  <li>Запчастини від виробника</li>
                  <li>Досвідчені майстри</li>
                </ul>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <style>{`
        .sd {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* ──── HERO ────────────────────────────────────────────── */
        .sd__hero {
          position: relative;
          height: clamp(280px, 36vw, 460px);
          overflow: hidden;
        }
        .sd__hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 40%;
          filter: brightness(0.30) contrast(1.06) saturate(0.60);
        }
        .sd__hero-overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(
              to top,
              oklch(0.09 0.015 55 / 0.97) 0%,
              oklch(0.09 0.015 55 / 0.55) 40%,
              transparent 100%
            ),
            linear-gradient(
              108deg,
              oklch(0.09 0.015 55 / 0.70) 0%,
              transparent 65%
            );
        }
        .sd__hero-content {
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 100%;
          padding-bottom: clamp(1.5rem, 4vw, 2.5rem);
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .sd__back {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: var(--text-xs);
          color: oklch(1 0 0 / 0.45);
          text-decoration: none;
          width: fit-content;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: color 0.16s ease;
          margin-bottom: 0.2rem;
        }
        .sd__back:hover { color: oklch(1 0 0 / 0.85); }

        .sd__category-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .sd__category-tag::before {
          content: '';
          display: inline-block;
          width: 14px; height: 1.5px;
          background: currentColor;
          border-radius: 2px;
        }

        .sd__hero-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3.8vw, 2.7rem);
          font-weight: 900;
          line-height: 1.06;
          color: #fff;
          letter-spacing: -0.025em;
          max-width: 680px;
        }
        .sd__hero-sub {
          font-size: var(--text-sm);
          color: oklch(1 0 0 / 0.50);
          max-width: 520px;
          line-height: 1.65;
        }

        /* ──── BREADCRUMB ─────────────────────────────────────────── */
        .sd__breadcrumb {
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .sd__bread-nav {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding-block: 0.7rem;
          color: var(--text-faint);
          font-size: var(--text-xs);
          flex-wrap: wrap;
        }
        .sd__bread-link {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .sd__bread-link:hover { color: var(--primary); }
        .sd__bread-current {
          color: var(--text);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 28ch;
        }

        /* ──── BODY LAYOUT ────────────────────────────────────────────── */
        .sd__body {
          padding-block: clamp(2rem, 5vw, 3.5rem);
        }
        .sd__grid {
          display: grid;
          grid-template-columns: 1fr 296px;
          gap: clamp(2rem, 4vw, 3rem);
          align-items: start;
        }

        /* ──── CONTENT (left) ──────────────────────────────────────────── */
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
          font-weight: 800;
          color: var(--text);
          padding-bottom: 0.7rem;
          border-bottom: 1px solid var(--border);
          letter-spacing: -0.01em;
        }
        .sd__desc {
          font-size: var(--text-base);
          line-height: 1.8;
          color: var(--text-muted);
          max-width: 68ch;
        }

        .sd__checklist {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0;
          list-style: none;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .sd__check-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.55;
          padding: 0.7rem 1rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s ease;
        }
        .sd__check-item:last-child { border-bottom: none; }
        .sd__check-item:hover { background: var(--surface); }
        .sd__check-dot {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--primary);
          flex-shrink: 0;
          margin-top: 0.45em;
          opacity: 0.7;
        }

        .sd__section--related { gap: 1.25rem; }
        .sd__related {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
        }
        .sd-rel {
          background: var(--surface);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition:
            box-shadow 0.18s ease,
            border-color 0.18s ease,
            transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sd-rel:hover {
          box-shadow: 0 4px 16px oklch(0 0 0 / 0.09);
          border-color: oklch(from var(--primary) l c h / 0.28);
          transform: translateY(-3px);
        }
        .sd-rel__img {
          height: 100px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .sd-rel__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
          filter: brightness(0.88) saturate(0.8);
        }
        .sd-rel:hover .sd-rel__img img { transform: scale(1.05); filter: brightness(0.95) saturate(0.9); }
        .sd-rel__body {
          padding: 0.6rem 0.875rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .sd-rel__title {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text);
          line-height: 1.4;
        }
        .sd-rel__arr {
          font-size: var(--text-xs);
          color: var(--text-faint);
          flex-shrink: 0;
          transition: color 0.16s ease, transform 0.18s ease;
        }
        .sd-rel:hover .sd-rel__arr { color: var(--primary); transform: translateX(3px); }

        /* ──── PRICE SIDEBAR ──────────────────────────────────────────── */
        .sd__sidebar {
          position: sticky;
          top: 78px;
          align-self: flex-start;
        }
        .sd-price {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 1.5rem 1.75rem;
          box-shadow: 0 4px 20px oklch(0 0 0 / 0.07);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .sd-price__label {
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
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          font-weight: 900;
          color: var(--primary);
          line-height: 1;
          letter-spacing: -0.025em;
          font-variant-numeric: tabular-nums;
        }
        .sd-price__hours {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: -0.25rem;
        }
        .sd-price__hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 0;
        }
        .sd-price__actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .btn-block {
          width: 100%;
          justify-content: center;
        }
        .sd-price__trust {
          list-style: none;
          padding: 0.25rem 0 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          border-top: 1px solid var(--border);
          padding-top: 0.875rem;
        }
        .sd-price__trust li {
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: 1.5;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .sd-price__trust li::before {
          content: '';
          display: inline-block;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--primary);
          opacity: 0.5;
          flex-shrink: 0;
          margin-top: 0.42em;
        }

        /* ──── RESPONSIVE ─────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .sd__grid {
            grid-template-columns: 1fr;
          }
          .sd__sidebar {
            position: static;
            order: -1;
          }
          .sd-price {
            padding: 1.25rem;
          }
          .sd__hero {
            height: clamp(220px, 52vw, 340px);
          }
          .sd__bread-current { max-width: 20ch; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sd-rel:hover { transform: none; }
          .sd-rel__img img { transition: none; }
        }
      `}</style>
    </>
  );
}
