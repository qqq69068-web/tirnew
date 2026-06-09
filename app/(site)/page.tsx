"use client";

import Link from "next/link";
import { services } from "@/lib/services";
import { Wrench, Zap, Clock, Shield, ChevronRight, Phone, ArrowRight } from "lucide-react";

const categories = Array.from(new Set(services.map((s) => s.category)));

const stats = [
  { value: "20+",               label: "Років досвіду" },
  { value: services.length + "+", label: "Видів послуг" },
  { value: "5 000+",            label: "Виконаних ремонтів" },
  { value: "24/7",              label: "Підтримка" },
];

const advantages = [
  { icon: Wrench, title: "Власний склад запчастин",  desc: "Великий асортимент оригінальних і аналогових деталей — мінімальний простій техніки." },
  { icon: Zap,    title: "Швидка діагностика",       desc: "AutoCom, VOCOM, WABCO — точно виявляємо несправність за лічені хвилини." },
  { icon: Clock,  title: "Оперативний ремонт",       desc: "Досвідчені майстри та налагоджені процеси — мінімальний час простою." },
  { icon: Shield, title: "Гарантія якості",          desc: "Гарантуємо якість усіх виконаних робіт і встановлених запчастин." },
];

const featured = services.slice(0, 3);

export default function HomePage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--text)", transition: "background 0.25s, color 0.2s" }}>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=80"
            alt="Truck service"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45) saturate(0.6)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "var(--hero-overlay)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 10% 60%, rgba(220,38,38,0.15) 0%, transparent 70%)" }} />
        </div>

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "80px 20px 96px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--hero-badge-border)", background: "var(--hero-badge-bg)", borderRadius: 99, padding: "5px 14px", marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--hero-badge-text)" }}>TIR Truck Service</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem,6vw,4.2rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--hero-text)", maxWidth: 680 }}>
            Сервіс
            <span style={{ color: "var(--primary)" }}> вантажних</span>
            <br />автомобілів та причепів
          </h1>

          <p style={{ marginTop: 18, maxWidth: 500, fontSize: 16, lineHeight: 1.65, color: "var(--hero-text-sub)" }}>
            Діагностика, ремонт, пневмосистеми, електрика й трансмісія для
            комерційного транспорту. Власний склад запчастин.
          </p>

          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/contacts" style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 44, padding: "0 24px", borderRadius: 99, background: "#dc2626", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Зв&apos;язатись з нами <ChevronRight size={15} />
            </Link>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 44, padding: "0 24px", borderRadius: 99, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Переглянути послуги
            </Link>
          </div>

          {/* Stats */}
          <div style={{ marginTop: 52, paddingTop: 24, borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: "0 32px", width: "fit-content" }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, whiteSpace: "nowrap" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section style={{ padding: "0 20px", transition: "background 0.25s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 24px", marginTop: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {advantages.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(220,38,38,0.09)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <Icon size={17} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.3rem,3vw,1.7rem)", fontWeight: 800, color: "var(--text)" }}>Популярні послуги</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Найчастіші запити від наших клієнтів</p>
          </div>
          <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Всі послуги <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {featured.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "18px 18px",
                textDecoration: "none",
                display: "block",
                transition: "box-shadow 0.18s, border-color 0.18s",
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{s.title}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 12 }}>{s.short}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>{s.price}</span>
                <ArrowRight size={14} style={{ color: "var(--text-faint)" }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "0 20px", transition: "background 0.25s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px 24px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Категорії послуг</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((cat) => (
              <Link key={cat} href="/services" style={{
                padding: "6px 14px", borderRadius: 99,
                border: "1px solid var(--border-strong)",
                background: "var(--surface)",
                fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
                textDecoration: "none",
              }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px" }}>
        <div style={{ background: "var(--surface)", borderRadius: 14, border: "1px solid var(--border)", padding: "32px 28px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.2rem,3vw,1.5rem)", fontWeight: 800, color: "var(--text)" }}>Готові записатись на ремонт?</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, maxWidth: 420 }}>Подзвоніть або залиште заявку — майстер зателефонує й підбере зручний час.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="tel:+380664188826" style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 42, padding: "0 20px", borderRadius: 99, border: "1px solid var(--border-strong)", background: "var(--surface2)", color: "var(--text)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <Phone size={14} /> Зателефонувати
            </a>
            <Link href="/contacts" style={{ display: "inline-flex", alignItems: "center", height: 42, padding: "0 22px", borderRadius: 99, background: "var(--primary)", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Залишити заявку
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
