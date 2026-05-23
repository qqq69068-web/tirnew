import Link from "next/link";
import { services } from "@/lib/services";

export default function HomePage() {
  const featuredServices = services.slice(0, 6);

  return (
    <main className="bg-[#0b0b0c] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-red-500">
                Tirnew Truck Service
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
                Сервіс вантажних автомобілів, причепів і напівпричепів
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 md:text-lg">
                Діагностика, ремонт, електрика, пневмосистеми, двигуни,
                трансмісія та відновлювальні роботи для комерційного транспорту
                в одному місці.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/booking"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Записатися на сервіс
                </Link>

                <Link
                  href="/services"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:border-white/40"
                >
                  Переглянути послуги
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-neutral-400">Послуг</p>
                  <p className="mt-2 text-3xl font-semibold">{services.length}+</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-neutral-400">Запис</p>
                  <p className="mt-2 text-3xl font-semibold">Online</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-neutral-300">
                Підбираємо рішення під конкретну поломку, технічний стан
                автомобіля та формат експлуатації транспорту.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Основні напрями
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Популярні послуги
            </h2>
          </div>

          <Link
            href="/services"
            className="hidden text-sm font-semibold text-red-400 transition hover:text-red-300 md:inline-flex"
          >
            Усі послуги →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredServices.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-red-500/60 hover:bg-white/[0.06]"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  {service.category}
                </p>

                <h3 className="mt-3 text-xl font-semibold leading-snug text-white">
                  {service.title}
                </h3>

                <p className="mt-4 line-clamp-3 text-sm leading-7 text-neutral-300">
                  {service.short}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-neutral-400">
                    {service.price}
                  </span>
                  <span className="text-sm font-semibold text-red-400">
                    Детальніше →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 md:hidden">
          <Link
            href="/services"
            className="inline-flex text-sm font-semibold text-red-400 transition hover:text-red-300"
          >
            Усі послуги →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
        <div className="grid gap-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold">Склад запчастин</h3>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Власний склад допомагає скорочувати простій транспорту та швидше
              завершувати ремонт.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Комплексний підхід</h3>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Від діагностики до ремонту вузлів, електрики, підвіски,
              пневмосистем і сервісного обслуговування.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Швидкий запис</h3>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Залишайте заявку онлайн, і менеджер зв’яжеться для уточнення
              послуги, часу та деталей візиту.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
