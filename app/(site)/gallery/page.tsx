"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ZoomIn } from "lucide-react";

type Photo = { id: number; src: string; title: string; category: string; span?: "wide" | "tall" | "big" };

const ALL = "Всі";

const photos: Photo[] = [
  { id: 1,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4b7ff1d1e9c7337632543ebc2f5e043734922980.jpg", title: "Ремонт двигуна", category: "Двигун", span: "big" },
  { id: 2,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/9e5670c83836bb4d566263a45cbe465a73ddb034.jpg", title: "Розбірання КПП", category: "Трансмісія", span: "wide" },
  { id: 3,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/98afea8526d7957b5b407040e0373b0e62216e98.jpg", title: "Редуктор ведучого мосту", category: "Трансмісія" },
  { id: 4,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8daee9beb5e07ab91c97ad77d6dc174ce24ecbc7.jpg", title: "Форсунки Common Rail", category: "Паливна система" },
  { id: 5,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0fa10922b0bc4e9125e79d6d96568277a3ec3dbd.jpg", title: "Пневматична система", category: "Пневмосистема", span: "tall" },
  { id: 6,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7bc67c17dd5214fc636d2874e1fcee6a486a3f5b.jpg", title: "Заміна шкворнів", category: "Ходова частина" },
  { id: 7,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ed36e7694584bb9fb76bcf1a8ec9113cdf9ca1f7.jpg", title: "Діагностика AutoCom", category: "Діагностика", span: "wide" },
  { id: 8,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/2b10e63c94d90664b7587d2f543d5f8523a5b782.jpg", title: "Діагностика VOLVO VOCOM", category: "Діагностика" },
  { id: 9,  src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c2a33e08240f6e17925d6636ea99aebbd0d47aff.jpg", title: "Заміна масла", category: "ТО" },
  { id: 10, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4b96506b9c1e24cef4e01a1a1bc5f506be36f486.jpg", title: "Наклепка накладок BERAL", category: "Гальмівна система" },
  { id: 11, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/b06a6716fffc58971cf31faf05e62f2923e9a829.jpg", title: "Калібрування ECAS", category: "Пневмосистема" },
  { id: 12, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/e8a5629e6d7036422ee0cfa20261579d24a8f295.jpg", title: "Ремонт підвіски", category: "Ходова частина", span: "big" },
  { id: 13, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/84f9033f2f5efc24deda487fb7122d243f40e055.jpg", title: "ТО причепів", category: "Причіпна техніка" },
  { id: 14, src: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/14c3a40c51eeb0f15a66e5c4d7e3637b62c26c7b.jpg", title: "Розвал-сходження Trommelberg", category: "Діагностика", span: "wide" },
];

const categories = [ALL, ...Array.from(new Set(photos.map((p) => p.category)))];

export default function GalleryPage() {
  const [active, setActive] = useState(ALL);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const filtered = active === ALL ? photos : photos.filter((p) => p.category === active);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "56px 16px 48px", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,38,38,0.07) 0%, transparent 70%)" }} />
        <p style={{ position: "relative", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--primary)", marginBottom: 10 }}>Наші роботи</p>
        <h1 style={{ position: "relative", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>Галерея</h1>
        <p style={{ position: "relative", fontSize: 14, color: "var(--text-muted)", maxWidth: 380, margin: "0 auto" }}>
          Фотозвіт виконаних робіт — ремонти, діагностика, технічне обслуговування.
        </p>
      </section>

      {/* FILTERS */}
      <section style={{ position: "sticky", top: 58, zIndex: 30, background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "10px 16px", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
              border: active === cat ? "1px solid var(--primary)" : "1px solid var(--border)",
              background: active === cat ? "var(--primary)" : "var(--surface2)",
              color: active === cat ? "#fff" : "var(--text-muted)",
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
            }}>{cat}</button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-faint)" }}>{filtered.length} фото</span>
        </div>
      </section>

      {/* GRID */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 40px" }}>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gridAutoRows: 190 }}>
          {filtered.map((photo) => (
            <button key={photo.id} onClick={() => setLightbox(photo)} style={{
              position: "relative", overflow: "hidden", borderRadius: 10,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              gridColumn: photo.span === "wide" || photo.span === "big" ? "span 2" : "span 1",
              gridRow: photo.span === "tall" || photo.span === "big" ? "span 2" : "span 1",
              cursor: "pointer",
            }}>
              <img src={photo.src} alt={photo.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9, transition: "opacity 0.3s, transform 0.4s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "scale(1)"; }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)", opacity: 0, transition: "opacity 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = "0"} />
              <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{photo.title}</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{photo.category}</p>
              </div>
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                <div style={{ background: "rgba(0,0,0,0.45)", borderRadius: 7, padding: 5, backdropFilter: "blur(4px)" }}>
                  <ZoomIn size={13} style={{ color: "#fff" }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.88)" }} onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 16, right: 16, color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }} aria-label="Закрити">
            <X size={26} />
          </button>
          <div style={{ position: "relative", maxWidth: 900, width: "100%", borderRadius: 14, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.title} style={{ width: "100%", maxHeight: "75vh", objectFit: "contain" }} />
            <div style={{ background: "rgba(0,0,0,0.85)", padding: "14px 20px" }}>
              <p style={{ color: "#fff", fontWeight: 600 }}>{lightbox.title}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{lightbox.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "48px 16px", textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Хочете так само?</h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 320, margin: "0 auto 20px" }}>Зв&apos;яжіться з нами — зробимо так само.</p>
        <Link href="/contacts" style={{ display: "inline-block", background: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: 13, padding: "10px 26px", borderRadius: 99, textDecoration: "none" }}>Зв&apos;язатись</Link>
      </section>
    </main>
  );
}
