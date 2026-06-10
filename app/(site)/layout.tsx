"use client";
import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, User, Sun, Moon, ChevronDown } from "lucide-react";
import AiChat from "@/components/AiChat";

const links = [
  { href: "/",            label: "Головна" },
  { href: "/services",    label: "Послуги" },
  { href: "/price",       label: "Прайс" },
  { href: "/gallery",     label: "Галерея" },
  { href: "/contacts",    label: "Контакти" },
];

/* ── SVG Logo ─────────────────────────────────────────── */
function TirnewLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="Tirnew logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagonal frame */}
      <path
        d="M20 3L35 11.5V28.5L20 37L5 28.5V11.5L20 3Z"
        fill="var(--primary)"
        opacity="0.12"
      />
      <path
        d="M20 3L35 11.5V28.5L20 37L5 28.5V11.5L20 3Z"
        stroke="var(--primary)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* T letterform */}
      <path
        d="M13 14H27M20 14V27"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Speed accent */}
      <path
        d="M14 22H20"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState<boolean | null>(null);
  const [dark, setDark]         = useState(true);
  const pathname = usePathname();

  /* Theme init */
  useEffect(() => {
    const saved = localStorage.getItem("tirnew-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("tirnew-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  /* Scroll detection */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* Auth check */
  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => setIsClient(r.ok))
      .catch(() => setIsClient(false));
  }, [pathname]);

  const cabinetLabel     = isClient ? "Кабінет" : "Увійти";
  const cabinetLabelFull = isClient ? "Особистий кабінет" : "Увійти / Реєстрація";

  return (
    <div id="site-wrapper">

      {/* ══ NAVBAR ══════════════════════════════════════════ */}
      <header
        className="theme-transition"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: scrolled ? "var(--nav-bg-scroll)" : "var(--nav-bg)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          borderBottom: scrolled ? "1px solid var(--border-strong)" : "1px solid var(--border)",
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
          transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 40px)",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <TirnewLogo size={36} />
            <div style={{ lineHeight: 1.15 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--text)",
                }}
              >
                Tirnew
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  color: "var(--text-faint)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: 1,
                }}
              >
                Truck Service
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex"
            style={{ alignItems: "center", gap: 28 }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${pathname === l.href ? "active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href="tel:+380664188826"
              className="hidden md:flex"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <Phone size={11} strokeWidth={2} />
              <span>+380 66 418 88 26</span>
            </a>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={dark ? "Світла тема" : "Темна тема"}
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius)",
                border: "1px solid var(--border-strong)",
                background: "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s, border-color 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--surface)";
              }}
            >
              {dark ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={2} />}
            </button>

            {/* Cabinet */}
            <Link
              href="/cabinet"
              className="hidden md:inline-flex"
              style={{
                height: 34,
                padding: "0 14px",
                borderRadius: "var(--radius)",
                border: `1px solid ${
                  pathname === "/cabinet" || isClient
                    ? "rgba(217,119,6,0.4)"
                    : "var(--border-strong)"
                }`,
                background:
                  pathname === "/cabinet" || isClient
                    ? "rgba(217,119,6,0.08)"
                    : "var(--surface)",
                color:
                  pathname === "/cabinet" || isClient
                    ? "var(--accent)"
                    : "var(--text-muted)",
                fontFamily: "var(--font-display)",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <User size={12} strokeWidth={2} />
              {cabinetLabel}
            </Link>

            {/* CTA */}
            <Link
              href="/contacts"
              className="btn-primary hidden md:inline-flex"
              style={{ height: 34, padding: "0 16px", fontSize: 12, fontWeight: 700 }}
            >
              Зв’язатись
            </Link>

            {/* Burger */}
            <button
              onClick={() => setOpen(!open)}
              className="flex md:hidden"
              aria-label="Меню"
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: open ? "var(--surface2)" : "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="mobile-menu-enter"
            style={{
              borderTop: "1px solid var(--border)",
              background: "var(--surface)",
              padding: "var(--space-3) var(--space-4) var(--space-5)",
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    padding: "10px var(--space-3)",
                    borderRadius: "var(--radius)",
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: pathname === l.href ? "var(--primary)" : "var(--text)",
                    background: pathname === l.href ? "var(--primary-glow)" : "transparent",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {l.label}
                  {pathname === l.href && (
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "var(--primary)",
                        display: "inline-block",
                      }}
                    />
                  )}
                </Link>
              ))}
              <Link
                href="/cabinet"
                style={{
                  padding: "10px var(--space-3)",
                  borderRadius: "var(--radius)",
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: isClient ? "var(--accent)" : "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                }}
              >
                <User size={14} /> {cabinetLabelFull}
              </Link>
              <button
                onClick={toggleTheme}
                style={{
                  padding: "10px var(--space-3)",
                  borderRadius: "var(--radius)",
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {dark ? <Sun size={14} /> : <Moon size={14} />}
                {dark ? "Світла тема" : "Темна тема"}
              </button>
            </nav>

            <div
              style={{
                marginTop: "var(--space-3)",
                paddingTop: "var(--space-3)",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
              }}
            >
              <a
                href="tel:+380664188826"
                style={{
                  height: 42,
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border-strong)",
                  background: "var(--surface2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text)",
                  textDecoration: "none",
                }}
              >
                <Phone size={13} /> +380 66 418 88 26
              </a>
              <Link
                href="/contacts"
                className="btn-primary"
                style={{ justifyContent: "center", height: 42, borderRadius: "var(--radius)" }}
              >
                Зв’язатись з нами
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* PAGE */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer
        className="theme-transition"
        style={{
          background: "var(--bg2)",
          borderTop: "1px solid var(--border)",
          marginTop: "auto",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "clamp(20px, 3vw, 32px) clamp(16px, 4vw, 40px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 32,
              alignItems: "start",
            }}
          >
            {/* Brand col */}
            <div style={{ gridColumn: "span 2" }}>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                  marginBottom: 14,
                }}
              >
                <TirnewLogo size={32} />
                <div style={{ lineHeight: 1.15 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--text)",
                    }}
                  >
                    Tirnew
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 9,
                      color: "var(--text-faint)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    Truck Service
                  </div>
                </div>
              </Link>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  maxWidth: 260,
                  marginBottom: 16,
                }}
              >
                Сервіс вантажних автомобілів, причепів і напівпричепів. Діагностика, ремонт,
                обслуговування.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <a
                  href="tel:+380664188826"
                  className="footer-link"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  +38 (066) 418-88-26
                </a>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--text-faint)",
                    lineHeight: 1.5,
                  }}
                >
                  Рівненська обл., с. Велика Омеляна, вул. Шевченка 35
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--text-faint)",
                  }}
                >
                  Пн–Сб, 08:00–18:00
                </span>
              </div>
            </div>

            {/* Nav col */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--text-faint)",
                  marginBottom: 14,
                }}
              >
                Навігація
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="footer-link hover-underline"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/cabinet"
                  className="footer-link hover-underline"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <User size={11} /> Кабінет
                </Link>
              </div>
            </div>

            {/* Services col */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--text-faint)",
                  marginBottom: 14,
                }}
              >
                Послуги
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Ремонт двигунів", "Ремонт КПП", "Гальмівна система", "Пневмосистема", "Електрика"].map(
                  (s) => (
                    <Link
                      key={s}
                      href="/services"
                      className="footer-link hover-underline"
                    >
                      {s}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "14px clamp(16px, 4vw, 40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--text-faint)",
            }}
          >
            &copy; {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--text-faint)",
            }}
          >
            Дипломний проєкт
          </span>
        </div>
      </footer>

      {/* ══ AI CHAT ════════════════════════════════════════════ */}
      <AiChat />
    </div>
  );
}
