import Link from "next/link";
import { services } from "@/lib/services";
import { Wrench, Zap, Clock, Shield, ChevronRight, Phone, ArrowRight } from "lucide-react";

const categories = Array.from(new Set(services.map((s) => s.category)));

const stats = [
  { value: "20+",               label: "Років досвіду" },
  { value: services.length + "+", label: "Видів послуг" },
  { value: "5 000+",            label: "Виконаних ремонтів" },
  { value: "24/7",              label: "Підтримка" },
];

const advantages = [
  { icon: Wrench, title: "Власний склад запчастин",  desc: "Великий асортимент оригінальних і аналогових деталей — мінімальний простій техніки." },
  { icon: Zap,    title: "Швидка діагностика",       desc: "AutoCom, VOCOM, WABCO — точно виявляємо несправність за лічені хвилини." },
  { icon: Clock,  title: "Оперативний ремонт",       desc: "Досвідчені майстри та налагоджені процеси — мінімальний час простою." },
  { icon: Shield, title: "Гарантія якості",          desc: "Гарантуємо якість усіх виконаних робіт і встановлених запчастин." },
];

const featured = services.slice(0, 3);

export default function HomePage() {
  return (
    <main className="bg-[#09090b] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=80"
            alt="Truck service"
            className="h-full w-full object-cover"
            style={{ filter: "brightness(0.18) saturate(0.6)" }}
          />
          <div
            style={{ background: "linear-gradient(180deg, rgba(9,9,11,0.55) 0%, rgba(9,9,11,0.9) 60%, #09090b 100%)" }}
            className="absolute inset-0"
          />
          <div
            style={{ background: "radial-gradient(ellipse 60% 50% at 10% 60%, rgba(220,38,38,0.18) 0%, transparent 70%)" }}
            className="absolute inset-0"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-24 md:px-10 md:pb-36 md:pt-32">
          <div
            style={{ border: "1px solid rgba(220,38,38,0.35)", background: "rgba(220,38,38,0.12)" }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">TIR Truck Service</span>
          </div>

          <h1 className="max-w-4xl text-balance text-5xl font-bold leading-[1.06] tracking-tight md:text-7xl">
            Сервіс
            <span className="text-red-500"> вантажних</span>
            <br />автомобілів та причепів
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-400">
            Діагностика, ремонт, пневмосистеми, електрика й трансмісія для
            комерційного транспорту. Власний склад запчастин.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-red-600 px-8 text-sm font-bold text-white transition hover:bg-red-500 active:scale-95"
            >
              Зв'язатись з нами
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/services"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              className="inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              Переглянути послуги
            </Link>
          </div>

          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            className="mt-20 grid grid-cols-2 gap-6 pt-10 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white md:text-4xl">{s.value}</p>
                <p className="mt-1.5 text-sm text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        className="bg-white/[0.015] py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Що ми робимо</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Популярні послуги</h2>
            </div>
            <Link href="/services" className="flex items-center gap-1.5 text-sm font-semibold text-red-400 transition hover:text-red-300">
              Усі {services.length} послуг <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((svc) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="group relative overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-2xl"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p
                    style={{ border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.15)" }}
                    className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-400"
                  >
                    {svc.category}
                  </p>
                  <h3 className="text-balance text-lg font-bold leading-snug text-white">{svc.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-400">{svc.short}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-neutral-500">{svc.price}</span>
                    <span className="text-sm font-semibold text-red-400 transition group-hover:translate-x-1">Детальніше →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/services?cat=${encodeURIComponent(cat)}`}
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                className="rounded-full bg-white/[0.04] px-4 py-2 text-sm text-neutral-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Чому обирають нас</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Наші переваги</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {advantages.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              className="group rounded-3xl bg-white/[0.025] p-7 transition hover:bg-white/[0.05]"
            >
              <div
                style={{ background: "rgba(220,38,38,0.12)" }}
                className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
              >
                <Icon size={22} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        className="bg-white/[0.015] py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Як це працює</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Процес роботи</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[
              { num: "01", title: "Залишаєте заявку",     desc: "Онлайн або по телефону — зручним для вас способом" },
              { num: "02", title: "Діагностика",           desc: "Комп'ютерна діагностика та огляд фахівцем" },
              { num: "03", title: "Погодження",            desc: "Затверджуєте перелік робіт та вартість" },
              { num: "04", title: "Ремонт і видача",       desc: "Виконуємо роботи та видаємо транспорт" },
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-4">
                <span className="text-5xl font-black text-red-600/30">{step.num}</span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div
          style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #450a0a 50%, #1c0404 100%)" }}
          className="relative overflow-hidden rounded-[2rem] p-10 md:p-16"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
            <img
              src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80"
              alt=""
              className="h-full w-full object-cover"
              style={{ opacity: 0.07 }}
            />
          </div>
          <div
            style={{ background: "radial-gradient(ellipse 80% 60% at 0% 50%, rgba(220,38,38,0.25) 0%, transparent 70%)" }}
            className="absolute inset-0"
          />
          <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Зв'жіться з нами</p>
              <h2 className="mt-4 max-w-lg text-balance text-3xl font-bold leading-snug md:text-4xl">
                Потрібна допомога з технікою?
              </h2>
              <p className="mt-4 max-w-lg text-base text-red-100/60">
                Залиште заявку онлайн або зателефонуйте — менеджер зв'яжеться
                з вами протягом 30 хвилин для уточнення деталей.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link
                href="/contacts"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-red-700 transition hover:bg-red-50 active:scale-95"
              >
                Зв'язатись онлайн
              </Link>
              <a
                href="tel:+380664188826"
                style={{ border: "1px solid rgba(255,255,255,0.25)" }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold text-white transition hover:bg-white/10"
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
