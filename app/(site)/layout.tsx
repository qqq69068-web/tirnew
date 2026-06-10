"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, User, Sun, Moon } from "lucide-react";
import AiChat from "@/components/AiChat";
import { TirnewLogo } from "@/components/TirnewLogo";

// Gallery removed by design decision
const links = [
  { href: "/",           label: "Головна" },
  { href: "/services",   label: "Послуги" },
  { href: "/price",      label: "Прайс" },
  { href: "/contacts",   label: "Контакти" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState<boolean | null>(null);
  const [dark, setDark]         = useState(true);
  const [progress, setProgress] = useState(0);
  const [progVisible, setProgVisible] = useState(false);
  const progTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  /* ── Theme init ─────────────────────────────────────────── */
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

  /* ── Scroll detection ───────────────────────────────────── */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* ── Page progress bar ──────────────────────────────────── */
  useEffect(() => {
    setProgVisible(true);
    setProgress(0);
    const t1 = setTimeout(() => setProgress(40), 50);
    const t2 = setTimeout(() => setProgress(70), 200);
    const t3 = setTimeout(() => setProgress(85), 500);
    const t4 = setTimeout(() => setProgress(100), 700);
    progTimer.current = setTimeout(() => setProgVisible(false), 1050);
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      clearTimeout(t3); clearTimeout(t4);
      if (progTimer.current) clearTimeout(progTimer.current);
    };
  }, [pathname]);

  /* ── Close mobile menu on route change ─────────────────── */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* ── Auth check ─────────────────────────────────────────── */
  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => setIsClient(r.ok))
      .catch(() => setIsClient(false));
  }, [pathname]);

  /* ── Lock body scroll when mobile menu open ─────────────── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* ── Custom cursor (fine pointer devices only) ───────────── */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot  = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
    };

    // Ring follows with lerp for smooth trailing effect
    const animate = () => {
      ringX += (dotX - ringX) * 0.12;
      ringY += (dotY - ringY) * 0.12;
      dot.style.transform  = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      if (el.matches('a, button, [role="button"], input, textarea, select, label')) {
        dot.classList.add("hover");
        ring.classList.add("hover");
      }
    };
    const onLeave = () => {
      dot.classList.remove("hover");
      ring.classList.remove("hover");
    };
    const onDocLeave = () => {
      dot.classList.add("hidden");
      ring.classList.add("hidden");
    };
    const onDocEnter = () => {
      dot.classList.remove("hidden");
      ring.classList.remove("hidden");
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onDocLeave);
    document.addEventListener("mouseenter", onDocEnter);

    // Delegate hover to all interactive elements
    const interactive = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, label'
    );
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onDocLeave);
      document.removeEventListener("mouseenter", onDocEnter);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  const cabinetLabel     = isClient ? "Кабінет" : "Увійти";
  const cabinetLabelFull = isClient ? "Особистий кабінет" : "Увійти / Реєстрація";

  return (
    <div className="site-wrapper">

      {/* ══ CUSTOM CURSOR ════════════════════════════════════ */}
      <div id="cursor-dot"  className="cursor-dot"  aria-hidden="true" />
      <div id="cursor-ring" className="cursor-ring" aria-hidden="true" />

      {/* ══ PAGE PROGRESS BAR ════════════════════════════════ */}
      <div
        aria-hidden
        className="page-progress"
        style={{
          opacity: progVisible ? 1 : 0,
          width: `${progress}%`,
          transition: progVisible
            ? "width 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease"
            : "opacity 0.3s ease 0.05s",
        }}
      />

      {/* ══ NAVBAR ══════════════════════════════════════════ */}
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
            {links.map((l) => {
              const active = isActive(l.href, pathname);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-link${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                  {active && <span className="nav-link__bar" aria-hidden />}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="site-nav__controls">
            <a href="tel:+380664188826" className="site-nav__phone hidden md:flex">
              <Phone size={11} strokeWidth={2} aria-hidden />
              <span>+380 66 418 88 26</span>
            </a>

            <button
              onClick={toggleTheme}
              aria-label={dark ? "Світла тема" : "Темна тема"}
              className="btn-icon btn-icon--nav"
            >
              <span className={`theme-icon${dark ? " theme-icon--sun" : " theme-icon--moon"}`}>
                {dark
                  ? <Sun  size={14} strokeWidth={2} aria-hidden />
                  : <Moon size={14} strokeWidth={2} aria-hidden />}
              </span>
            </button>

            <Link
              href="/cabinet"
              className={`site-nav__cabinet hidden md:inline-flex${isClient ? " site-nav__cabinet--auth" : ""}`}
            >
              <User size={12} strokeWidth={2} aria-hidden />
              {cabinetLabel}
            </Link>

            <Link href="/contacts" className="btn btn-primary btn-sm hidden md:inline-flex">
              Зв&apos;язатись
            </Link>

            {/* Burger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className={`site-nav__burger flex md:hidden${open ? " open" : ""}`}
              aria-label={open ? "Закрити меню" : "Відкрити меню"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="burger-icon" aria-hidden>
                <span className={`burger-line burger-line--top${open ? " open" : ""}`} />
                <span className={`burger-line burger-line--mid${open ? " open" : ""}`} />
                <span className={`burger-line burger-line--bot${open ? " open" : ""}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <div
          id="mobile-menu"
          className={`mobile-menu${open ? " mobile-menu--open" : ""}`}
          role="navigation"
          aria-label="Мобільне меню"
          aria-hidden={!open}
          inert={open ? undefined : ("" as unknown as boolean)}
        >
          <nav className="mobile-menu__nav">
            {links.map((l, i) => {
              const active = isActive(l.href, pathname);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`mobile-nav-link${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                >
                  <span>{l.label}</span>
                  {active && <span className="mobile-nav-link__dot" aria-hidden />}
                </Link>
              );
            })}

            <Link
              href="/cabinet"
              className={`mobile-nav-link${isClient ? " mobile-nav-link--auth" : ""}`}
              style={{ transitionDelay: open ? `${links.length * 40}ms` : "0ms" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <User size={14} aria-hidden /> {cabinetLabelFull}
              </span>
            </Link>

            <button
              onClick={toggleTheme}
              className="mobile-nav-link mobile-nav-link--btn"
              style={{ transitionDelay: open ? `${(links.length + 1) * 40}ms` : "0ms" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                {dark ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />}
                {dark ? "Світла тема" : "Темна тема"}
              </span>
            </button>
          </nav>

          <div
            className="mobile-menu__ctas"
            style={{ transitionDelay: open ? `${(links.length + 2) * 40}ms` : "0ms" }}
          >
            <a href="tel:+380664188826" className="btn btn-outline" style={{ justifyContent: "center", height: 42 }}>
              <Phone size={13} aria-hidden /> +380 66 418 88 26
            </a>
            <Link href="/contacts" className="btn btn-primary" style={{ justifyContent: "center", height: 42 }}>
              Зв&apos;язатись з нами
            </Link>
          </div>
        </div>

        {open && (
          <div
            className="mobile-menu__backdrop"
            aria-hidden
            onClick={() => setOpen(false)}
          />
        )}
      </header>

      {/* ══ PAGE CONTENT ════════════════════════════════════ */}
      <main>{children}</main>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer className="site-footer theme-transition">
        <div className="site-footer__top">
          <div className="container-wide site-footer__grid">

            {/* Brand col */}
            <div className="site-footer__brand reveal">
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
            <div className="site-footer__col reveal d-2">
              <p className="site-footer__col-title">Навігація</p>
              <div className="site-footer__col-links">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="footer-link hover-underline">{l.label}</Link>
                ))}
                <Link href="/cabinet" className="footer-link hover-underline">Кабінет</Link>
              </div>
            </div>

            {/* Services col */}
            <div className="site-footer__col reveal d-3">
              <p className="site-footer__col-title">Послуги</p>
              <div className="site-footer__col-links">
                {["Ремонт двигунів", "Ремонт КПП", "Гальмівна система", "Пневмосистема", "Електрика"].map((s) => (
                  <Link key={s} href="/services" className="footer-link hover-underline">{s}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="container-wide site-footer__bottom-inner">
            <span className="site-footer__copy">
              &copy; {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.
            </span>
            <span className="site-footer__copy">Дипломний проєкт</span>
          </div>
        </div>
      </footer>

      {/* ══ AI CHAT ═════════════════════════════════════════ */}
      <AiChat />

      {/* ══ STYLES ══════════════════════════════════════════ */}
      <style>{`
        .site-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
        }

        /* ── PAGE PROGRESS BAR ─────────────────────────── */
        .page-progress {
          position: fixed;
          top: 0; left: 0;
          height: 2px;
          background: var(--primary);
          z-index: 9999;
          pointer-events: none;
          transform-origin: left center;
          box-shadow: 0 0 8px rgba(185,28,28,0.5);
          border-radius: 0 2px 2px 0;
        }

        /* ── NAVBAR ────────────────────────────────────── */
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
        .nav-link {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          padding: 6px 10px;
          border-radius: var(--radius);
          font-family: var(--font-display);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-muted);
          text-decoration: none;
          transition: color var(--transition-fast), background var(--transition-fast);
          overflow: visible;
        }
        .nav-link:hover { color: var(--text); background: var(--surface2); }
        .nav-link.active { color: var(--text); }
        .nav-link__bar {
          position: absolute;
          bottom: -1px;
          left: 10px;
          right: 10px;
          height: 2px;
          background: var(--primary);
          border-radius: 2px;
          animation: navBarSlide 0.28s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes navBarSlide {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
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

        /* Theme toggle */
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
          overflow: hidden;
        }
        .btn-icon--nav:hover {
          background: var(--surface2);
          color: var(--text);
          border-color: var(--border-accent);
        }
        .theme-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: themeIconIn 0.26s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes themeIconIn {
          from { opacity: 0; transform: rotate(-45deg) scale(0.7); }
          to   { opacity: 1; transform: rotate(0deg) scale(1); }
        }

        /* Cabinet */
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

        /* ── BURGER ──────────────────────────────────────── */
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
            border-color var(--transition-fast);
          flex-shrink: 0;
        }
        .site-nav__burger.open {
          background: var(--surface2);
          border-color: var(--border-strong);
        }
        .site-nav__burger:hover { background: var(--surface2); color: var(--text); }
        .burger-icon {
          width: 16px; height: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .burger-line {
          display: block;
          width: 100%; height: 1.5px;
          background: currentColor;
          border-radius: 2px;
          transition:
            transform 0.3s cubic-bezier(0.22,1,0.36,1),
            opacity   0.2s ease;
          transform-origin: center center;
        }
        .burger-line--top.open { transform: translateY(5.25px) rotate(45deg); }
        .burger-line--mid.open { opacity: 0; transform: scaleX(0); }
        .burger-line--bot.open { transform: translateY(-5.25px) rotate(-45deg); }

        /* ── MOBILE MENU ─────────────────────────────────── */
        .mobile-menu {
          border-top: 1px solid var(--border);
          background: var(--surface);
          padding: var(--space-3) var(--space-4) var(--space-5);
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
          transition:
            max-height 0.38s cubic-bezier(0.22,1,0.36,1),
            opacity    0.26s ease,
            transform  0.32s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-menu--open {
          max-height: 600px;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .mobile-menu__nav { display: flex; flex-direction: column; gap: 2px; }
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
          opacity: 0;
          transform: translateX(-10px);
          transition:
            background  var(--transition-fast),
            color       var(--transition-fast),
            opacity     0.24s ease,
            transform   0.28s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-menu--open .mobile-nav-link { opacity: 1; transform: translateX(0); }
        .mobile-nav-link:hover  { background: var(--surface2); }
        .mobile-nav-link.active { color: var(--primary); background: var(--primary-subtle); }
        .mobile-nav-link--auth  { color: var(--accent); }
        .mobile-nav-link--btn {
          width: 100%; background: none; border: none; cursor: pointer;
          text-align: left; color: var(--text-muted);
          justify-content: flex-start;
          font-family: var(--font-display);
          font-size: var(--text-sm); font-weight: 600;
        }
        .mobile-nav-link__dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--primary);
          display: inline-block;
          flex-shrink: 0;
        }
        .mobile-menu__ctas {
          margin-top: var(--space-3);
          padding-top: var(--space-3);
          border-top: 1px solid var(--border);
          display: flex; flex-direction: column; gap: var(--space-2);
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.24s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-menu--open .mobile-menu__ctas { opacity: 1; transform: translateY(0); }
        .mobile-menu__backdrop {
          position: fixed; inset: 0; top: 60px;
          background: rgba(0,0,0,0.30);
          z-index: -1;
          backdrop-filter: blur(2px);
          animation: backdropIn 0.22s ease both;
        }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── FOOTER ──────────────────────────────────────── */
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
        .site-footer__contacts { display: flex; flex-direction: column; gap: var(--space-1); }
        .site-footer__phone { font-size: var(--text-sm); font-weight: 600; }
        .site-footer__meta { font-size: var(--text-xs); color: var(--text-faint); line-height: 1.5; }
        .site-footer__col-title {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-faint);
          margin-bottom: var(--space-4);
        }
        .site-footer__col-links { display: flex; flex-direction: column; gap: var(--space-2); }
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
        .hover-underline { position: relative; }
        .hover-underline::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 100%; height: 1px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.24s cubic-bezier(0.22,1,0.36,1);
        }
        .hover-underline:hover::after { transform: scaleX(1); }
        .site-footer__bottom { padding-block: var(--space-4); }
        .site-footer__bottom-inner {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: var(--space-2);
        }
        .site-footer__copy { font-size: var(--text-xs); color: var(--text-faint); }

        /* ── RESPONSIVE ──────────────────────────────────── */
        @media (max-width: 768px) {
          .site-footer__grid { grid-template-columns: 1fr 1fr; }
          .site-footer__brand { grid-column: span 2; }
        }
        @media (max-width: 480px) {
          .site-footer__grid { grid-template-columns: 1fr; }
          .site-footer__brand { grid-column: span 1; }
        }

        /* ── REDUCED MOTION ──────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .page-progress { transition: none !important; }
          .mobile-menu {
            transition:
              max-height 0.01ms, opacity 0.01ms, transform 0.01ms;
          }
          .mobile-nav-link {
            opacity: 1; transform: none;
            transition: background var(--transition-fast), color var(--transition-fast);
          }
          .mobile-menu__ctas { opacity: 1; transform: none; }
          .burger-line { transition: none; }
          .theme-icon { animation: none; }
          .nav-link__bar { animation: none; }
        }
      `}</style>
    </div>
  );
}
