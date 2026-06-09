"use client";
import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, User, Sun, Moon } from "lucide-react";

const links = [
  { href: "/",         label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/price",    label: "Прайс" },
  { href: "/gallery",  label: "Галерея" },
  { href: "/contacts", label: "Контакти" },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState<boolean | null>(null);
  const [dark, setDark]     = useState(false);
  const pathname = usePathname();

  // Init theme from localStorage or system preference
  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => setIsClient(r.ok))
      .catch(() => setIsClient(false));
  }, [pathname]);

  const cabinetLabel     = isClient ? "Кабінет" : "Увійти";
  const cabinetLabelFull = isClient ? "Особистий кабінет" : "Увійти / Реєстрація";

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "var(--nav-bg-scroll)" : "var(--nav-bg)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        transition: "background 0.25s, box-shadow 0.25s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#dc2626,#991b1b)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>T</span>
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text)" }}>Tirnew</div>
              <div style={{ fontSize: 10, color: "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8 }}>Truck Service</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} style={{
                padding: "6px 14px",
                borderRadius: "var(--radius)",
                fontSize: 14,
                fontWeight: 500,
                color: pathname === l.href ? "var(--primary)" : "var(--text-muted)",
                background: pathname === l.href ? "rgba(220,38,38,0.08)" : "transparent",
                transition: "background 0.15s, color 0.15s",
                textDecoration: "none",
              }}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="tel:+380664188826" className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.15s" }}>
              <Phone size={13} />
              <span>+380 66 418 88 26</span>
            </a>

            {/* Theme toggle */}
            <button onClick={toggleTheme} title={dark ? "Світла тема" : "Темна тема"} style={{
              width: 34, height: 34, borderRadius: 8,
              border: "1px solid var(--border-strong)",
              background: "var(--surface)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)",
              transition: "background 0.2s, color 0.2s",
              cursor: "pointer",
            }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <Link href="/cabinet" className="hidden md:inline-flex" style={{
              height: 34, padding: "0 14px",
              borderRadius: 8,
              border: `1px solid ${pathname === "/cabinet" || isClient ? "var(--accent)" : "var(--border-strong)"}`,
              background: pathname === "/cabinet" || isClient ? "rgba(15,118,110,0.08)" : "var(--surface)",
              color: pathname === "/cabinet" || isClient ? "var(--accent)" : "var(--text-muted)",
              fontSize: 13,
              fontWeight: 500,
              display: "flex", alignItems: "center", gap: 6,
              textDecoration: "none",
              transition: "all 0.15s",
            }}>
              <User size={13} />
              {cabinetLabel}
            </Link>

            <Link href="/contacts" className="hidden md:inline-flex" style={{
              height: 34, padding: "0 16px",
              borderRadius: 99,
              background: "var(--primary)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              display: "flex", alignItems: "center",
              textDecoration: "none",
              transition: "background 0.15s",
            }}>
              Зв&apos;язатись
            </Link>

            {/* Burger */}
            <button onClick={() => setOpen(!open)} className="flex md:hidden" style={{
              width: 34, height: 34, borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)",
            }} aria-label="Меню">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "12px 16px 16px" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius)",
                  fontSize: 14, fontWeight: 500,
                  color: pathname === l.href ? "var(--primary)" : "var(--text)",
                  background: pathname === l.href ? "rgba(220,38,38,0.07)" : "transparent",
                  textDecoration: "none",
                }}>
                  {l.label}
                </Link>
              ))}
              <Link href="/cabinet" style={{
                padding: "10px 14px", borderRadius: "var(--radius)",
                fontSize: 14, fontWeight: 500,
                color: isClient ? "var(--accent)" : "var(--text)",
                display: "flex", alignItems: "center", gap: 8,
                textDecoration: "none",
              }}>
                <User size={15} /> {cabinetLabelFull}
              </Link>

              {/* Theme toggle in mobile */}
              <button onClick={toggleTheme} style={{
                padding: "10px 14px", borderRadius: "var(--radius)",
                fontSize: 14, fontWeight: 500,
                color: "var(--text-muted)",
                display: "flex", alignItems: "center", gap: 8,
                textAlign: "left",
              }}>
                {dark ? <Sun size={15} /> : <Moon size={15} />}
                {dark ? "Світла тема" : "Темна тема"}
              </button>

              <a href="tel:+380664188826" style={{
                marginTop: 8, height: 42, borderRadius: "var(--radius)",
                border: "1px solid var(--border-strong)",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, fontSize: 14, color: "var(--text)", textDecoration: "none",
              }}>
                <Phone size={14} /> +380 66 418 88 26
              </a>
              <Link href="/contacts" style={{
                marginTop: 6, height: 42, borderRadius: "var(--radius)",
                background: "var(--primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none",
              }}>
                Зв&apos;язатись з нами
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* PAGE */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        marginTop: "auto",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 32 }}>

            {/* Brand */}
            <div style={{ gridColumn: "span 2" }}>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#dc2626,#991b1b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>T</span>
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text)" }}>Tirnew</div>
                  <div style={{ fontSize: 10, color: "var(--primary)", letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.8 }}>Truck Service</div>
                </div>
              </Link>
              <p style={{ fontSize: 13, color: "var(--text-faint)", lineHeight: 1.7, maxWidth: 260 }}>
                Сервіс вантажних автомобілів, причепів і напівпричепів. Діагностика, ремонт, обслуговування.
              </p>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 5 }}>
                <a href="tel:+380664188826" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>+38 (066) 418-88-26</a>
                <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Рівненська обл., с. Велика Омеляна, вул. Шевченка 35</span>
                <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Пн–Сб, 08:00–18:00</span>
              </div>
            </div>

            {/* Nav */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginBottom: 14 }}>Навігація</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((l) => (
                  <Link key={l.href} href={l.href} style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>{l.label}</Link>
                ))}
                <Link href="/cabinet" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                  <User size={12} /> Кабінет
                </Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginBottom: 14 }}>Послуги</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Ремонт двигунів","Ремонт КПП","Гальмівна система","Пневмосистема","Електрика"].map((s) => (
                  <Link key={s} href="/services" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>{s}</Link>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>© {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.</span>
            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Дипломний проєкт</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
