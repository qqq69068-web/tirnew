"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, Truck, Car } from "lucide-react";

type ServiceItem = {
  title: string;
  slug?: string; // внутрішня сторінка або null
};

const tirServices: ServiceItem[] = [
  { title: "Технічне обслуговування, ремонт причепів і напівпричепів, ремонт осьових агрегатів BPW, SAF, ROR, SMB, TRA, FRU", slug: "remont-prychipnoji-tehniky" },
  { title: "Наклепка гальмівних накладок на стенді BERAL", slug: "beral" },
  { title: "Ремонт гальмівних механізмів супортів спецінструментом KNORR", slug: "remont-galmivnyh-mehanizmiv" },
  { title: "Заміна поворотних шкворнів вантажних автомобілів пресом Fuchs Hydraulik", slug: "zamina-povorotnyh-shkvorniv" },
  { title: "Заміна масла в двигунах і трансмісії вантажних автомобілів, згідно рекомендацій заводів виробників", slug: "zamina-masla" },
  { title: "Діагностика та ремонт форсунок системи Common Rail", slug: "remont-forsunok-common-rail" },
  { title: "Ремонт двигунів", slug: "remont-dviguniv" },
  { title: "Ремонт КПП", slug: "remont-kpp" },
  { title: "Ремонт редукторів", slug: "differential" },
  { title: "Ремонт підвіски автомобілів", slug: "remont-pidvisky" },
  { title: "Ремонт електрообладнання", slug: "comp-diagnostic" },
  { title: "Комп'ютерна діагностика електричних систем автомобілів і причепів сканером AutoCom", slug: "comp-diagnostic-electro" },
  { title: "Комп'ютерна діагностика розвалу-сходження всіх марок автомобілів стендом Trommelberg", slug: "pc-diagnostic-trommelberg" },
  { title: "Комп'ютерна діагностика і калібрування пневмопідвіски з електронним керуванням (ECAS)", slug: "ecas" },
  { title: "Комп'ютерна діагностика і ремонт систем WABCO і HALDEX оригінальним обладнанням", slug: "wabcohaldex" },
  { title: "Комп'ютерна діагностика VOLVO, RVI оригінальним діагностичним комплексом VOCOM", slug: "volvo-rvi" },
  { title: "Відключення AdBlue за допомогою емулятора", slug: "adblue" },
  { title: "Діагностика і ремонт гальмівних систем ABS і EBS", slug: "abs-ebs" },
  { title: "Діагностика і ремонт пневматичної системи", slug: "remont-pnevmosistem" },
  { title: "Зварні роботи", slug: "zvaryuvalni-roboty" },
  { title: "Реставрація балок", slug: "restavraciya-balok" },
  { title: "Реставрація гальмівних валів, кронштейнів підвіски та інше", slug: "restavracijni-roboty" },
];

const carServices: ServiceItem[] = [
  { title: "Заміна ГРМ" },
  { title: "Ремонт ходової" },
  { title: "Заміна мастила" },
  { title: "Комп'ютерна діагностика" },
  { title: "Автоелектрик" },
  { title: "Розвал-сходження 3D" },
  { title: "Шиномонтаж" },
  { title: "Заправка кондиціонера" },
  { title: "Перевірка авто перед покупкою" },
  { title: "Підбір автозапчастин" },
];

export default function ServicesPage() {
  const [tab, setTab] = useState<"tir" | "car">("tir");

  return (
    <main className="min-h-screen bg-[#f7f6f2]">

      {/* HERO */}
      <section
        className="relative overflow-hidden bg-[#0f1923] py-20 px-4 text-white"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1923]/40 to-[#0f1923]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-red-400 mb-3 font-medium">Що ми робимо</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">Наші послуги</h1>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto">
            Повний цикл ремонту і обслуговування вантажного транспорту, причіпної техніки та легкових автомобілів.
          </p>
        </div>
      </section>

      {/* TABS */}
      <div className="bg-white border-b border-gray-200 sticky top-[65px] z-30">
        <div className="max-w-5xl mx-auto px-4 flex">
          <button
            onClick={() => setTab("tir")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
              tab === "tir"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Truck size={16} />
            Вантажні / ТІР
          </button>
          <button
            onClick={() => setTab("car")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
              tab === "car"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Car size={16} />
            Легкові
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-4 py-12">

        {tab === "tir" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Вантажні автомобілі і ТІР</h2>
              <p className="text-gray-500 text-sm">Повний перелік послуг для вантажного транспорту та причіпної техніки</p>
            </div>
            <ul className="space-y-2 mb-12">
              {tirServices.map((s, i) => (
                <li key={i}>
                  {s.slug ? (
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-start gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md transition-all"
                    >
                      <CheckCircle2 size={18} className="text-teal-500 mt-0.5 shrink-0 group-hover:text-teal-600" />
                      <span className="text-gray-800 text-sm leading-snug group-hover:text-red-600 transition-colors">{s.title}</span>
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
                      <CheckCircle2 size={18} className="text-teal-500 mt-0.5 shrink-0" />
                      <span className="text-gray-800 text-sm leading-snug">{s.title}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Замовлення запчастин */}
            <PartsOrderCard />
          </div>
        )}

        {tab === "car" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Легкові автомобілі</h2>
              <p className="text-gray-500 text-sm">Послуги для легкового транспорту</p>
            </div>
            <ul className="space-y-2 mb-12">
              {carServices.map((s, i) => (
                <li key={i}>
                  <div className="flex items-start gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
                    <CheckCircle2 size={18} className="text-teal-500 mt-0.5 shrink-0" />
                    <span className="text-gray-800 text-sm leading-snug">{s.title}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Замовлення запчастин */}
            <PartsOrderCard />
          </div>
        )}
      </section>

      {/* CTA */}
      <section
        style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
        className="bg-[#0f1923] text-white py-16 px-4 text-center"
      >
        <h2 className="text-3xl font-bold mb-3">Не знаєте, яка послуга потрібна?</h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          Запишіться на безкоштовну консультацію — майстер розбереться в проблемі.
        </p>
        <Link
          href="/contacts"
          className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Зв'язатись з нами
        </Link>
      </section>
    </main>
  );
}

function PartsOrderCard() {
  return (
    <Link
      href="/parts-order"
      className="group flex items-center gap-4 bg-teal-50 border border-teal-200 rounded-2xl px-6 py-5 hover:bg-teal-100 hover:border-teal-300 transition-all"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600/15">
        <Package size={22} className="text-teal-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-teal-800 group-hover:text-teal-900">Замовлення запчастин через нашу фірму</p>
        <p className="text-xs text-teal-600 mt-0.5">Підберемо оригінал або перевірений аналог, організуємо доставку</p>
      </div>
      <span className="text-teal-500 group-hover:translate-x-1 transition-transform">→</span>
    </Link>
  );
}
