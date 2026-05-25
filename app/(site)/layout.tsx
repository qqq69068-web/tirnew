import type { ReactNode } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/gallery", label: "Галерея" },
  { href: "/booking", label: "Запис" },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0c] font-sans text-white">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0b0b0c]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-black text-sm transition group-hover:bg-red-500">
              T
            </div>
            <span className="text-base font-black uppercase tracking-widest text-white">
              Tirnew
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-400 transition hover:bg-white/6 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/booking"
            className="inline-flex h-9 items-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Записатися
          </Link>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <div>{children}</div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 bg-[#080809]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid gap-10 md:grid-cols-4">

            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-black text-sm">
                  T
                </div>
                <span className="text-base font-black uppercase tracking-widest">Tirnew</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
                Сервіс вантажних автомобілів, причепів і напівпричепів.
                Діагностика, ремонт, обслуговування.
              </p>
              <div className="mt-6 flex flex-col gap-2 text-sm text-neutral-400">
                <a href="tel:+380000000000" className="transition hover:text-white">+38 (0XX) XXX-XX-XX</a>
                <span>Пн–Сб, 08:00–18:00</span>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-600">Навігація</p>
              <div className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="text-sm text-neutral-400 transition hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-600">Послуги</p>
              <div className="flex flex-col gap-3 text-sm text-neutral-400">
                <span>Ремонт двигунів</span>
                <span>Ремонт КПП</span>
                <span>Гальмівна система</span>
                <span>Пневмосистема</span>
                <span>Електрика</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/6 pt-8 text-xs text-neutral-600 sm:flex-row">
            <span>© {new Date().getFullYear()} Tirnew Truck Service. Всі права захищені.</span>
            <span>Розроблено для дипломного проєкту</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
