import Link from "next/link";
import { services, HOUR_RATE_MIN, HOUR_RATE_MAX } from "@/lib/services";
import { Clock, Wrench, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Прайс на роботи — TIR Truck Service",
  description: "Вартість ремонтних робіт для вантажних автомобілів і причепів. Нормогодина від 120 до 200 грн.",
};

const categories = Array.from(new Set(services.map((s) => s.category)));

export default function PricePage() {
  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      {/* Hero */}
      <section className="relative bg-[#0f1923] text-white py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f1923]/90" />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-red-400 mb-3 font-medium">Вартість робіт</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Прайс на послуги</h1>
          <p className="text-gray-300 max-w-xl text-lg">
            Вартість розраховується за нормогодинами. Кінцева ціна — після огляду та дефектації.
          </p>
          {/* Rate badge */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 backdrop-blur-sm">
            <Clock size={22} className="text-red-400" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Нормогодина</p>
              <p className="text-2xl font-bold">{HOUR_RATE_MIN}–{HOUR_RATE_MAX} <span className="text-base font-normal text-gray-300">грн</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Note */}
      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex gap-3 items-start text-sm text-amber-800">
          <span className="text-amber-500 mt-0.5">ℹ️</span>
          <p>
            Ціни вказані орієнтовно на основі нормогодин. Точна вартість визначається після огляду автомобіля та узгоджується з клієнтом до початку робіт.
            Запчастини оплачуються окремо.
          </p>
        </div>
      </div>

      {/* Price tables by category */}
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {categories.map((cat) => {
          const items = services.filter((s) => s.category === cat);
          return (
            <div key={cat} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-[#0f1923] px-6 py-4 flex items-center gap-2">
                <Wrench size={16} className="text-red-400" />
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider">{cat}</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="text-left px-6 py-3 font-medium">Послуга</th>
                    <th className="text-center px-4 py-3 font-medium whitespace-nowrap">Нормогодини</th>
                    <th className="text-right px-6 py-3 font-medium whitespace-nowrap">Вартість</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s, i) => (
                    <tr
                      key={s.slug}
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        i === items.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 text-sm">{s.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.short}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                          <Clock size={11} />
                          {s.hours}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-gray-900 text-sm">{s.price}</p>
                        <p className="text-xs text-gray-400">до {s.priceMax.toLocaleString("uk-UA")} грн</p>
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/services/${s.slug}`}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          title="Детальніше"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="bg-[#0f1923] text-white py-14 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Потрібен точний розрахунок?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
          Привезіть авто на огляд — майстер визначить обсяг робіт і озвучить фінальну ціну.
        </p>
        <Link
          href="/booking"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Записатись на огляд
        </Link>
      </section>
    </main>
  );
}
