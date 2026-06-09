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
    <main style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=80"
            alt="Truck service"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.22) saturate(0.5)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.75) 60%, var(--bg) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 10% 60%, rgba(220,38,38,0.2) 0%, transparent 70%)" }} />
        </div>

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "96px 20px 112px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(220,38,38,0.35)", background: "rgba(220,38,38,0.12)", borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fca5a5" }}>TIR Truck Service</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem,6vw,4.5rem)", fontWeight: 800, lineHeight: 1.07, letterSpacing: "-0.02em", color: "#fff", maxWidth: 720 }}>
            Сервіс
            <span style={{ color: "#ef4444" }}> вантажних</span>
            <br />автомобілів та причепів
          </h1>

          <p style={{ marginTop: 24, maxWidth: 520, fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.65)" }}>
            Діагностика, ремонт, пневмосистеми, електрика й трансмісія для
            комерційного транспорту. Власний склад запчастин.
          </p>

          <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Link href="/contacts" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 28px", borderRadius: 99, background: "#dc2626", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              Зв&apos;язатись з нами <ChevronRight size={16} />
            </Link>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 28px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Переглянути послуги
            </Link>
          </div>

          <div style={{ marginTop: 64, paddingTop: 32, borderTop: 