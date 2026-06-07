import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowLeft, CheckCircle2, Package } from "lucide-react";
import BookingButton from "@/components/BookingButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} | АвтоСервіс`,
    description: service.short,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          width={1600}
          height={600}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white max-w-4xl">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft size={14} /> Усі послуги
          </Link>
          <span className="block text-xs uppercase tracking-widest text-teal-400 mb-2 font-medium">
            {service.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {service.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Про послугу</h2>
            <p className="text-gray-600 leading-relaxed">{service.description}</p>
          </section>

          {service.details && service.details.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Що включає</h2>
              <ul className="space-y-2">
                {service.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2
                      size={18}
                      className="text-teal-600 mt-0.5 shrink-0"
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Схожі послуги
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/services/${r.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="h-28 overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                        height={200}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-teal-700 transition-colors">
                        {r.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right — price card */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              Вартість
            </p>
            <div className="text-2xl font-bold text-teal-700 mb-1">
              {service.price}
            </div>
            {service.hours && (
              <p className="text-xs text-gray-400 mb-5">⏱ {service.hours}</p>
            )}

            {service.isPartsOrder ? (
              /* Кнопка для послуги замовлення запчастин */
              <Link
                href="/parts-order"
                className="flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
              >
                <Package size={16} />
                Замовити запчастини
              </Link>
            ) : (
              <BookingButton serviceSlug={service.slug} serviceTitle={service.title} />
            )}

            <Link
              href="/services"
              className="block w-full text-center text-gray-400 hover:text-gray-600 text-sm mt-3 transition-colors"
            >
              ← Усі послуги
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
