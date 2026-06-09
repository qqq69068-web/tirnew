import Link from "next/link";
import { services, HOUR_RATE_MIN, HOUR_RATE_MAX } from "@/lib/services";
import { Clock, Wrench, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Прайс на роботи — TIR Truck Service",
  description: "Вартість ремонтних робіт для вантажних автомобілів і причепів.",
};

const categories = Array.from(new Set(services.map((s) => s.category)));

export default function PricePage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "64px 16px 56px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.85))" }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--primary)", marginBottom: 10 }}>Вартість робіт</p>
          <h1 style={{ fontSize: "clamp(1.9rem,5vw,3rem)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>Прайс на послуги</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 480 }}>
            Вартість розраховується за нормогодинами. Кінцева ціна — після огляду та дефектації.
          </p>
          <div style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 14, padding: "12px 20px", backdropFilter: "blur(8px)" }}>
            <Clock size={20} style={{ color: "var(--primary)" }} />
            <div>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Нормогодина</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{HOUR_RATE_MIN}–{HOUR_RATE_MAX} <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>грн</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* NOTE */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px 0" }}>
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "var(--text-muted)" }}>
          <span style={{ marginTop: 1 }}>ℹ️</span>
          <p>Ціни вказані орієнтовно на основі нормогодин. Точна вартість — після огляду. Запчастини оплачуються окремо.</p>
        </div>
      </div>

      {/* PRICE TABLES */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
        {categories.map((cat) => {
          const items = services.filter((s) => s.category === cat);
          return (
            <div key={cat} style={{ background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <Wrench size={14} style={{ color: "var(--primary)" }} />
                <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{cat}</h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 14px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)" }}>Послуга</th>
                    <th style={{ textAlign: "center", padding: "8px 10px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", whiteSpace: "nowrap" }}>Н/год</th>
                    <th style={{ textAlign: "right", padding: "8px 14px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", whiteSpace: "nowrap" }}>Вартість</th>
                    <th style={{ padding: "8px 10px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s, i) => (
                    <tr key={s.slug} style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "10px 14px" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{s.title}</p>
                        <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>{s.short}</p>
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)", background: "var(--surface2)", borderRadius: 99, padding: "3px 10px", border: "1px solid var(--border)" }}>
                          <Clock size={10} />{s.hours}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right" }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{s.price}</p>
                        <p style={{ fontSize: 12, color: "var(--text-faint)" }}>до {s.priceMax.toLocaleString("uk-UA")} грн</p>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <Link href={`/services/${s.slug}`} style={{ color: "var(--text-faint)", display: "flex" }}>
                          <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "40px 16px", textAlign: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Потрібен точний розрахунок?</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 360, margin: "0 auto 20px" }}>
          Привезіть авто на огляд — майстер визначить обсяг робіт і озвучить фінальну ціну.
        </p>
        <Link href="/contacts" style={{ display: "inline-block", background: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: 13, padding: "10px 26px", borderRadius: 99, textDecoration: "none" }}>
          Записатись на огляд
        </Link>
      </section>
    </main>
  );
}
