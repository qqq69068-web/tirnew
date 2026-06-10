import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowLeft, CheckCircle2, Package, Clock, Tag } from "lucide-react";
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
      <main className="service-detail">

        {/* ─── HERO IMAGE ───────────────────────────────────────── */}
        <div className="service-detail__hero">
          <img
            src={service.image}
            alt={service.title}
            className="service-detail__hero-img"
            width={1600}
            height={400}
            loading="eager"
          />
          <div className="service-detail__hero-overlay" aria-hidden />
          <div className="service-detail__hero-content">
            <Link href="/services" className="service-detail__back">
              <ArrowLeft size={13} aria-hidden /> Усі послуги
            </Link>
            <span className="badge badge--muted">{service.category}</span>
            <h1 className="service-detail__hero-title">{service.title}</h1>
          </div>
        </div>

        {/* ─── BODY ─────────────────────────────────────────────── */}
        <div className="service-detail__body container-narrow">

          {/* 2-col grid */}
          <div className="service-detail__grid">

            {/* Left: content */}
            <div className="service-detail__content">

              <section className="service-detail__section">
                <h2 className="service-detail__section-title">Про послугу</h2>
                <p className="service-detail__desc">{service.description}</p>
              </section>

              {service.details && service.details.length > 0 && (
                <section className="service-detail__section">
                  <h2 className="service-detail__section-title">Що включає</h2>
                  <ul className="service-detail__checklist" role="list">
                    {service.details.map((d) => (
                      <li key={d} className="service-detail__check-item">
                        <CheckCircle2 size={14} className="service-detail__check-icon" aria-hidden />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {related.length > 0 && (
                <section className="service-detail__section">
                  <h2 className="service-detail__section-title">Схожі послуги</h2>
                  <div className="service-detail__related">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/services/${r.slug}`} className="related-card">
                        <div className="related-card__img">
                          <img
                            src={r.image}
                            alt={r.title}
                            width={300}
                            height={120}
                            loading="lazy"
                          />
                        </div>
                        <div className="related-card__body">
                          <p className="related-card__title">{r.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right: price sidebar */}
            <aside className="service-detail__sidebar">
              <div className="price-card">

                <div className="price-card__header">
                  <Tag size={12} className="price-card__tag-icon" aria-hidden />
                  <span className="price-card__label">Вартість</span>
                </div>

                <div className="price-card__price">{service.price}</div>

                {service.hours && (
                  <div className="price-card__hours">
                    <Clock size={11} aria-hidden />
                    {service.hours}
                  </div>
                )}

                <div className="price-card__actions">
                  {service.isPartsOrder ? (
                    <Link href="/parts-order" className="btn btn-primary btn-block">
                      <Package size={14} aria-hidden /> Замовити запчастини
                    </Link>
                  ) : (
                    <BookingButton serviceSlug={service.slug} serviceTitle={service.title} />
                  )}
                  <Link href="/services" className="btn btn-ghost btn-block">
                    ← Усі послуги
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ─── SCOPED STYLES ───────────────────────────────────────── */}
      <style>{`
        .service-detail {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* ── HERO ───────────────────────────────────────── */
        .service-detail__hero {
          position: relative;
          height: clamp(220px, 28vw, 320px);
          overflow: hidden;
        }
        .service-detail__hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .service-detail__hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.3) 55%,
            transparent 100%
          );
        }
        .service-detail__hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: clamp(var(--space-4), 3vw, var(--space-6)) clamp(var(--space-4), 4vw, var(--space-8));
          max-width: 720px;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .service-detail__back {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: var(--text-xs);
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          width: fit-content;
          transition: color var(--transition-fast);
        }
        .service-detail__back:hover { color: rgba(255,255,255,0.9); }
        .service-detail__hero-title {
          font-family: var(--font-display);
          font-size: clamp(1.35rem, 3.5vw, 2.2rem);
          font-weight: 900;
          line-height: 1.1;
          color: #fff;
          letter-spacing: -0.01em;
        }

        /* ── BODY ─────────────────────────────────────────── */
        .service-detail__body {
          padding-block: clamp(var(--space-6), 4vw, var(--space-10));
        }
        .service-detail__grid {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: clamp(var(--space-6), 4vw, var(--space-8));
          align-items: start;
        }
        .service-detail__content {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .service-detail__section {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .service-detail__section-title {
          font-family: var(--font-display);
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text);
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--border);
        }
        .service-detail__desc {
          font-size: var(--text-sm);
          line-height: 1.75;
          color: var(--text-muted);
        }

        /* Checklist */
        .service-detail__checklist {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding: 0;
          list-style: none;
        }
        .service-detail__check-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.5;
        }
        .service-detail__check-icon {
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Related cards */
        .service-detail__related {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: var(--space-3);
        }
        .related-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          text-decoration: none;
          display: block;
          transition:
            box-shadow var(--transition-fast),
            border-color var(--transition-fast),
            transform var(--transition-spring);
        }
        .related-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--border-accent);
          transform: translateY(-2px);
        }
        .related-card__img {
          height: 90px;
          overflow: hidden;
        }
        .related-card__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .related-card:hover .related-card__img img {
          transform: scale(1.04);
        }
        .related-card__body {
          padding: var(--space-2) var(--space-3);
        }
        .related-card__title {
          font-size: var(--text-xs);
          font-weight: 500;
          color: var(--text);
          line-height: 1.4;
        }

        /* ── PRICE SIDEBAR CARD ─────────────────────────── */
        .service-detail__sidebar {
          position: sticky;
          top: 76px;
          align-self: flex-start;
        }
        .price-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .price-card__header {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        .price-card__tag-icon {
          color: var(--text-faint);
        }
        .price-card__label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-faint);
          font-weight: 700;
        }
        .price-card__price {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 900;
          color: var(--accent);
          line-height: 1;
        }
        .price-card__hours {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: var(--text-xs);
          color: var(--text-faint);
        }
        .price-card__actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding-top: var(--space-2);
          border-top: 1px solid var(--border);
        }
        .btn-block {
          width: 100%;
          justify-content: center;
        }

        /* badge override for muted */
        .badge--muted {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.85);
        }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 768px) {
          .service-detail__grid {
            grid-template-columns: 1fr;
          }
          .service-detail__sidebar {
            position: static;
            order: -1;
          }
          .price-card {
            border-radius: var(--radius);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .related-card:hover { transform: none; }
          .related-card__img img { transition: none; }
        }
      `}</style>
    </>
  );
}
