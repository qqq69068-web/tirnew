"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowRight, CheckCircle2, Package, Truck, Car } from "lucide-react";

const tirServices = services.filter((s) => s.vehicleType === "truck");
const carServices = services.filter((s) => s.vehicleType === "car");

export default function ServicesPage() {
  const [tab, setTab] = useState<"tir" | "car">("tir");

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", transition: "background 0.25s, color 0.2s" }}>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "56px 16px 48px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12 }} />
        <div style={{ position: "absolute", inset: 0, background: "var(--hero-overlay)" }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--primary)", marginBottom: 8 }}>Що ми робимо</p>
          <h1 style={{ fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 800, lineHeight: 1.1, color: "var(--hero-text)", marginBottom: 10 }}>Наші послуги</h1>
          <p style={{ fontSize: 14, color: "var(--hero-text-sub)", maxWidth: 460, margin: "0 auto" }}>
            Повний цикл ремонту та обслуговування вантажного транспорту, причіпної техніки та легкових автомобілів.
          </p>
        </div>
      </section>

      {/* TABS */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 54, zIndex: 30, transition: "background 0.25s" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px", display: "flex" }}>
          {(["tir", "car"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "11px 18px",
              fontSize: 13, fontWeight: 600,
              borderBottom: `2px solid ${tab === t ? "var(--primary)" : "transparent"}`,
              color: tab === t ? "var(--primary)" : "var(--text-muted)",
              background: "none", border: "none",
              cursor: "pointer", transition: "color 0.15s",
            }}>
              {t === "tir" ? <Truck size={14} /> : <Car size={14} />}
              {t === "tir" ? "Вантажні / ТІР" : "Легкові"}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>
            {tab === "tir" ? "Вантажні автомобілі і ТІР" : "Легкові автомобілі"}
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {tab === "tir" ? "Повний перелік послуг для вантажного транспорту та причіпної техніки" : "Повний перелік послуг для легкового транспорту"}
          </p>
        </div>

        <ul style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 20 }}>
          {(tab === "tir" ? tirServices : carServices).map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "var(--surface)", borderRadius: 9,
                padding: "10px 14px",
                border: "1px solid var(--border)",
                textDecoration: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <CheckCircle2 size={15} style={{ color: "var(--accent)", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: "var(--text)" }}>{s.title}</span>
                <ArrowRight size={13} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
              </Link>
            </li>
          ))}
        </ul>

        {/* Parts card */}
        <Link href="/parts-order" style={{
          display: "flex", alignItems: "center", gap: 14,
          background: "var(--surface2)", borderRadius: 11,
          padding: "14px 18px",
          border: "1px solid var(--border)",
          textDecoration: "none",
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 9, background: "rgba(15,118,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Package size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Замовлення запчастин через нашу фірму</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Підберемо оригінал або перевірений аналог, організуємо доставку</p>
          </div>
          <span style={{ color: "var(--accent)", fontSize: 16 }}>→</span>
        </Link>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "36px 16px", textAlign: "center", transition: "background 0.25s" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 7 }}>Не знаєте, яка послуга потрібна?</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, maxWidth: 340, margin: "0 auto 20px" }}>
          Зв&apos;яжіться з нами — майстер підкаже та запише на зручний час.
        </p>
        <Link href="/contacts" style={{ display: "inline-block", background: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: 13, padding: "10px 26px", borderRadius: 99, textDecoration: "none" }}>
          Зв&apos;язатись з нами
        </Link>
      </section>
    </main>
  );
}
