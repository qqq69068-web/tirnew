"use client";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, User } from "lucide-react";

const links = [
  { href: "/",         label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/price",    label: "Прайс" },
  { href: "/gallery",  label: "Галерея" },
  { href: "/contacts", label: "Контакти" },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => setIsClient(r.ok))
      .catch(() => setIsClient(false));
  }, [pathname]);

  // Якщо залогінений → "Кабінет", якщо ні → "Увійти"
  const cabinetLabel = isClient ? "Кабінет" : "Увійти";
  const cabinetLabelFull = isClient ? "Особистий кабінет" : "Увійти / Реєстрація";

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

            {/* Cabinet / Login button */}
            <Link
              href="/cabinet"
              className={`hidden h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition md:inline-flex ${
                pathname === "/cabinet"
                  ? "border-teal-500/40 bg-teal-600/15 text-teal-400"
                  : isClient
                    ? "border-teal-500/30 text-teal-400 hover:border-teal-500/50 hover:text-teal-300"
                    : "border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
              }`}
            >
              <User size={14} />
              {cabinetLabel}
            </Link>

            {/* CTA → contacts */}
            <Link
              href="/contacts"
              className="hidden h-9 items-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-95 md:inline-flex"
            >
              Зв&apos;язатись
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
              <Link
                href="/cabinet"
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  pathname === "/cabinet"
                    ? "bg-teal-600/15 text-teal-400"
                    : isClient
                      ? "text-teal-400 hover:bg-teal-600/10"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <User size={15} /> {cabinetLabelFull}
              </Link>
              <a
                href="tel:+380664188826"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-medium text-neutral-300 mt-2"
              >
                <Phone size={14} />
                +380 66 418 88 26
              </a>
              <Link
                href="/contacts"
                className="mt-2 flex h-11 items-center justify-center rounded-xl bg-red-600 text-sm font-semibold text-white"
              >
                Зв&apos;язатись з нами
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
                <Link href="/cabinet" className="text-sm text-neutral-400 transition hover:text-white flex items-center gap-1.5">
                  <User size={13} /> Особистий кабінет
                </Link>
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
