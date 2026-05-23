"use client";

import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowRight } from "lucide-react";

export default function ServicesPage() {
  // Group by category
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      {/* Hero */}
      <section className="relative bg-[#0f1923] text-white py-24 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f1923]/80" />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-teal-400 mb-3 font-medium">
            Що ми робимо
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
            Наші послуги
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Повний цикл технічного обслуговування та ремонту вантажного
            транспорту й причіпної техніки.
          </p>
        </div>
      </section>

      {/* Services by category */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {categories.map((cat) => {
          const items = services.filter((s) => s.category === cat);
          return (
            <div key={cat}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-6 border-b border-teal-100 pb-2">
                {cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={800}
                        height={500}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors leading-snug">
                        {s.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed flex-1">
                        {s.short}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{s.price}</span>
                        <span className="text-teal-600 group-hover:translate-x-1 transition-transform">
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="bg-teal-700 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">Не знаєте, яка послуга потрібна?</h2>
        <p className="text-teal-100 mb-8 max-w-md mx-auto">
          Запишіться на безкоштовну консультацію — майстер розбереться в проблемі.
        </p>
        <Link
          href="/booking"
          className="inline-block bg-white text-teal-700 font-semibold px-8 py-3 rounded-full hover:bg-teal-50 transition-colors"
        >
          Записатись
        </Link>
      </section>
    </main>
  );
}
