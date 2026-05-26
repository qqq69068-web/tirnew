"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ZoomIn } from "lucide-react";

type Photo = {
  id: number;
  src: string;
  title: string;
  category: string;
  span?: "wide" | "tall" | "big";
};

const ALL = "Всі";

const photos: Photo[] = [
  { id: 1,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4b7ff1d1e9c7337632543ebc2f5e043734922980.jpg", title: "Ремонт двигуна",              category: "Двигун",        span: "big"  },
  { id: 2,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/9e5670c83836bb4d566263a45cbe465a73ddb034.jpg", title: "Розбірання КПП",               category: "Трансмісія",   span: "wide" },
  { id: 3,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/98afea8526d7957b5b407040e0373b0e62216e98.jpg", title: "Редуктор ведучого мосту",      category: "Трансмісія"            },
  { id: 4,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8daee9beb5e07ab91c97ad77d6dc174ce24ecbc7.jpg", title: "Форсунки Common Rail",        category: "Паливна система"         },
  { id: 5,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0fa10922b0bc4e9125e79d6d96568277a3ec3dbd.jpg", title: "Пневматична система",         category: "Пневмосистема",  span: "tall" },
  { id: 6,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7bc67c17dd5214fc636d2874e1fcee6a486a3f5b.jpg", title: "Заміна шкворнів",              category: "Ходова частина"          },
  { id: 7,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ed36e7694584bb9fb76bcf1a8ec9113cdf9ca1f7.jpg", title: "Діагностика AutoCom",           category: "Діагностика",   span: "wide" },
  { id: 8,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/2b10e63c94d90664b7587d2f543d5f8523a5b782.jpg", title: "Діагностика VOLVO VOCOM",       category: "Діагностика"              },
  { id: 9,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c2a33e08240f6e17925d6636ea99aebbd0d47aff.jpg", title: "Заміна масла",                  category: "ТО"                          },
  { id: 10, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4b96506b9c1e24cef4e01a1a1bc5f506be36f486.jpg", title: "Наклепка накладок BERAL",          category: "Гальмівна система"        },
  { id: 11, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/b06a6716fffc58971cf31faf05e62f2923e9a829.jpg", title: "Калібрування ECAS",             category: "Пневмосистема"              },
  { id: 12, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/e8a5629e6d7036422ee0cfa20261579d24a8f295.jpg", title: "Ремонт підвіски",               category: "Ходова частина",   span: "big"  },
  { id: 13, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/84f9033f2f5efc24deda487fb7122d243f40e055.jpg", title: "ТО причепів",                   category: "Причіпна техніка"         },
  { id: 14, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/14c3a40c51eeb0f15a66e5c4d7e3637b62c26c7b.jpg", title: "Розвал-сходження Trommelberg",   category: "Діагностика",   span: "wide" },
];

const categories = [ALL, ...Array.from(new Set(photos.map((p) => p.category)))];

export default function GalleryPage() {
  const [active, setActive] = useState(ALL);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const filtered = active === ALL ? photos : photos.filter((p) => p.category === active);

  return (
    <main className="min-h-screen bg-[#09090b]">

      {/* HERO */}
      <section className="relative overflow-hidden py-20 px-4 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,38,38,0.12) 0%, transparent 70%)" }}
        />
        <p className="relative text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">Наші роботи</p>
        <h1 className="relative text-4xl md:text-5xl font-black text-white mb-4">Галерея</h1>
        <p className="relative text-neutral-400 max-w-md mx-auto">
          Фотозвіт виконаних робіт — ремонти, діагностика, технічне обслуговування.
        </p>
      </section>

      {/* FILTERS */}
      <section className="sticky top-[65px] z-30 bg-[#09090b]/95 backdrop-blur-lg px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap">
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
          <span className="ml-auto text-xs text-neutral-600 self-center">{filtered.length} фото</span>
        </div>
      </section>

      {/* MASONRY GRID */}
      <section className="max-w-6xl mx-auto px-4 py-10 pb-20">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gridAutoRows: "200px",
          }}
        >
          {filtered.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setLightbox(photo)}
              className="group relative overflow-hidden rounded-2xl bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              style={{
                gridColumn: photo.span === "wide" || photo.span === "big" ? "span 2" : "span 1",
                gridRow:    photo.span === "tall" || photo.span === "big" ? "span 2" : "span 1",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-sm font-semibold leading-snug">{photo.title}</p>
                <p className="text-neutral-400 text-xs mt-0.5">{photo.category}</p>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-1.5">
                  <ZoomIn size={14} className="text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white/60 hover:text-white transition"
            aria-label="Закрити"
          >
            <X size={28} />
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.title}
              className="w-full h-full object-contain max-h-[75vh]"
            />
            <div
              style={{ background: "rgba(9,9,11,0.9)" }}
              className="px-6 py-4"
            >
              <p className="text-white font-semibold">{lightbox.title}</p>
              <p className="text-neutral-400 text-sm mt-0.5">{lightbox.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        className="bg-[#0f1923] text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">Хочете так само?</h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          Зв'ідуйтесь з нами — зробимо ваш автомобіль так само.
        </p>
        <Link href="/contacts" className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-full transition-colors">
          Зв'язатись
        </Link>
      </section>
    </main>
  );
}
