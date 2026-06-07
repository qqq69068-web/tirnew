"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowRight, CheckCircle2, Package, Truck, Car } from "lucide-react";

const tirServices  = services.filter((s) => s.vehicleType === "truck");
const carServices  = services.filter((s) => s.vehicleType === "car");

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
            Повний цикл ремонту та обслуговування вантажного транспорту, причіпної техніки та легкових автомобілів.
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
              {tirServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-start gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md transition-all"
                  >
                    <CheckCircle2 size={18} className="text-teal-500 mt-0.5 shrink-0 group-hover:text-teal-600" />
                    <span className="flex-1 text-gray-800 text-sm leading-snug group-hover:text-red-600 transition-colors">
                      {s.title}
                    </span>
                    <ArrowRight size={15} className="text-gray-300 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
            <PartsOrderCard />
          </div>
        )}

        {tab === "car" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Легкові автомобілі</h2>
              <p className="text-gray-500 text-sm">Послуги для легкового транспорту</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {carServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  style={{ border: "1px solid rgba(0,0,0,0.07)" }}
                  className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg hover:border-red-200 transition-all duration-300 flex flex-col"
                >
                  {/* Фото */}
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width={600}
                      height={350}
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-black/55 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                      {s.category}
                    </span>
                  </div>
                  {/* Контент */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5 group-hover:text-red-600 transition-colors leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed flex-1">{s.short}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-teal-600">{s.price}</span>
                      <span className="text-gray-300 group-hover:text-red-400 group-hover:translate-x-1 transition-all">
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
          Зв'яжіться з нами — майстер підкаже та запише на зручний час.
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
