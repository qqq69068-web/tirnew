"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowRight, CheckCircle2, Package, Truck, Car } from "lucide-react";

const tirServices = services.filter((s) => s.vehicleType === "truck");
const carServices = services.filter((s) => s.vehicleType === "car");

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    el.querySelectorAll(".reveal").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function ServicesPage() {
  const [tab, setTab] = useState<"tir" | "car">("tir");
  const ref = useReveal();
  const list = tab === "tir" ? tirServices : carServices;

  return (
    <div ref={ref} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", transition: "background 0.25s, color 0.2s" }}>

      {/* HERO — compact */}
      <section style={{ position: "relative", overflow: "hidden", padding: "36px 20px 30px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12 }} />
        <div style={{ position: "absolute", inset: 0, background: "var(--hero-overlay)" }} />
        <div className="container fade-in" style={{ position: "relative", textAlign: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--primary)", marginBottom: 7 }}>Що ми робимо</p>
          <h1 style={{ fontSize: "clamp(1.5rem,3.5vw,2.1rem)", fontWeight: 800, lineHeight: 1.15, color: "var(--hero-text)", marginBottom: 9 }}>Наші послуги</h1>
          <p style={{ fontSize: 13, color: "var(--hero-text-sub)", maxWidth: 440, margin: "0 auto" }}>
            Повний цикл ремонту та обслуговування вантажного транспорту, причіпної техніки та легкових автомобілів.
          </p>
        </div>
      </section>

      {/* TABS */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 54, zIndex: 30, transition: "background 0.25s" }}>
        <div className="container" style={{ display: "flex" }}>
          {(["tir", "car"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tab-btn ${tab === t ? "active" : ""}`}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "11px 18px",
                fontSize: 13, fontWeight: 600,
                color: tab === t ? "var(--primary)" : "var(--text-muted)",
                background: "none", border: "none",
                cursor: "pointer",
                borderRadius: "6px 6px 0 0",
              }}
            >
              {t === "tir" ? <Truck size={13} /> : <Car size={13} />}
              {t === "tir" ? "Вантажні / ТІР" : "Легкові"}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <section className="container" style={{ padding: "28px 20px" }}>
        <div className="reveal" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 3 }}>
            {tab === "tir" ? "Вантажні автомобілі і ТІР" : "Легкові автомобілі"}
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {tab === "tir" ? "Повний перелік послуг для вантажного транспорту та причіпної техніки" : "Повний перелік послуг для легкового транспорту"}
          </p>
        </div>

        <ul style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 20 }}>
          {list.map((s, i) => (
            <li key={s.slug} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
              <Link
                href={`/services/${s.slug}`}
                className="service-row"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "var(--surface)", borderRadius: 9,
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                <CheckCircle2 size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: "var(--text)" }}>{s.title}</span>
                <ArrowRight size={13} style={{ color: "var(--text-faint)", flexShrink: 0, transition: "transform 0.2s" }} />
              </Link>
            </li>
          ))}
        </ul>

        {/* Parts card */}
        <Link href="/parts-order" className="card-hover reveal" style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "var(--surface2)", borderRadius: 10,
          padding: "14px 16px",
          border: "1px solid var(--border)",
          textDecoration: "none",
          marginBottom: 24,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(15,118,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Package size={16} style={{ color: "var(--accent)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Замовлення запчастин через нашу фірму</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>Підберемо оригінал або перевірений аналог, організуємо доставку</p>
          </div>
          <span style={{ color: "var(--accent)", fontSize: 15 }}>→</span>
        </Link>

        {/* CTA card */}
        <div className="reveal" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "28px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 7 }}>Не знаєте, яка послуга потрібна?</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16, maxWidth: 320, margin: "0 auto 16px" }}>
            Зв&apos;яжіться з нами — майстер підкаже та запише на зручний час.
          </p>
          <Link href="/contacts" className="btn-animate" style={{ display: "inline-block", background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 26px", borderRadius: 99, textDecoration: "none" }}>
            Зв&apos;язатись з нами
          </Link>
        </div>
      </section>
    </div>
  );
}
