import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowLeft, CheckCircle2, Package } from "lucide-react";
import BookingButton from "@/components/BookingButton";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: `${service.title} | АвтоСервіс`, description: service.short };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = services.filter((s) => s.category === service.category && s.slug !== service.slug).slice(0, 3);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* HERO IMAGE */}
      <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
        <img src={service.image} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} width={1600} height={400} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, padding: "24px 24px", color: "#fff", maxWidth: 860 }}>
          <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 8, textDecoration: "none" }}>
            <ArrowLeft size={13} /> Усі послуги
          </Link>
          <span style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 6, fontWeight: 600 }}>{service.category}</span>
          <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.6rem)", fontWeight: 800, lineHeight: 1.15 }}>{service.title}</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 48px", display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="lg:grid-cols-3-auto">
        <div style={{ display: "grid", gap: 24 }} className="lg:[grid-template-columns:1fr_260px]">
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <section>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Про послугу</h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>{service.description}</p>
            </section>

            {service.details && service.details.length > 0 && (
              <section>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Що включає</h2>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {service.details.map((d) => (
                    <li key={d} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "var(--text-muted)" }}>
                      <CheckCircle2 size={15} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {related.length > 0 && (
              <section>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Схожі послуги</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                  {related.map((r) => (
                    <Link key={r.slug} href={`/services/${r.slug}`} style={{ background: "var(--surface)", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", textDecoration: "none", display: "block", transition: "box-shadow 0.15s" }}>
                      <div style={{ height: 90, overflow: "hidden" }}>
                        <img src={r.image} alt={r.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} width={300} height={120} loading="lazy" />
                      </div>
                      <div style={{ padding: "10px 12px" }}>
                        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)", lineHeight: 1.4 }}>{r.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Price sidebar */}
          <div style={{ position: "sticky", top: 76, alignSelf: "flex-start" }}>
            <div style={{ background: "var(--surface)", borderRadius: 12, padding: "20px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginBottom: 4 }}>Вартість</p>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)", marginBottom: 4 }}>{service.price}</div>
              {service.hours && <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 16 }}>⏱ {service.hours}</p>}

              {service.isPartsOrder ? (
                <Link href="/parts-order" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: 13, padding: "11px", borderRadius: 10, textDecoration: "none" }}>
                  <Package size={15} /> Замовити запчастини
                </Link>
              ) : (
                <BookingButton serviceSlug={service.slug} serviceTitle={service.title} />
              )}

              <Link href="/services" style={{ display: "block", textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 12, textDecoration: "none" }}>← Усі послуги</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
