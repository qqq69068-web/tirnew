"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Phone,
  MapPin,
  Clock,
  Truck,
  ChevronRight,
  Wrench,
  Package,
  Menu,
  X,
} from "lucide-react";
import { TirnewLogo } from "@/components/TirnewLogo";
import { BookingButton } from "@/components/BookingButton";
import { AiChat } from "@/components/AiChat";

const footerServices = [
  { label: "Діагностика двигуна", href: "/services/diahnostyka-dvyhuna" },
  { label: "Гальмівна система", href: "/services/halimvna-systema" },
  { label: "Ходова частина", href: "/services/khodova-chastyna" },
  { label: "Трансмісія", href: "/services/transmisiia" },
  { label: "Пневмосистема", href: "/services/pnevmosystema" },
  { label: "Електрика", href: "/services/elektryka" },
];

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/price", label: "Прайс" },
  { href: "/contacts", label: "Контакти" },
];

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ═══ NAVBAR ═══════════════════════════════════════════════ */}
      <header className={`site-nav${scrolled ? " site-nav--scrolled" : ""}`}>
        <div className="container site-nav__inner">
          {/* Logo */}
          <Link href="/" className="site-nav__logo" aria-label="Tirnew — Truck Service">
            <TirnewLogo />
            <span className="site-nav__logo-text">
              <span className="site-nav__logo-name">Tirnew</span>
              <span className="site-nav__logo-sub">Truck Service</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="site-nav__links" aria-label="Головне меню">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`site-nav__link${isActive ? " site-nav__link--active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="site-nav__right">
            <a href="tel:+380664188826" className="site-nav__phone" aria-label="Зателефонувати">
              <Phone size={13} aria-hidden />
              +380 66 418 88 26
            </a>
            <Link href="/cabinet" className="btn btn-ghost site-nav__cabinet">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Кабінет
            </Link>
            <BookingButton />

            {/* Burger */}
            <button
              className="site-nav__burger"
              aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ═══ MOBILE MENU ══════════════════════════════════════════ */}
      <div
        className={`mobile-menu${menuOpen ? " mobile-menu--open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Мобільне меню"
      >
        <nav className="mobile-menu__nav" aria-label="Мобільне меню навігація">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`mobile-menu__link${isActive ? " mobile-menu__link--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
                <ChevronRight size={16} aria-hidden />
              </Link>
            );
          })}
          <Link href="/cabinet" className="mobile-menu__link">
            Кабінет
            <ChevronRight size={16} aria-hidden />
          </Link>
        </nav>

        <div className="mobile-menu__cta">
          <BookingButton fullWidth />
        </div>

        <div className="mobile-menu__contact">
          <a href="tel:+380664188826" className="mobile-menu__phone">
            <Phone size={14} aria-hidden />
            +38 (066) 418-88-26
          </a>
        </div>
      </div>

      {menuOpen && (
        <div
          className="mobile-menu__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      {/* ═══ MAIN ═════════════════════════════════════════════════ */}
      <main className="site-main">
        {children}
      </main>

      {/* ═══ FOOTER ═══════════════════════════════════════════════ */}
      <footer className="site-footer">
        <div className="container site-footer__grid">

          {/* Brand column */}
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo" aria-label="Tirnew">
              <TirnewLogo size={28} />
              <div>
                <p className="site-footer__logo-name">Tirnew</p>
                <p className="site-footer__logo-sub">Truck Service</p>
              </div>
            </Link>
            <p className="site-footer__tagline">
              Сервіс вантажного транспорту. Ремонт TIR, причіпної техніки та легкових авто.
            </p>
            <ul className="site-footer__contacts">
              <li>
                <Phone size={13} className="site-footer__ci" aria-hidden />
                <a href="tel:+380664188826" className="site-footer__clink">+38 (066) 418-88-26</a>
              </li>
              <li>
                <MapPin size={13} className="site-footer__ci" aria-hidden />
                <span>Рівненська обл., с. Велика Омеляна, вул. Шевченка 35</span>
              </li>
              <li>
                <Clock size={13} className="site-footer__ci" aria-hidden />
                <span>Пн–Сб: 08:00–18:00</span>
              </li>
            </ul>
          </div>

          {/* Nav column */}
          <nav className="site-footer__col" aria-label="Навігація">
            <p className="site-footer__col-title">Навігація</p>
            <ul className="site-footer__col-list">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="site-footer__link">{l.label}</Link>
                </li>
              ))}
              <li><Link href="/cabinet" className="site-footer__link">Кабінет</Link></li>
            </ul>
          </nav>

          {/* Services column */}
          <div className="site-footer__col">
            <p className="site-footer__col-title">Послуги</p>
            <ul className="site-footer__col-list">
              {footerServices.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="site-footer__link">
                    <Wrench size={11} aria-hidden />
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="site-footer__link site-footer__link--more">
                  Всі послуги
                  <ChevronRight size={12} aria-hidden />
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA column */}
          <div className="site-footer__col">
            <p className="site-footer__col-title">Швидкий запис</p>
            <p className="site-footer__col-text">Запишіться онлайн або замовте запчастини — відповімо протягом дня.</p>
            <div className="site-footer__ctas">
              <BookingButton size="sm" />
              <Link href="/parts-order" className="btn btn-outline btn-sm site-footer__parts-btn">
                <Package size={13} aria-hidden />
                Запчастини
              </Link>
            </div>
            <div className="site-footer__truck-icon" aria-hidden>
              <Truck size={64} strokeWidth={0.8} />
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="site-footer__bottom">
          <div className="container site-footer__bottom-inner">
            <span>&copy; {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.</span>
            <span>Дипломний проєкт</span>
          </div>
        </div>
      </footer>

      {/* ═══ AI CHAT ══════════════════════════════════════════════ */}
      <AiChat />

      <style>{`
        /* ═══════════════════════════════════════════════════════
           NAVBAR
        ═══════════════════════════════════════════════════════ */
        .site-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg);
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .site-nav--scrolled {
          border-bottom-color: var(--border);
          box-shadow: 0 1px 12px oklch(0 0 0 / 0.05);
        }
        .site-nav__inner {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          height: 58px;
        }
        .site-nav__logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-decoration: none;
          flex-shrink: 0;
        }
        .site-nav__logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .site-nav__logo-name {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
        }
        .site-nav__logo-sub {
          font-size: 0.6rem;
          font-weight: 600;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .site-nav__links {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          margin-left: auto;
        }
        .site-nav__link {
          display: inline-flex;
          align-items: center;
          height: 32px;
          padding: 0 var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
          transition: color var(--transition-interactive), background var(--transition-interactive);
        }
        .site-nav__link:hover {
          color: var(--text);
          background: oklch(from var(--text) l c h / 0.04);
        }
        .site-nav__link--active {
          color: var(--text);
          background: oklch(from var(--text) l c h / 0.06);
          font-weight: 600;
        }
        .site-nav__right {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-left: var(--space-4);
          flex-shrink: 0;
        }
        .site-nav__phone {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-muted);
          text-decoration: none;
          white-space: nowrap;
          transition: color var(--transition-interactive);
        }
        .site-nav__phone:hover { color: var(--text); }
        .site-nav__cabinet {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-xs);
          font-weight: 600;
          white-space: nowrap;
        }
        .site-nav__burger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: var(--radius-md);
          color: var(--text);
          background: none;
          border: none;
          cursor: pointer;
          transition: background var(--transition-interactive);
        }
        .site-nav__burger:hover {
          background: oklch(from var(--text) l c h / 0.06);
        }

        /* ═══════════════════════════════════════════════════════
           MOBILE MENU
        ═══════════════════════════════════════════════════════ */
        .mobile-menu {
          position: fixed;
          inset: 58px 0 0 0;
          z-index: 99;
          background: var(--bg);
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding: var(--space-4);
          transform: translateY(-8px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .mobile-menu--open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .mobile-menu__nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .mobile-menu__link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          font-size: var(--text-base);
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
          transition: background var(--transition-interactive), color var(--transition-interactive);
        }
        .mobile-menu__link:hover,
        .mobile-menu__link--active {
          background: oklch(from var(--text) l c h / 0.05);
          color: var(--text);
        }
        .mobile-menu__cta {
          padding-top: var(--space-3);
          border-top: 1px solid var(--border);
          margin-top: var(--space-2);
        }
        .mobile-menu__contact {
          padding-top: var(--space-3);
        }
        .mobile-menu__phone {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-muted);
          text-decoration: none;
        }
        .mobile-menu__backdrop {
          position: fixed;
          inset: 58px 0 0 0;
          z-index: 98;
          background: oklch(0 0 0 / 0.3);
        }

        /* ═══════════════════════════════════════════════════════
           MAIN
        ═══════════════════════════════════════════════════════ */
        .site-main {
          flex: 1;
          min-height: 0;
        }

        /* ═══════════════════════════════════════════════════════
           FOOTER
        ═══════════════════════════════════════════════════════ */
        .site-footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          margin-top: auto;
        }
        .site-footer__grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: clamp(var(--space-6), 4vw, var(--space-10));
          padding-block: clamp(var(--space-8), 5vw, var(--space-12));
        }
        .site-footer__brand {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .site-footer__logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
        }
        .site-footer__logo-name {
          font-family: var(--font-display);
          font-size: var(--text-base);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .site-footer__logo-sub {
          font-size: var(--text-xs);
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .site-footer__tagline {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.65;
          max-width: 28ch;
        }
        .site-footer__contacts {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .site-footer__contacts li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: 1.5;
        }
        .site-footer__ci {
          color: var(--primary);
          opacity: 0.6;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .site-footer__clink {
          color: var(--text-muted);
          text-decoration: none;
          transition: color var(--transition-interactive);
        }
        .site-footer__clink:hover { color: var(--primary); }

        .site-footer__col {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          position: relative;
        }
        .site-footer__col-title {
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-faint);
          margin-bottom: var(--space-1);
        }
        .site-footer__col-text {
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: 1.65;
          max-width: 24ch;
        }
        .site-footer__col-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .site-footer__link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-decoration: none;
          padding-block: 3px;
          transition: color var(--transition-interactive);
        }
        .site-footer__link:hover { color: var(--primary); }
        .site-footer__link--more {
          font-weight: 600;
          color: var(--primary);
          opacity: 0.7;
          margin-top: var(--space-1);
        }
        .site-footer__link--more:hover { opacity: 1; }
        .site-footer__ctas {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          align-items: flex-start;
        }
        .site-footer__parts-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
        }
        .site-footer__truck-icon {
          position: absolute;
          bottom: -8px;
          right: -8px;
          color: oklch(from var(--text) l c h / 0.04);
          pointer-events: none;
          user-select: none;
        }

        /* Bottom bar */
        .site-footer__bottom {
          border-top: 1px solid var(--border);
          padding-block: var(--space-4);
        }
        .site-footer__bottom-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          font-size: var(--text-xs);
          color: var(--text-faint);
        }

        /* ═══════════════════════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .site-footer__grid {
            grid-template-columns: 1fr 1fr;
          }
          .site-footer__truck-icon { display: none; }
        }
        @media (max-width: 768px) {
          .site-nav__links { display: none; }
          .site-nav__phone { display: none; }
          .site-nav__cabinet { display: none; }
          .site-nav__burger { display: flex; }
          .site-footer__grid { grid-template-columns: 1fr; }
          .site-footer__bottom-inner { flex-direction: column; text-align: center; gap: var(--space-2); }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
          .mobile-menu__backdrop { display: none !important; }
        }
      `}</style>
    </>
  );
}
