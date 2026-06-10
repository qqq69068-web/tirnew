"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, User, Sun, Moon, ChevronDown } from "lucide-react";
import AiChat from "@/components/AiChat";
import { TirnewLogo } from "@/components/TirnewLogo";

const links = [
  { href: "/",         label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/price",    label: "Прайс" },
  { href: "/contacts", label: "Контакти" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen]               = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [isClient, setIsClient]       = useState<boolean | null>(null);
  const [dark, setDark]               = useState(true);
  const [progress, setProgress]       = useState(0);
  const [progVisible, setProgVisible] = useState(false);
  const progTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

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

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => setIsClient(r.ok))
      .catch(() => setIsClient(false));
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const cabinetLabel     = isClient ? "Кабінет" : "Увійти";
  const cabinetLabelFull = isClient ? "Особистий кабінет" : "Увійти / Реєстрація";

  return (
    <div className="site-wrapper">

      {/* PROGRESS BAR */}
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

      {/* NAVBAR */}
      <header className={`site-nav theme-transition${scrolled ? " site-nav--scrolled" : ""}`}>
        <div className="site-nav__inner">

          {/* LOGO */}
          <Link href="/" className="site-nav__logo">
            <TirnewLogo size={30} />
            <div className="site-nav__brand">
              <span className="site-nav__brand-name">Tirnew</span>
              <span className="site-nav__brand-sub">Truck Service</span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
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

          {/* DESKTOP CONTROLS */}
          <div className="site-nav__controls">
            <a href="tel:+380664188826" className="site-nav__phone hidden md:flex">
              <Phone size={13} strokeWidth={2} aria-hidden />
              <span>+380 66 418 88 26</span>
            </a>

            <div className="site-nav__divider hidden md:block" aria-hidden />

            <button
              onClick={toggleTheme}
              aria-label={dark ? "Світла тема" : "Темна тема"}
              className="btn-icon btn-icon--nav"
            >
              <span className={`theme-icon${dark ? " theme-icon--sun" : " theme-icon--moon"}`}>
                {dark
                  ? <Sun  size={15} strokeWidth={2} aria-hidden />
                  : <Moon size={15} strokeWidth={2} aria-hidden />}
              </span>
            </button>

            <Link
              href="/cabinet"
              className={`site-nav__cabinet hidden md:inline-flex${isClient ? " site-nav__cabinet--auth" : ""}`}
            >
              <User size={13} strokeWidth={2} aria-hidden />
              {cabinetLabel}
            </Link>

            <Link href="/contacts" className="btn btn-primary btn-sm hidden md:inline-flex">
              Зв&apos;язатись
            </Link>

            {/* MOBILE BURGER — triggers floating dropdown */}
            <div className="site-nav__mobile-wrap flex md:hidden" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className={`site-nav__burger${open ? " open" : ""}`}
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

              {/* FLOATING DROPDOWN — compact, anchored to burger */}
              <div
                id="mobile-menu"
                className={`mobile-dropdown${open ? " mobile-dropdown--open" : ""}`}
                role="navigation"
                aria-label="Мобільне меню"
                aria-hidden={!open}
                inert={open ? undefined : ("" as unknown as boolean)}
              >
                <nav className="mobile-dropdown__nav">
                  {links.map((l, i) => {
                    const active = isActive(l.href, pathname);
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={`mobile-dd-link${active ? " active" : ""}`}
                        aria-current={active ? "page" : undefined}
                        style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
                      >
                        {active && <span className="mobile-dd-link__dot" aria-hidden />}
                        {l.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mobile-dropdown__sep" />

                <div className="mobile-dropdown__actions">
                  <Link
                    href="/cabinet"
                    className={`mobile-dd-link mobile-dd-link--icon${isClient ? " auth" : ""}`}
                    style={{ transitionDelay: open ? `${links.length * 30}ms` : "0ms" }}
                  >
                    <User size={13} aria-hidden />
                    {cabinetLabelFull}
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="mobile-dd-link mobile-dd-link--icon mobile-dd-link--btn"
                    style={{ transitionDelay: open ? `${(links.length + 1) * 30}ms` : "0ms" }}
                  >
                    {dark ? <Sun size={13} aria-hidden /> : <Moon size={13} aria-hidden />}
                    {dark ? "Світла тема" : "Темна тема"}
                  </button>
                </div>

                <div className="mobile-dropdown__sep" />

                <div
                  className="mobile-dropdown__ctas"
                  style={{ transitionDelay: open ? `${(links.length + 2) * 30}ms` : "0ms" }}
                >
                  <a href="tel:+380664188826" className="mobile-dd-cta mobile-dd-cta--outline">
                    <Phone size={12} aria-hidden />
                    +380 66 418 88 26
                  </a>
                  <Link href="/contacts" className="mobile-dd-cta mobile-dd-cta--primary">
                    Зв&apos;язатись
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop — subtle, does not cover full screen aggressively */}
      {open && (
        <div
          className="nav-backdrop"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      <main id="main-content" style={{ flex: 1 }}>{children}</main>

      {/* FOOTER */}
      <footer className="site-footer theme-transition">
        <div className="site-footer__top">
          <div className="site-footer__grid site-footer__full-width">
            <div className="site-footer__brand reveal">
              <Link href="/" className="site-nav__logo" style={{ marginBottom: "var(--space-4)" }}>
                <TirnewLogo size={34} />
                <div className="site-nav__brand">
                  <span className="site-nav__brand-name" style={{ fontSize: 15 }}>Tirnew</span>
                  <span className="site-nav__brand-sub">Truck Service</span>
                </div>
              </Link>
              <p className="site-footer__desc">
                Сервіс вантажних автомобілів, причепів і напівпричепів.
                Діагностика, ремонт, обслуговування.
              </p>
              <div className="site-footer__contacts">
                <a href="tel:+380664188826" className="footer-link site-footer__phone">+38 (066) 418-88-26</a>
                <span className="site-footer__meta">Рівненська обл., с. Велика Омеляна, вул. Шевченка 35</span>
                <span className="site-footer__meta">Пн–Сб, 08:00–18:00</span>
              </div>
            </div>
            <div className="site-footer__col reveal d-2">
              <p className="site-footer__col-title">Навігація</p>
              <div className="site-footer__col-links">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="footer-link hover-underline">{l.label}</Link>
                ))}
                <Link href="/cabinet" className="footer-link hover-underline">Кабінет</Link>
              </div>
            </div>
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
          <div className="site-footer__bottom-inner site-footer__full-width">
            <span className="site-footer__copy">&copy; {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.</span>
            <span className="site-footer__copy">Дипломний проєкт</span>
          </div>
        </div>
      </footer>

      <AiChat />

      <style>{`
        .site-wrapper { display: flex; flex-direction: column; min-height: 100dvh; }

        .page-progress {
          position: fixed; top: 0; left: 0; height: 2px;
          background: var(--primary); z-index: 9999; pointer-events: none;
          transform-origin: left center;
          box-shadow: 0 0 8px rgba(185,28,28,0.5); border-radius: 0 2px 2px 0;
        }

        .site-footer__full-width, .site-nav__inner {
          width: 100%;
          padding-inline: clamp(var(--space-5), 4vw, var(--space-16));
        }

        /* ══ NAVBAR ══ */
        .site-nav {
          position: sticky; top: 0; z-index: 100;
          background: var(--nav-bg);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid var(--border);
          transition: background var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
        }
        .site-nav--scrolled {
          background: var(--nav-bg-scroll);
          border-bottom-color: var(--border-strong);
          box-shadow: var(--shadow-md);
        }
        .site-nav__inner {
          height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          gap: var(--space-4);
        }

        /* Logo */
        .site-nav__logo {
          display: flex; align-items: center; gap: var(--space-2);
          text-decoration: none; flex-shrink: 0;
          transition: opacity var(--transition-fast);
        }
        .site-nav__logo:hover { opacity: 0.82; }
        .site-nav__brand { display: flex; flex-direction: column; line-height: 1.1; gap: 1px; }
        .site-nav__brand-name {
          font-family: var(--font-display);
          font-size: 15px; font-weight: 900;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--text);
        }
        .site-nav__brand-sub {
          font-size: 8px; color: var(--text-muted);
          letter-spacing: 0.20em; text-transform: uppercase;
        }

        /* Nav links */
        .site-nav__links { align-items: center; gap: 2px; }
        .nav-link {
          position: relative; display: inline-flex; flex-direction: column;
          align-items: center; padding: 6px 12px;
          border-radius: var(--radius);
          font-family: var(--font-display); font-size: 13.5px; font-weight: 600;
          color: var(--text-muted); text-decoration: none; white-space: nowrap;
          transition: color var(--transition-fast), background var(--transition-fast);
        }
        .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .nav-link.active { color: var(--text); }
        .nav-link__bar {
          position: absolute; bottom: 2px; left: 12px; right: 12px;
          height: 2px; background: var(--primary); border-radius: 2px;
          animation: navBarSlide 0.28s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes navBarSlide {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }

        /* Controls */
        .site-nav__controls { display: flex; align-items: center; gap: var(--space-2); }

        .site-nav__phone {
          display: flex; align-items: center; gap: 6px;
          font-size: 12.5px; font-weight: 500; color: var(--text-muted);
          text-decoration: none; padding: 0 var(--space-2); white-space: nowrap; line-height: 1;
          transition: color var(--transition-fast);
        }
        .site-nav__phone:hover { color: var(--text); }

        .site-nav__divider {
          width: 1px; height: 18px;
          background: var(--border-strong); flex-shrink: 0;
          margin-inline: var(--space-1);
        }

        /* Theme toggle */
        .btn-icon--nav {
          width: 32px; height: 32px; border-radius: var(--radius);
          border: 1px solid var(--border-strong); background: var(--surface);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); flex-shrink: 0;
          transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
        }
        .btn-icon--nav:hover { background: var(--surface2); color: var(--text); }
        .theme-icon {
          display: flex; align-items: center; justify-content: center;
          animation: themeIconIn 0.26s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes themeIconIn {
          from { opacity: 0; transform: rotate(-40deg) scale(0.7); }
          to   { opacity: 1; transform: rotate(0deg) scale(1); }
        }

        /* Cabinet */
        .site-nav__cabinet {
          height: 32px; padding: 0 14px; border-radius: var(--radius);
          border: 1px solid var(--border-strong); background: var(--surface);
          color: var(--text-muted); font-family: var(--font-display);
          font-size: 12.5px; font-weight: 600; line-height: 1;
          display: inline-flex; align-items: center; justify-content: center;
          gap: 6px; text-decoration: none;
          transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
        }
        .site-nav__cabinet:hover { background: var(--surface2); color: var(--text); }
        .site-nav__cabinet--auth { border-color: var(--accent-border); background: var(--accent-subtle); color: var(--accent); }
        .site-nav__cabinet--auth:hover { color: var(--accent-h); border-color: var(--accent); }

        /* Burger */
        .site-nav__mobile-wrap { position: relative; }
        .site-nav__burger {
          width: 32px; height: 32px; border-radius: var(--radius);
          border: 1px solid var(--border-strong); background: var(--surface);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); flex-shrink: 0;
          transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
        }
        .site-nav__burger.open,
        .site-nav__burger:hover { background: var(--surface2); color: var(--text); border-color: var(--border-strong); }
        .burger-icon { width: 15px; height: 11px; display: flex; flex-direction: column; justify-content: space-between; }
        .burger-line {
          display: block; width: 100%; height: 1.5px; background: currentColor; border-radius: 2px;
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.18s ease;
          transform-origin: center center;
        }
        .burger-line--top.open { transform: translateY(4.75px) rotate(45deg); }
        .burger-line--mid.open { opacity: 0; transform: scaleX(0); }
        .burger-line--bot.open { transform: translateY(-4.75px) rotate(-45deg); }

        /* ══ FLOATING MOBILE DROPDOWN ══ */
        .mobile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: calc(var(--radius) * 1.5);
          box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25);
          padding: 6px;
          z-index: 200;
          pointer-events: none;
          opacity: 0;
          transform: translateY(-6px) scale(0.97);
          transform-origin: top right;
          transition:
            opacity 0.22s cubic-bezier(0.22,1,0.36,1),
            transform 0.22s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-dropdown--open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .mobile-dropdown__nav {
          display: flex; flex-direction: column; gap: 1px;
        }
        .mobile-dd-link {
          display: flex; align-items: center; gap: var(--space-2);
          padding: 8px 10px; border-radius: calc(var(--radius) * 0.9);
          font-family: var(--font-display); font-size: 13px; font-weight: 600;
          color: var(--text-muted); text-decoration: none;
          opacity: 0; transform: translateX(4px);
          transition:
            background var(--transition-fast),
            color var(--transition-fast),
            opacity 0.18s ease,
            transform 0.2s cubic-bezier(0.22,1,0.36,1);
          white-space: nowrap;
        }
        .mobile-dropdown--open .mobile-dd-link {
          opacity: 1; transform: translateX(0);
        }
        .mobile-dd-link:hover { background: var(--surface2); color: var(--text); }
        .mobile-dd-link.active { color: var(--text); background: rgba(185,28,28,0.08); }
        .mobile-dd-link--icon { color: var(--text-muted); font-size: 12.5px; }
        .mobile-dd-link--icon.auth { color: var(--accent); }
        .mobile-dd-link--btn {
          width: 100%; background: none; border: none; cursor: pointer;
          text-align: left; color: var(--text-muted);
          font-family: var(--font-display); font-size: 12.5px; font-weight: 600;
        }
        .mobile-dd-link__dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--primary); flex-shrink: 0;
        }

        .mobile-dropdown__sep {
          height: 1px; background: var(--border);
          margin: 4px 2px;
        }
        .mobile-dropdown__actions {
          display: flex; flex-direction: column; gap: 1px;
        }
        .mobile-dropdown__ctas {
          display: flex; flex-direction: column; gap: var(--space-2);
          padding: 4px 2px 2px;
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.18s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-dropdown--open .mobile-dropdown__ctas {
          opacity: 1; transform: translateY(0);
        }
        .mobile-dd-cta {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          height: 36px; border-radius: var(--radius);
          font-family: var(--font-display); font-size: 12.5px; font-weight: 700;
          text-decoration: none; line-height: 1;
          transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
        }
        .mobile-dd-cta--outline {
          border: 1px solid var(--border-strong); background: var(--surface2);
          color: var(--text-muted);
        }
        .mobile-dd-cta--outline:hover { color: var(--text); border-color: var(--border-accent); }
        .mobile-dd-cta--primary {
          background: var(--primary); color: #fff; border: 1px solid transparent;
        }
        .mobile-dd-cta--primary:hover { background: var(--primary-h); }

        /* Backdrop — only behind dropdown, semi-transparent */
        .nav-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.18);
          z-index: 99;
          backdrop-filter: blur(1px);
          animation: backdropIn 0.18s ease both;
        }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }

        /* ══ FOOTER ══ */
        .site-footer { background: var(--bg2); border-top: 1px solid var(--border); margin-top: auto; }
        .site-footer__top { background: var(--surface); border-bottom: 1px solid var(--border); }
        .site-footer__grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr;
          gap: var(--space-8); padding-block: clamp(var(--space-6), 3vw, var(--space-10)); align-items: start;
        }
        .site-footer__brand { display: flex; flex-direction: column; }
        .site-footer__desc { font-size: var(--text-xs); color: var(--text-muted); line-height: 1.7; max-width: 26ch; margin-bottom: var(--space-4); }
        .site-footer__contacts { display: flex; flex-direction: column; gap: var(--space-1); }
        .site-footer__phone { font-size: var(--text-sm); font-weight: 600; color: var(--text) !important; }
        .site-footer__phone:hover { color: var(--primary) !important; }
        .site-footer__meta { font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5; }
        .site-footer__col-title {
          font-family: var(--font-display); font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); margin-bottom: var(--space-4);
        }
        .site-footer__col-links { display: flex; flex-direction: column; gap: var(--space-2); }
        .footer-link {
          font-family: var(--font-body); font-size: var(--text-xs); color: var(--text-muted);
          text-decoration: none; display: inline-flex; align-items: center; gap: 4px;
          transition: color var(--transition-fast);
        }
        .footer-link:hover { color: var(--text); }
        .hover-underline { position: relative; }
        .hover-underline::after {
          content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 1px;
          background: var(--primary); transform: scaleX(0); transform-origin: left center;
          transition: transform 0.24s cubic-bezier(0.22,1,0.36,1);
        }
        .hover-underline:hover::after { transform: scaleX(1); }
        .site-footer__bottom { padding-block: var(--space-4); }
        .site-footer__bottom-inner {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-2);
        }
        .site-footer__copy { font-size: var(--text-xs); color: var(--text-muted); }

        @media (max-width: 768px) {
          .site-footer__grid { grid-template-columns: 1fr 1fr; }
          .site-footer__brand { grid-column: span 2; }
        }
        @media (max-width: 480px) {
          .site-footer__grid { grid-template-columns: 1fr; }
          .site-footer__brand { grid-column: span 1; }
          .mobile-dropdown { width: calc(100vw - var(--space-8)); right: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .page-progress { transition: none !important; }
          .mobile-dropdown { transition: opacity 0.01ms; transform: none; }
          .mobile-dd-link { opacity: 1; transform: none; }
          .mobile-dropdown__ctas { opacity: 1; transform: none; }
          .burger-line { transition: none; }
          .theme-icon { animation: none; }
          .nav-link__bar { animation: none; }
        }
      `}</style>
    </div>
  );
}
