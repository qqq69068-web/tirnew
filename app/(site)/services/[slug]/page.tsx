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
                  <BookingButton fullWidth defaultService={slug} />
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
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.015em;
        }
        .sd__desc {
          font-size: var(--text-base);
          color: var(--text-muted);
          line-height: 1.75;
          max-width: 62ch;
        }

        /* ──── CHECKLIST ──────────────────────────────────────────────── */
        .sd__checklist {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .sd__check-item {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          font-size: var(--text-sm);
          color: var(--text);
          line-height: 1.6;
        }
        .sd__check-dot {
          flex-shrink: 0;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--primary);
          margin-top: 0.45rem;
        }

        /* ──── RELATED ────────────────────────────────────────────── */
        .sd__related {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .sd-rel {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          text-decoration: none;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--surface);
          transition: box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .sd-rel:hover {
          box-shadow: 0 4px 16px oklch(0 0 0 / 0.07);
          border-color: var(--border-strong, var(--border));
        }
        .sd-rel__img {
          width: 90px; flex-shrink: 0;
        }
        .sd-rel__img img {
          width: 90px; height: 62px;
          object-fit: cover;
          display: block;
        }
        .sd-rel__body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem 0.5rem 0;
          gap: 0.5rem;
        }
        .sd-rel__title {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text);
          line-height: 1.4;
        }
        .sd-rel__arr {
          font-size: 1rem;
          color: var(--text-faint);
          flex-shrink: 0;
        }

        /* ──── SIDEBAR ────────────────────────────────────────────── */
        .sd__sidebar {
          position: sticky;
          top: calc(var(--nav-h, 64px) + 1.5rem);
        }
        .sd-price {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .sd-price__label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin-bottom: 0.35rem;
        }
        .sd-price__value {
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 2.5vw, 1.7rem);
          font-weight: 900;
          color: var(--text);
          letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
        }
        .sd-price__hours {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: var(--text-xs);
          color: var(--text-faint);
          margin-bottom: 0.2rem;
        }
        .sd-price__hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1rem 0;
        }
        .sd-price__actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .sd-price__trust {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .sd-price__trust li {
          font-size: var(--text-xs);
          color: var(--text-faint);
          padding-left: 1.1rem;
          position: relative;
        }
        .sd-price__trust li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--primary);
          font-size: 10px;
          top: 1px;
        }

        /* ──── MOBILE ─────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .sd__grid {
            grid-template-columns: 1fr;
          }
          .sd__sidebar {
            position: static;
            order: -1;
          }
          .sd__hero {
            height: clamp(200px, 48vw, 320px);
          }
        }

        /* ──── BTN UTILS ──────────────────────────────────────────── */
        .btn-block { width: 100%; text-align: center; }
        .btn-outline {
          border: 1.5px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          border-radius: 10px;
          padding: 0.6rem 1rem;
          font-size: var(--text-sm);
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .btn-outline:hover {
          border-color: var(--text-muted);
          color: var(--text);
        }
        .w-full { width: 100%; }
      `}</style>
    </>
  );
}
