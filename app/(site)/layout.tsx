"use client";
import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, User, Sun, Moon } from "lucide-react";
import AiChat from "@/components/AiChat";
import { TirnewLogo } from "@/components/TirnewLogo";

const links = [
  { href: "/",         label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/price",    label: "Прайс" },
  { href: "/gallery",  label: "Галерея" },
  { href: "/contacts", label: "Контакти" },
];

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
    <div className="site-wrapper">

      {/* ══ NAVBAR ══════════════════════════════════════════════ */}
      <header className={`site-nav theme-transition${scrolled ? " site-nav--scrolled" : ""}`}>
        <div className="site-nav__inner container-wide">

          {/* Logo */}
          <Link href="/" className="site-nav__logo">
            <TirnewLogo size={36} />
            <div className="site-nav__brand">
              <span className="site-nav__brand-name">Tirnew</span>
              <span className="site-nav__brand-sub">Truck Service</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="site-nav__links hidden md:flex" aria-label="Головне меню">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link${pathname === l.href ? " active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="site-nav__controls">

            {/* Phone */}
            <a href="tel:+380664188826" className="site-nav__phone hidden md:flex">
              <Phone size={11} strokeWidth={2} aria-hidden />
              <span>+380 66 418 88 26</span>
            </a>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={dark ? "Світла тема" : "Темна тема"}
              className="btn-icon btn-icon--nav"
            >
              {dark
                ? <Sun  size={14} strokeWidth={2} aria-hidden />
                : <Moon size={14} strokeWidth={2} aria-hidden />}
            </button>

            {/* Cabinet */}
            <Link
              href="/cabinet"
              className={`site-nav__cabinet hidden md:inline-flex${isClient ? " site-nav__cabinet--auth" : ""}`}
            >
              <User size={12} strokeWidth={2} aria-hidden />
              {cabinetLabel}
            </Link>

            {/* CTA */}
            <Link href="/contacts" className="btn btn-primary btn-sm hidden md:inline-flex">
              Зв&apos;язатись
            </Link>

            {/* Burger */}
            <button
              onClick={() => setOpen(!open)}
              className={`site-nav__burger flex md:hidden${open ? " open" : ""}`}
              aria-label="Меню"
              aria-expanded={open}
            >
              {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="mobile-menu mobile-menu-enter" role="navigation" aria-label="Мобільне меню">
            <nav className="mobile-menu__nav">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`mobile-nav-link${pathname === l.href ? " active" : ""}`}
                >
                  {l.label}
                  {pathname === l.href && <span className="mobile-nav-link__dot" aria-hidden />}
                </Link>
              ))}
              <Link
                href="/cabinet"
                className={`mobile-nav-link${isClient ? " mobile-nav-link--auth" : ""}`}
              >
                <User size={14} aria-hidden /> {cabinetLabelFull}
              </Link>
              <button onClick={toggleTheme} className="mobile-nav-link mobile-nav-link--btn">
                {dark ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />}
                {dark ? "Світла тема" : "Темна тема"}
              </button>
            </nav>

            <div className="mobile-menu__ctas">
              <a href="tel:+380664188826" className="btn btn-outline" style={{ justifyContent: "center", height: 42 }}>
                <Phone size={13} aria-hidden /> +380 66 418 88 26
              </a>
              <Link href="/contacts" className="btn btn-primary" style={{ justifyContent: "center", height: 42 }}>
                Зв&apos;язатись з нами
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* PAGE */}
      <main>{children}</main>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer className="site-footer theme-transition">
        <div className="site-footer__top">
          <div className="container-wide site-footer__grid">

            {/* Brand col */}
            <div className="site-footer__brand">
              <Link href="/" className="site-nav__logo" style={{ marginBottom: "var(--space-4)" }}>
                <TirnewLogo size={32} />
                <div className="site-nav__brand">
                  <span className="site-nav__brand-name" style={{ fontSize: 14 }}>Tirnew</span>
                  <span className="site-nav__brand-sub">Truck Service</span>
                </div>
              </Link>
              <p className="site-footer__desc">
                Сервіс вантажних автомобілів, причепів і напівпричепів.
                Діагностика, ремонт, обслуговування.
              </p>
              <div className="site-footer__contacts">
                <a href="tel:+380664188826" className="footer-link site-footer__phone">
                  +38 (066) 418-88-26
                </a>
                <span className="site-footer__meta">Рівненська обл., с. Велика Омеляна, вул. Шевченка 35</span>
                <span className="site-footer__meta">Пн–Сб, 08:00–18:00</span>
              </div>
            </div>

            {/* Nav col */}
            <div className="site-footer__col">
              <p className="site-footer__col-title">Навігація</p>
              <div className="site-footer__col-links">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="footer-link hover-underline">{l.label}</Link>
                ))}
                <Link href="/cabinet" className="footer-link hover-underline">
                  <User size={11} aria-hidden /> Кабінет
                </Link>
              </div>
            </div>

            {/* Services col */}
            <div className="site-footer__col">
              <p className="site-footer__col-title">Послуги</p>
              <div className="site-footer__col-links">
                {["Ремонт двигунів", "Ремонт КПП", "Гальмівна система", "Пневмосистема", "Електрика"].map((s) => (
                  <Link key={s} href="/services" className="footer-link hover-underline">{s}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="site-footer__bottom">
          <div className="container-wide site-footer__bottom-inner">
            <span className="site-footer__copy">
              &copy; {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.
            </span>
            <span className="site-footer__copy">Дипломний проєкт</span>
          </div>
        </div>
      </footer>

      {/* ══ AI CHAT ══════════════════════════════════════════════ */}
      <AiChat />

      {/* ══ NAV + FOOTER STYLES ═════════════════════════════════ */}
      <style>{`
        .site-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
        }

        /* ── NAVBAR BASE ──────────────────────────────────────── */
        .site-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--nav-bg);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid var(--border);
          transition:
            background var(--transition-base),
            box-shadow var(--transition-base),
            border-color var(--transition-base);
        }
        .site-nav--scrolled {
          background: var(--nav-bg-scroll);
          border-bottom-color: var(--border-strong);
          box-shadow: var(--shadow-md);
        }
        .site-nav__inner {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
        }

        /* Logo */
        .site-nav__logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          flex-shrink: 0;
          transition: opacity var(--transition-fast);
        }
        .site-nav__logo:hover { opacity: 0.85; }
        .site-nav__brand {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
          gap: 2px;
        }
        .site-nav__brand-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text);
        }
        .site-nav__brand-sub {
          font-family: var(--font-body);
          font-size: 9px;
          color: var(--text-faint);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        /* Desktop nav links */
        .site-nav__links {
          align-items: center;
          gap: var(--space-1);
        }

        /* Right controls */
        .site-nav__controls {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .site-nav__phone {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-decoration: none;
          padding: 0 var(--space-2);
          transition: color var(--transition-fast);
          white-space: nowrap;
        }
        .site-nav__phone:hover { color: var(--text); }

        /* Theme + burger icon button */
        .btn-icon--nav {
          width: 34px;
          height: 34px;
          border-radius: var(--radius);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition:
            background var(--transition-fast),
            color var(--transition-fast),
            border-color var(--transition-fast);
          flex-shrink: 0;
        }
        .btn-icon--nav:hover {
          background: var(--surface2);
          color: var(--text);
          border-color: var(--border-accent);
        }

        /* Cabinet button */
        .site-nav__cabinet {
          height: 34px;
          padding: 0 14px;
          border-radius: var(--radius);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text-muted);
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          text-decoration: none;
          transition:
            background var(--transition-fast),
            color var(--transition-fast),
            border-color var(--transition-fast);
        }
        .site-nav__cabinet:hover {
          background: var(--surface2);
          color: var(--text);
          border-color: var(--border-strong);
        }
        .site-nav__cabinet--auth {
          border-color: rgba(217,119,6,0.4);
          background: rgba(217,119,6,0.06);
          color: var(--accent);
        }
        .site-nav__cabinet--auth:hover {
          background: rgba(217,119,6,0.10);
          color: var(--accent);
          border-color: rgba(217,119,6,0.55);
        }

        /* Burger */
        .site-nav__burger {
          width: 34px;
          height: 34px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition:
            background var(--transition-fast),
            color var(--transition-fast),
            border-color var(--transition-fast);
        }
        .site-nav__burger.open {
          background: var(--surface2);
          border-color: var(--border-strong);
          color: var(--text);
        }
        .site-nav__burger:hover {
          background: var(--surface2);
          color: var(--text);
        }

        /* ── MOBILE MENU ──────────────────────────────────── */
        .mobile-menu {
          border-top: 1px solid var(--border);
          background: var(--surface);
          padding: var(--space-3) var(--space-4) var(--space-5);
        }
        .mobile-menu__nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          justify-content: space-between;
          padding: 10px var(--space-3);
          border-radius: var(--radius);
          font-family: var(--font-display);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text);
          text-decoration: none;
          transition: background var(--transition-fast), color var(--transition-fast);
        }
        .mobile-nav-link:hover { background: var(--surface2); }
        .mobile-nav-link.active {
          color: var(--primary);
          background: var(--primary-subtle);
        }
        .mobile-nav-link--auth { color: var(--accent); }
        .mobile-nav-link--btn {
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          color: var(--text-muted);
          justify-content: flex-start;
        }
        .mobile-nav-link__dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--primary);
          display: inline-block;
          flex-shrink: 0;
        }
        .mobile-menu__ctas {
          margin-top: var(--space-3);
          padding-top: var(--space-3);
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        /* ── FOOTER ────────────────────────────────────────── */
        .site-footer {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          margin-top: auto;
        }
        .site-footer__top {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }
        .site-footer__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: var(--space-8);
          padding-block: clamp(var(--space-6), 3vw, var(--space-10));
          align-items: start;
        }
        .site-footer__brand { display: flex; flex-direction: column; }
        .site-footer__desc {
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: 1.7;
          max-width: 26ch;
          margin-bottom: var(--space-4);
        }
        .site-footer__contacts {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .site-footer__phone {
          font-size: var(--text-sm);
          font-weight: 600;
        }
        .site-footer__meta {
          font-size: var(--text-xs);
          color: var(--text-faint);
          line-height: 1.5;
        }
        .site-footer__col-title {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-faint);
          margin-bottom: var(--space-4);
        }
        .site-footer__col-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .footer-link {
          font-family: var(--font-body);
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color var(--transition-fast);
        }
        .footer-link:hover { color: var(--text); }
        .hover-underline {
          position: relative;
        }
        .hover-underline::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hover-underline:hover::after { transform: scaleX(1); }
        .site-footer__bottom {
          padding-block: var(--space-4);
        }
        .site-footer__bottom-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .site-footer__copy {
          font-size: var(--text-xs);
          color: var(--text-faint);
        }

        /* ── RESPONSIVE ──────────────────────────────────────── */
        @media (max-width: 768px) {
          .site-footer__grid {
            grid-template-columns: 1fr 1fr;
          }
          .site-footer__brand {
            grid-column: span 2;
          }
        }
        @media (max-width: 480px) {
          .site-footer__grid {
            grid-template-columns: 1fr;
          }
          .site-footer__brand {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
