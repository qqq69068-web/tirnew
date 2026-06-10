"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Sun, Moon } from "lucide-react";
import AiChat from "@/components/AiChat";
import { TirnewLogo } from "@/components/TirnewLogo";

const links = [
  { href: "/",         label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/price",    label: "Прайс" },
  { href: "/contacts", label: "Контакти" },
];

const footerServices = [
  { href: "/services/engine-repair",     label: "Ремонт двигунів" },
  { href: "/services/gearbox-repair",    label: "Ремонт КПП" },
  { href: "/services/brake-system",      label: "Гальмівна система" },
  { href: "/services/pneumo-system",     label: "Пневмосистема" },
  { href: "/services/electrics",         label: "Електрика" },
];

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

  // ── GLOBAL REVEAL OBSERVER ─────────────────────────────────────────
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
    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
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

  const cabinetLabel     = isClient ? "Кабінет" : "Кабінет";
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

          {/* DESKTOP NAV LINKS — centered */}
          <nav className="site-nav__links hidden md:flex" aria-label="Головне меню">
            {links.map((l) => {
              const active = isActive(l.href, pathname);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-link${active ? " active nav-link--boxed" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP CONTROLS */}
          <div className="site-nav__controls">
            {/* Phone with custom icon style */}
            <a href="tel:+380664188826" className="site-nav__phone hidden md:flex">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
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
              className={`site-nav__cabinet site-nav__cabinet--outlined hidden md:inline-flex${isClient ? " site-nav__cabinet--auth" : ""}`}
            >
              <User size={13} strokeWidth={2} aria-hidden />
              {cabinetLabel}
            </Link>

            <Link href="/contacts" className="btn btn-primary btn-sm hidden md:inline-flex">
              Зв&apos;язатись
            </Link>

            {/* MOBILE BURGER */}
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
        <div
          className="mobile-backdrop"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      <main id="main-content">{children}</main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container site-footer__inner">

          {/* COL 1 — Brand + contacts */}
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo">
              <TirnewLogo size={28} />
              <span className="site-footer__logo-name">Tirnew</span>
            </Link>
            <p className="site-footer__desc">
              Сервіс вантажних автомобілів,<br />
              причепів і напівпричепів. Діагностика,<br />
              ремонт, обслуговування.
            </p>
            <div className="site-footer__contacts">
              <a href="tel:+380664188826" className="site-footer__contact site-footer__contact--phone">
                +38 (066) 418-88-26
              </a>
              <span className="site-footer__contact site-footer__contact--address">
                Рівненська обл., с. Велика Омеляна, вул. Шевченка 35
              </span>
              <span className="site-footer__contact site-footer__contact--hours">
                Пн—Сб, 08:00—18:00
              </span>
            </div>
          </div>

          {/* COL 2 — Navigation */}
          <nav className="site-footer__nav" aria-label="Навігація футер">
            <p className="site-footer__nav-title">Навігація</p>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="site-footer__link">{l.label}</Link>
            ))}
            <Link href="/cabinet" className="site-footer__link">Кабінет</Link>
          </nav>

          {/* COL 3 — Services */}
          <div className="site-footer__extra">
            <p className="site-footer__nav-title">Послуги</p>
            {footerServices.map((s) => (
              <Link key={s.href} href={s.href} className="site-footer__link">{s.label}</Link>
            ))}
          </div>

        </div>

        <div className="site-footer__bottom">
          <div className="container site-footer__bottom-inner">
            <span className="site-footer__copy">&copy; {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.</span>
            <span className="site-footer__copy">Дипломний проект</span>
          </div>
        </div>
      </footer>

      <AiChat />

    </div>
  );
}
