"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { services } from "@/lib/services";
import { CheckCircle2 } from "lucide-react";

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500";

function BookingForm() {
  const searchParams = useSearchParams();
  const preSelected = searchParams.get("service") ?? "";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    carMake: "",
    carModel: "",
    carYear: "",
    service: preSelected,
    description: "",
    date: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (!/^[a-zA-Z\u0400-\u04FF\s\-']*$/.test(value)) return;
    }
    if (name === "phone") {
      if (!/^[0-9+()\-\s]*$/.test(value)) return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          carBrand: form.carMake,
          carModel: form.carModel,
          service: form.service,
          date: form.date || null,
          message: form.description,
        }),
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <CheckCircle2 size={56} className="text-teal-600 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Запис прийнято!</h2>
        <p className="text-gray-500 max-w-sm">
          Ми зв&apos;яжемось з вами найближчим часом для підтвердження часу.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 text-sm text-teal-600 hover:underline"
        >
          Зробити ще один запис
        </button>
      </div>
    );
  }

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Контакти */}
      <fieldset>
        <legend className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Ваші контакти
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ім&apos;я *
            </label>
            <input
              id="name" name="name" required
              value={form.name} onChange={handleChange}
              placeholder="Олексій"
              autoComplete="name"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Телефон *
            </label>
            <input
              id="phone" name="phone" type="tel" required
              value={form.phone} onChange={handleChange}
              placeholder="+380 50 000 00 00"
              autoComplete="tel"
              inputMode="numeric"
              className={inputCls}
            />
          </div>
        </div>
      </fieldset>

      {/* Авто */}
      <fieldset>
        <legend className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Автомобіль
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="carMake" className="block text-sm font-medium text-gray-700 mb-1">
              Марка *
            </label>
            <input
              id="carMake" name="carMake" required
              value={form.carMake} onChange={handleChange}
              placeholder="Volvo"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">
              Модель *
            </label>
            <input
              id="carModel" name="carModel" required
              value={form.carModel} onChange={handleChange}
              placeholder="FH 500"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="carYear" className="block text-sm font-medium text-gray-700 mb-1">
              Рік
            </label>
            <input
              id="carYear" name="carYear" type="number"
              min="1990" max="2026"
              value={form.carYear} onChange={handleChange}
              placeholder="2019"
              className={inputCls}
            />
          </div>
        </div>
      </fieldset>

      {/* Деталі */}
      <fieldset>
        <legend className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Деталі запису
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
              Послуга *
            </label>
            <select
              id="service" name="service" required
              value={form.service} onChange={handleChange}
              className={inputCls}
            >
              <option value="">Оберіть послугу</option>
              {categories.map((cat) => (
                <optgroup key={cat} label={cat}>
                  {services
                    .filter((s) => s.category === cat)
                    .map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Бажана дата
            </label>
            <input
              id="date" name="date" type="date"
              value={form.date} onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={inputCls}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Опис проблеми
          </label>
          <textarea
            id="description" name="description" rows={4}
            value={form.description} onChange={handleChange}
            placeholder="Опишіть симптоми або що саме потрібно зробити..."
            className={inputCls + " resize-none"}
          />
        </div>
      </fieldset>

      <button
        type="submit" disabled={loading}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
      >
        {loading ? "Відправляємо..." : "Записатись на сервіс"}
      </button>
    </form>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      <section className="bg-[#0f1923] text-white py-20 px-4 text-center">
        <p className="text-sm uppercase tracking-widest text-teal-400 mb-2 font-medium">
          Онлайн-запис
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Запишіться на сервіс
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm">
          Залиште заявку — ми зв&apos;яжемось для підтвердження
          зручного часу.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-2xl" />}>
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
