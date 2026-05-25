"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowRight, Search, X } from "lucide-react";

const ALL = "Всі";

export default function ServicesPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(services.map((s) => s.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return services.filter((s) => {
      const matchCat = active === ALL || s.category === active;
      const matchQ =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.short.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, active]);

  return (
    <main className="min-h-screen bg-[#09090b]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0f1923] py-24 px-4 text-white"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1923]/40 to-[#0f1923]" />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-red-400 mb-3 font-medium">Що ми робимо</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">Наші послуги</h1>
          <p className="text-lg text-neutral-300 max-w-xl">
            Повний цикл технічного обслуговування та ремонту вантажного транспорту й причіпної техніки.
          </p>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="sticky top-[65px] z-30 bg-[#09090b]/95 backdrop-blur-lg px-4 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Пошук послуги..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                color: "#ffffff",
                caretColor: "#ffffff",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm placeholder-neutral-500 outline-none focus:ring-2 focus:ring-red-500/50 transition"
            />
            {query && (
              <button onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  active === cat
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-white/8"
                }`}
                style={active !== cat ? { border: "1px solid rgba(255,255,255,0.1)" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-neutral-500">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg">Нічого не знайдено</p>
            <button onClick={() => { setQuery(""); setActive(ALL); }}
              className="mt-4 text-sm text-red-400 hover:underline">
              Скинути фільтри
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-neutral-500 mb-6">
              {filtered.length === services.length
                ? `Усі послуги — ${filtered.length}`
                : `Знайдено: ${filtered.length}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                  className="group bg-white/4 rounded-2xl overflow-hidden hover:bg-white/7 hover:border-white/15 transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-neutral-800">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      width={800}
                      height={500}
                      loading="lazy"
                    />
                    {/* Category badge */}
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                      {s.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-red-400 transition-colors leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-neutral-400 text-xs leading-relaxed flex-1">
                      {s.short}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-teal-400">{s.price}</span>
                      <span className="text-neutral-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all">
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA */}
      <section
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        className="bg-[#0f1923] text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">Не знаєте, яка послуга потрібна?</h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          Запишіться на безкоштовну консультацію — майстер розбереться в проблемі.
        </p>
        <Link
          href="/booking"
          className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Записатись
        </Link>
      </section>
    </main>
  );
}
