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
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", transition: "background 0.25s, color 0.2s" }}>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "56px 16px 48px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1 }} />
        <div style={{ position: "absolute", inset: 0, background: "var(--hero-overlay)" }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--primary)", marginBottom: 8 }}>Вартість робіт</p>
          <h1 style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 800, color: "var(--hero-text)", marginBottom: 10 }}>Прайс на послуги</h1>
          <p style={{ fontSize: 14, color: "var(--hero-text-sub)", maxWidth: 460 }}>
            Вартість розраховується за нормогодинами. Кінцева ціна — після огляду та дефектації.
          </p>
          <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 12, background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 12, padding: "10px 18px" }}>
            <Clock size={18} style={{ color: "var(--primary)" }} />
            <div>
              <p style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Нормогодина</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>{HOUR_RATE_MIN}–{HOUR_RATE_MAX} <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}>грн</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* NOTE */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 0" }}>
        <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.22)", borderRadius: 9, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12, color: "var(--text-muted)" }}>
          <span style={{ marginTop: 1 }}>ℹ️</span>
          <p>Ціни вказані орієнтовно на основі нормогодин. Точна вартість — після огляду. Запчастини оплачуються окремо.</p>
        </div>
      </div>

      {/* PRICE TABLES */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 36px", display: "flex", flexDirection: "column", gap: 16 }}>
        {categories.map((cat) => {
          const items = services.filter((s) => s.category === cat);
          return (
            <div key={cat} style={{ background: "var(--surface)", borderRadius: 11, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-sm)", transition: "background 0.25s" }}>
              <div style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)", padding: "9px 14px", display: "flex", alignItems: "center", gap: 7, transition: "background 0.25s" }}>
                <Wrench size={13} style={{ color: "var(--primary)" }} />
                <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{cat}</h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "7px 13px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)" }}>Послуга</th>
                    <th style={{ textAlign: "center", padding: "7px 9px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", whiteSpace: "nowrap" }}>Н/год</th>
                    <th style={{ textAlign: "right", padding: "7px 13px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", whiteSpace: "nowrap" }}>Вартість</th>
                    <th style={{ padding: "7px 9px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s, i) => (
                    <tr key={s.slug} style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "9px 13px" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{s.title}</p>
                        <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 1 }}>{s.short}</p>
                      </td>
                      <td style={{ padding: "9px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--text-muted)", background: "var(--surface2)", borderRadius: 99, padding: "2px 9px", border: "1px solid var(--border)" }}>
                          <Clock size={9} />{s.hours}
                        </span>
                      </td>
                      <td style={{ padding: "9px 13px", textAlign: "right" }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{s.price}</p>
                        <p style={{ fontSize: 11, color: "var(--text-faint)" }}>до {s.priceMax.toLocaleString("uk-UA")} грн</p>
                      </td>
                      <td style={{ padding: "9px" }}>
                        <Link href={`/services/${s.slug}`} style={{ color: "var(--text-faint)", display: "flex" }}>
                          <ChevronRight size={15} />
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
      <section style={{ padding: "0 16px 36px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "32px 28px", textAlign: "center" }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--text)", marginBottom: 7 }}>Потрібен точний розрахунок?</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 340, margin: "0 auto 18px" }}>
            Привезіть авто на огляд — майстер визначить обсяг робіт і озвучить фінальну ціну.
          </p>
          <Link href="/contacts" style={{ display: "inline-block", background: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: 13, padding: "10px 24px", borderRadius: 99, textDecoration: "none" }}>
            Записатись на огляд
          </Link>
        </div>
      </section>
    </div>
  );
}
