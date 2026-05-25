"use client";

import { useState } from "react";
import { Phone, MapPin, Clock, CheckCircle2, Send, MessageSquare } from "lucide-react";

export default function ContactsPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Помилка відправки. Спробуйте ще раз або зателефонуйте нам.");
    } finally {
      setLoading(false);
    }
  };

  const info = [
    {
      icon: Phone,
      label: "Телефон",
      value: "+38 (066) 418-88-26",
      href: "tel:+380664188826",
    },
    {
      icon: MapPin,
      label: "Адреса",
      value: "Рівненська обл., с. Велика Омеляна, вул. Шевченка 35",
      href: "https://maps.google.com/?q=Велика+Омеляна+вул.Шевченка+35",
    },
    {
      icon: Clock,
      label: "Графік роботи",
      value: "Пн–Сб: 08:00 – 18:00",
      href: null,
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090b]">

      {/* HERO */}
      <section className="relative overflow-hidden py-20 px-4 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,38,38,0.12) 0%, transparent 70%)",
          }}
        />
        <p className="relative text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
          Зв'язатися з нами
        </p>
        <h1 className="relative text-4xl md:text-5xl font-black text-white mb-4">
          Контакти
        </h1>
        <p className="relative text-neutral-400 max-w-md mx-auto text-base">
          Маєте питання або хочете записатися? Напишіть нам або зателефонуйте — відповімо швидко.
        </p>
      </section>

      {/* INFO CARDS */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {info.map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              className="rounded-2xl bg-white/[0.03] p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 mb-4">
                <Icon size={18} className="text-red-400" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white hover:text-red-400 transition-colors"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm font-medium text-white">{value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* MAP + FORM */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Google Maps embed */}
          <div
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            className="rounded-2xl overflow-hidden bg-white/[0.03] min-h-[360px]"
          >
            <iframe
              title="Tirnew на карті"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.0!2d26.2300!3d50.6200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0JLQtdC70LjQutCwINCe0LzQtdC70Y_QvdCwLCDQstGD0LsuINCo0LXQstGH0LXQvdC60LAsMzU!5e0!3m2!1suk!2sua!4v1700000000000"
              width="100%"
              height="100%"
              style={{ minHeight: "360px", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact form */}
          <div
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            className="rounded-2xl bg-white/[0.03] p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 mb-5">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Повідомлення надіслано!</h3>
                <p className="text-neutral-400 text-sm max-w-xs">
                  Ми отримали ваше повідомлення і зв'яжемося з вами найближчим часом.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", message: "" }); }}
                  className="mt-6 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Надіслати ще одне
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/15">
                    <MessageSquare size={16} className="text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Напишіть нам</h2>
                    <p className="text-xs text-neutral-500">Відповімо протягом робочого дня</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5" htmlFor="name">
                      Ім'я *
                    </label>
                    <input
                      id="name" name="name" required
                      value={form.name} onChange={handleChange}
                      placeholder="Олексій"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 bg-white/5 border border-white/10 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5" htmlFor="phone">
                      Телефон *
                    </label>
                    <input
                      id="phone" name="phone" type="tel" required
                      value={form.phone} onChange={handleChange}
                      placeholder="+380 66 418 88 26"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 bg-white/5 border border-white/10 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5" htmlFor="message">
                      Повідомлення *
                    </label>
                    <textarea
                      id="message" name="message" required rows={5}
                      value={form.message} onChange={handleChange}
                      placeholder="Ваше питання або проблема..."
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 bg-white/5 border border-white/10 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.07] transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}

                  <button
                    type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                  >
                    {loading ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <Send size={15} />
                    )}
                    {loading ? "Надсилається..." : "Надіслати повідомлення"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
