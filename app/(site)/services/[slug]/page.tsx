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

        {/* ─── HERO ────────────────────────────────────────────────── */}
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

        {/* ─── BREADCRUMB ───────────────────────────────────────── */}
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

        {/* ─── BODY ────────────────────────────────────────────────── */}
        <div className="sd__body container">
          <div className="sd__grid">

            {/* LEFT: content */}
            <div className="sd__content">

              {service.description && (
                <section className="sd__section">
                  <h2 className="sd__section-title">Про послугу</h2>
                  <p className="sd__text">{service.description}</p>
                </section>
              )}

              {service.details && service.details.length > 0 && (
                <section className="sd__section">
                  <h2 className="sd__section-title">Що включає</h2>
                  <ul className="sd__list">
                    {service.details.map((d, i) => (
                      <li key={i} className="sd__list-item">{d}</li>
                    ))}
                  </ul>
                </section>
              )}

              {related.length > 0 && (
                <section className="sd__section">
                  <h2 className="sd__section-title">Схожі послуги</h2>
                  <div className="sd__related">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/services/${r.slug}`} className="sd__related-card">
                        <img src={r.image} alt={r.title} width={280} height={160}
                          loading="lazy" className="sd__related-img" />
                        <div className="sd__related-body">
                          <p className="sd__related-title">{r.title}</p>
                          <p className="sd__related-price">від {r.priceMin.toLocaleString("uk-UA")} грн</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* RIGHT: price card */}
            <aside className="sd__price-card">
              <p className="sd__price-label">♢ ВАРТІСТЬ</p>
              <p className="sd__price-value">
                від {service.priceMin.toLocaleString("uk-UA")} грн
              </p>
              {service.hours && (
                <div className="sd-price__meta">
                  <Clock size={11} aria-hidden />
                  <span>{service.hours}</span>
                </div>
              )}

              <hr className="sd-price__hr" />

              <div className="sd-price__actions">
                {/* Модальна кнопка — передає slug послуги */}
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
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
