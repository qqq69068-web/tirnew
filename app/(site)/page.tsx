import Link from "next/link";
import { services } from "@/lib/services";
import { Wrench, Zap, Clock, Shield, ChevronRight, Phone } from "lucide-react";

const categories = Array.from(new Set(services.map((s) => s.category)));

const stats = [
  { value: "20+", label: "Років досвіду" },
  { value: services.length + "+", label: "Видів послуг" },
  { value: "5000+", label: "Виконаних ремонтів" },
  { value: "24/7", label: "Підтримка" },
];

const advantages = [
  {
    icon: Wrench,
    title: "Власний склад запчастин",
    desc: "Великий асортимент оригінальних і аналогових деталей для мінімізації простою техніки.",
  },
  {
    icon: Zap,
    title: "Швидка діагностика",
    desc: "Комп'ютерна діагностика AutoCom, VOCOM, WABCO дозволяє точно знайти несправність.",
  },
  {
    icon: Clock,
    title: "Оперативний ремонт",
    desc: "Досвідчені майстри та налагоджені процеси забезпечують мінімальний час простою.",
  },
  {
    icon: Shield,
    title: "Гарантія якості",
    desc: "Надаємо гарантію на всі виконані роботи та встановлені запчастини.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#0b0b0c] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Gradient background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-red-600/10 blur-[120px]" />
          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-red-900/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
              TIR Truck Service
            </span>
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight md:text-7xl">
            Сервіс вантажних
            <span className="block text-red-500">автомобілів</span>
            та причепів
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400">
            Діагностика, ремонт двигунів, трансмісії, підвіски, електрики та
            пневмосистем для комерційного транспорту. Власний склад запчастин.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-red-600 px-8 text-sm font-bold text-white transition hover:bg-red-500 active:scale-95"
            >
              Записатися на сервіс
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/services"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-white/15 px-8 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Переглянути послуги
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/8 pt-12 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white md:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="border-y border-white/8 bg-white/[0.02] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
              Напрями роботи
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Що ми ремонтуємо</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/services?cat=${encodeURIComponent(cat)}`}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
            Чому обирають нас
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Наші переваги</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {advantages.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-[24px] border border-white/8 bg-white/[0.03] p-7 transition hover:border-red-500/30 hover:bg-white/[0.06]"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
                <Icon size={22} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-red-700 to-red-900 p-10 md:p-14">
          {/* Decorative circle */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-10 right-40 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-bold leading-snug md:text-4xl">
                Потрібна допомога з технікою?
              </h2>
              <p className="mt-4 max-w-xl text-base text-red-100/80">
                Залиште заявку онлайн або зателефонуйте — менеджер зв'яжеться
                з вами протягом 30 хвилин для уточнення деталей.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link
                href="/booking"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-red-700 transition hover:bg-red-50"
              >
                Записатися онлайн
              </Link>
              <a
                href="tel:+380000000000"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Phone size={15} />
                Зателефонувати
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
