"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Sun, Moon, Phone, MapPin, Clock } from "lucide-react";
import AiChat from "@/components/AiChat";
import { TirnewLogo } from "@/components/TirnewLogo";

const links = [
  { href: "/",         label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/price",    label: "Прайс" },
  { href: "/contacts", label: "Контакти" },
];

const footerServices = [
  { href: "/services/engine-repair",  label: "Ремонт двигунів" },
  { href: "/services/gearbox-repair", label: "Ремонт КПП" },
  { href: "/services/brake-system",   label: "Гальмівна система" },
  { href: "/services/pneumo-system",  label: "Пневмосистема" },
  { href: "/services/electrics",      label: "Електрика" },
];

// Pages that have a full-bleed hero photo — navbar stays transparent on these
const HERO_PAGES = ["/", "/services"];

function pageHasHero(pathname: string): boolean {
  // exact match OR starts with /services/ (individual service pages may also have hero)
  return HERO_PAGES.some((p) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/")
  );
}

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

const REVEAL_SELECTOR = ".reveal, .reveal-left, .reveal-scale, .reveal-clip";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen]               = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [isClient, setIsClient]       = useState<boolean | null>(null);
  const [dark, setDark]               = useState(true);
  const [progress, setProgress]       = useState(0);
  const [progVisible, setProgVisible] = useState(false);
  const progTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef   = useRef<HTMLDivElement>(null);
  const pathname  = usePathname();

  const hasHero = pageHasHero(pathname);
  // Navbar shows solid background when: scrolled OR on a page without hero
  const navSolid = scrolled || !hasHero;

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
    handler(); // check immediately on mount
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setProgVisible(true);
    setProgress(0);
    const t1 = setTimeout(() => setProgress(40),  50);
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

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (!el.classList.contains("visible")) obs.observe(el);
      });
    }, 60);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const cabinetLabelFull = isClient ? "Особистий кабінет" : "Увійти / Реєстрація";

  return (
    <div className="site-wrapper">

      {/* ═══ PROGRESS BAR ═════════════════════════════════════ */}
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

      {/* ═══ NAVBAR ═══════════════════════════════════════════ */}
      <header className={`site-nav theme-transition${navSolid ? " site-nav--scrolled" : ""}`}>
        <div className="site-nav__inner">

          {/* Logo */}
          <Link href="/" className="site-nav__logo" aria-label="Tirnew — головна">
            <TirnewLogo size={28} />
            <div className="site-nav__brand">
              <span className="site-nav__brand-name">Tirnew</span>
              <span className="site-nav__brand-sub">Truck Service</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="site-nav__links" aria-label="Головне меню">
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
                </Link>
              );
            })}
          </nav>

          {/* Desktop right controls */}
          <div className="site-nav__controls">
            <a href="tel:+380664188826" className="site-nav__phone" aria-label="Телефон">
              <Phone size={12} strokeWidth={2} aria-hidden />
              +380 66 418 88 26
            </a>

            <button
              onClick={toggleTheme}
              aria-label={dark ? "Світла тема" : "Темна тема"}
              className="btn-icon btn-icon--nav"
            >
              {dark
                ? <Sun  size={14} strokeWidth={2} aria-hidden />
                : <Moon size={14} strokeWidth={2} aria-hidden />}
            </button>

            <Link
              href="/cabinet"
              className={`site-nav__cabinet${isClient ? " is-auth" : ""}`}
              aria-label={cabinetLabelFull}
            >
              <User size={13} strokeWidth={2} aria-hidden />
              <span>{isClient ? "Кабінет" : "Увійти"}</span>
            </Link>

            <Link href="/contacts" className="btn btn-primary btn-sm">
              Зв&apos;язатись
            </Link>

            {/* Mobile burger */}
            <div className="site-nav__mobile-wrap" ref={menuRef}>
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

      {open && (
        <div className="mobile-backdrop" aria-hidden onClick={() => setOpen(false)} />
      )}

      {/*
        On hero pages (/, /services/*): content starts at top=0, hero photo fills behind navbar.
        On all other pages: add padding-top so content isn't hidden under the fixed navbar.
      */}
      <main id="main-content" style={hasHero ? undefined : { paddingTop: "58px" }}>
        {children}
      </main>

      {/* ═══ FOOTER ═══════════════════════════════════════════════ */}
      <footer className="site-footer">
        <div className="container site-footer__grid">

          {/* Col 1 — Brand */}
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo" aria-label="Tirnew">
              <TirnewLogo size={26} />
              <div>
                <p className="site-footer__logo-name">Tirnew</p>
                <p className="site-footer__logo-sub">Truck Service</p>
              </div>
            </Link>
            <p className="site-footer__tagline">
              Діагностика, ремонт і обслуговування<br />
              вантажних авто, причепів<br />
              і напівпричепів.
            </p>
            <ul className="site-footer__contacts">
              <li>
                <Phone size={13} className="site-footer__ci" aria-hidden />
                <a href="tel:+380664188826" className="site-footer__clink">+38 (066) 418-88-26</a>
              </li>
              <li>
                <MapPin size={13} className="site-footer__ci" aria-hidden />
                <span>Рівненська обл., с. Велика Омеляна,<br />вул. Шевченка 35</span>
              </li>
              <li>
                <Clock size={13} className="site-footer__ci" aria-hidden />
                <span>Пн—Сб, 08:00—18:00</span>
              </li>
            </ul>
          </div>

          {/* Col 2 — Navigation */}
          <nav className="site-footer__col" aria-label="Навігація">
            <p className="site-footer__col-title">Навігація</p>
            <ul className="site-footer__col-list">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="site-footer__link">{l.label}</Link>
                </li>
              ))}
              <li><Link href="/cabinet" className="site-footer__link">Кабінет</Link></li>
            </ul>
          </nav>

          {/* Col 3 — Services */}
          <div className="site-footer__col">
            <p className="site-footer__col-title">Послуги</p>
            <ul className="site-footer__col-list">
              {footerServices.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="site-footer__link">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="site-footer__bar">
          <div className="container site-footer__bar-inner">
            <span>&copy; {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.</span>
            <span>Дипломний проект</span>
          </div>
        </div>
      </footer>

      <AiChat />

      <style>{`
        /* ══════════════════════════════════════════════════════
           NAVBAR — transparent overlay on hero pages,
                    solid frosted glass on all other pages
        ══════════════════════════════════════════════════════ */

        #main-content {
          padding-top: 0;
        }

        .site-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: transparent;
          border-bottom: 1px solid transparent;
          transition:
            background 0.32s ease,
            border-color 0.32s ease,
            box-shadow 0.32s ease;
        }

        .site-nav--scrolled {
          background: oklch(from var(--bg) l c h / 0.92);
          backdrop-filter: blur(20px) saturate(1.5);
          -webkit-backdrop-filter: blur(20px) saturate(1.5);
          border-bottom-color: var(--border);
          box-shadow: 0 1px 0 0 var(--border),
                      0 4px 24px oklch(0 0 0 / 0.08);
        }

        .site-nav__inner {
          max-width: var(--content-wide);
          margin-inline: auto;
          padding-inline: var(--space-6);
          height: 58px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: var(--space-6);
        }

        /* Logo */
        .site-nav__logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          flex-shrink: 0;
        }
        .site-nav__brand {
          display: flex;
          flex-direction: column;
          gap: 1px;
          line-height: 1;
        }
        .site-nav__brand-name {
          font-family: var(--font-display);
          font-size: var(--text-sm);
          font-weight: 800;
          color: rgba(255,255,255,0.95);
          letter-spacing: -0.02em;
          transition: color 0.32s ease;
        }
        .site-nav--scrolled .site-nav__brand-name {
          color: var(--text);
        }
        .site-nav__brand-sub {
          font-size: 0.62rem;
          font-weight: 500;
          color: rgba(255,255,255,0.50);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.32s ease;
        }
        .site-nav--scrolled .site-nav__brand-sub {
          color: var(--text-faint);
        }

        /* Nav links */
        .site-nav__links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-1);
        }
        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: 500;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          letter-spacing: -0.005em;
          transition: color 0.16s ease, background 0.16s ease;
        }
        .nav-link:hover {
          color: rgba(255,255,255,1);
          background: rgba(255,255,255,0.10);
        }
        .nav-link.active {
          color: rgba(255,255,255,1);
          font-weight: 600;
          background: rgba(255,255,255,0.12);
        }
        .site-nav--scrolled .nav-link {
          color: var(--text-muted);
        }
        .site-nav--scrolled .nav-link:hover {
          color: var(--text);
          background: oklch(from var(--text) l c h / 0.05);
        }
        .site-nav--scrolled .nav-link.active {
          color: var(--text);
          background: oklch(from var(--primary) l c h / 0.08);
        }

        /* Right controls */
        .site-nav__controls {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-shrink: 0;
        }

        /* Phone */
        .site-nav__phone {
          display: none;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255,255,255,0.70);
          text-decoration: none;
          letter-spacing: 0.02em;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          transition: color 0.16s ease, background 0.16s ease;
        }
        .site-nav__phone:hover {
          color: rgba(255,255,255,1);
          background: rgba(255,255,255,0.10);
        }
        .site-nav--scrolled .site-nav__phone {
          color: var(--text-muted);
        }
        .site-nav--scrolled .site-nav__phone:hover {
          color: var(--text);
          background: oklch(from var(--text) l c h / 0.05);
        }
        @media (min-width: 1024px) { .site-nav__phone { display: flex; } }

        /* Cabinet btn */
        .site-nav__cabinet {
          display: none;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: 500;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.18);
          transition: color 0.16s ease, background 0.16s ease, border-color 0.16s ease;
        }
        .site-nav__cabinet:hover {
          color: rgba(255,255,255,1);
          border-color: rgba(255,255,255,0.38);
          background: rgba(255,255,255,0.10);
        }
        .site-nav--scrolled .site-nav__cabinet {
          color: var(--text-muted);
          border-color: var(--border);
        }
        .site-nav--scrolled .site-nav__cabinet:hover {
          color: var(--text);
          border-color: var(--border-strong);
          background: oklch(from var(--text) l c h / 0.04);
        }
        .site-nav__cabinet.is-auth {
          color: var(--primary-light);
          border-color: rgba(255,255,255,0.22);
        }
        .site-nav--scrolled .site-nav__cabinet.is-auth {
          color: var(--primary);
          border-color: oklch(from var(--primary) l c h / 0.25);
        }
        @media (min-width: 768px) { .site-nav__cabinet { display: flex; } }

        /* Theme toggle */
        .btn-icon--nav {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.70);
          background: transparent;
          transition: color 0.16s ease, background 0.16s ease, border-color 0.16s ease;
        }
        .btn-icon--nav:hover {
          color: rgba(255,255,255,1);
          border-color: rgba(255,255,255,0.38);
          background: rgba(255,255,255,0.10);
        }
        .site-nav--scrolled .btn-icon--nav {
          color: var(--text-muted);
          border-color: var(--border);
        }
        .site-nav--scrolled .btn-icon--nav:hover {
          color: var(--text);
          border-color: var(--border-strong);
          background: oklch(from var(--text) l c h / 0.05);
        }

        /* CTA button */
        .site-nav .btn-primary {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
        }
        .site-nav .btn-primary:hover {
          background: var(--primary-h);
          border-color: var(--primary-h);
        }

        /* Burger */
        .site-nav__burger {
          border-color: rgba(255,255,255,0.22);
        }
        .site-nav__burger:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.38);
        }
        .burger-line {
          background: rgba(255,255,255,0.80);
        }
        .site-nav__burger:hover .burger-line {
          background: rgba(255,255,255,1);
        }
        .site-nav--scrolled .site-nav__burger {
          border-color: var(--border);
        }
        .site-nav--scrolled .site-nav__burger:hover {
          background: var(--surface2);
          border-color: var(--border-strong);
        }
        .site-nav--scrolled .burger-line {
          background: var(--text-muted);
        }
        .site-nav--scrolled .site-nav__burger:hover .burger-line {
          background: var(--text);
        }

        /* Mobile */
        @media (max-width: 767px) {
          .site-nav__links { display: none; }
          .site-nav__phone  { display: none !important; }
          .site-nav__cabinet { display: none !important; }
          .site-nav__inner {
            grid-template-columns: auto 1fr auto;
          }
          .site-nav__links { display: none !important; }
        }
        @media (min-width: 768px) {
          .site-nav__mobile-wrap .site-nav__burger { display: none; }
          .site-nav__mobile-wrap { display: none; }
        }

        /* ══════════════════════════════════════════════════════
           FOOTER
        ══════════════════════════════════════════════════════ */
        .site-footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
        }
        .site-footer__grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: clamp(var(--space-8), 4vw, var(--space-16));
          padding-block: clamp(var(--space-12), 5vw, var(--space-20));
          align-items: start;
        }
        @media (max-width: 860px) {
          .site-footer__grid {
            grid-template-columns: 1fr 1fr;
          }
          .site-footer__brand {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 560px) {
          .site-footer__grid {
            grid-template-columns: 1fr;
          }
        }

        .site-footer__logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          margin-bottom: var(--space-5);
        }
        .site-footer__logo-name {
          font-family: var(--font-display);
          font-size: var(--text-sm);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .site-footer__logo-sub {
          font-size: 0.62rem;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 500;
          line-height: 1.1;
        }
        .site-footer__tagline {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.72;
          margin-bottom: var(--space-6);
          max-width: 30ch;
        }

        .site-footer__contacts {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .site-footer__contacts li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.5;
        }
        .site-footer__ci {
          flex-shrink: 0;
          margin-top: 3px;
          color: var(--primary);
          opacity: 0.7;
        }
        .site-footer__clink {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.16s ease;
        }
        .site-footer__clink:hover { color: var(--primary); }

        .site-footer__col {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .site-footer__col-title {
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin-bottom: var(--space-3);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--border);
        }
        .site-footer__col-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .site-footer__link {
          display: inline-flex;
          align-items: center;
          font-size: var(--text-sm);
          color: var(--text-muted);
          text-decoration: none;
          padding: 5px 0;
          transition: color 0.16s ease, padding-left 0.16s ease;
          border-radius: var(--radius-sm);
        }
        .site-footer__link:hover {
          color: var(--text);
          padding-left: var(--space-2);
        }

        .site-footer__bar {
          border-top: 1px solid var(--border);
          padding-block: var(--space-4);
        }
        .site-footer__bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
          font-size: var(--text-xs);
          color: var(--text-faint);
        }
      `}</style>
    </div>
  );
}
