"use client";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

const links = [
  { href: "/",         label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/price",    label: "Прайс" },
  { href: "/gallery",  label: "Галерея" },
  { href: "/booking",  label: "Запис" },
  { href: "/contacts", label: "Контакти" },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div className="min-h-screen bg-[#09090b]">

      {/* NAVBAR */}
      <header
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#09090b]/95 backdrop-blur-xl shadow-2xl" : "bg-[#09090b]/80 backdrop-blur-lg"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              style={{ background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg"
            >
              <span className="text-base font-black text-white">T</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black uppercase tracking-widest text-white">Tirnew</span>
              <span className="text-[10px] text-red-400/80 tracking-wider uppercase">Truck Service</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname === l.href
                    ? "bg-red-500/15 text-red-400"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+380664188826"
              className="hidden items-center gap-1.5 text-sm text-neutral-400 transition hover:text-white md:flex"
            >
              <Phone size={14} />
              <span>+380 66 418 88 26</span>
            </a>
            <Link
              href="/booking"
              className="hidden h-9 items-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-95 md:inline-flex"
            >
              Записатися
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/8 hover:text-white md:hidden"
              aria-label="Меню"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            className="bg-[#09090b] px-5 pb-5 pt-3 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    pathname === l.href
                      ? "bg-red-500/15 text-red-400"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="tel:+380664188826"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-medium text-neutral-300 mt-2"
              >
                <Phone size={14} />
                +380 66 418 88 26
              </a>
              <Link
                href="/booking"
                className="mt-2 flex h-11 items-center justify-center rounded-xl bg-red-600 text-sm font-semibold text-white"
              >
                Записатися на сервіс
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* PAGE */}
      <div>{children}</div>

      {/* FOOTER */}
      <footer
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        className="bg-[#060607]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

            {/* Brand */}
            <div className="sm:col-span-2">
              <Link href="/" className="flex items-center gap-3">
                <div
                  style={{ background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                >
                  <span className="text-base font-black text-white">T</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black uppercase tracking-widest text-white">Tirnew</span>
                  <span className="text-[10px] text-red-400/80 tracking-wider uppercase">Truck Service</span>
                </div>
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-500">
                Сервіс вантажних автомобілів, причепів і напівпричепів.
                Діагностика, ремонт, обслуговування.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <a href="tel:+380664188826" className="text-sm text-neutral-400 transition hover:text-white">
                  +38 (066) 418-88-26
                </a>
                <span className="text-sm text-neutral-500">Рівненська обл., с. Велика Омеляна, вул. Шевченка 35</span>
                <span className="text-sm text-neutral-500">Пн–Сб, 08:00–18:00</span>
              </div>
            </div>

            {/* Nav */}
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-neutral-600">Навігація</p>
              <div className="flex flex-col gap-3">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-sm text-neutral-400 transition hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-neutral-600">Послуги</p>
              <div className="flex flex-col gap-3 text-sm text-neutral-400">
                {["Ремонт двигунів","Ремонт КПП","Гальмівна система","Пневмосистема","Електрика"].map((s) => (
                  <Link key={s} href="/services" className="transition hover:text-white">{s}</Link>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 text-xs text-neutral-600 sm:flex-row"
          >
            <span>© {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.</span>
            <span>Розроблено як дипломний проєкт</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
