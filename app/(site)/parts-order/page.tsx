"use client";

import { useState } from "react";
import { Package, CheckCircle2, Phone, User, Car, FileText, Hash, ChevronRight } from "lucide-react";

const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 9999px #0f1923 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    caret-color: #ffffff;
  }
`;

const inputStyle = {
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem 0.75rem 2.75rem",
  fontSize: "0.875rem",
  color: "#ffffff",
  caretColor: "#ffffff",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
};

const inputStyleNoIcon = {
  ...inputStyle,
  paddingLeft: "1rem",
};

const textareaStyle = {
  ...inputStyleNoIcon,
  resize: "none" as const,
  minHeight: "100px",
};

function Field({
  icon,
  label,
  required,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        {label} {required && <span className="text-teal-400">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
            {icon}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

export default function PartsOrderPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    carBrand: "",
    carModel: "",
    vin: "",
    partName: "",
    partNumber: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const message = [
        form.vin ? `VIN: ${form.vin}` : "",
        form.partName ? `Деталь: ${form.partName}` : "",
        form.partNumber ? `Артикул: ${form.partNumber}` : "",
        form.comment ? `Коментар: ${form.comment}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          carBrand: form.carBrand || null,
          carModel: form.carModel || null,
          service: "Замовлення запчастин",
          message: message || null,
        }),
      });
      if (!res.ok) throw new Error("server error");
      setSent(true);
    } catch {
      setError("Сталася помилка. Спробуйте ще раз або зателефонуйте нам.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-600/20 mx-auto mb-6">
            <CheckCircle2 size={48} className="text-teal-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Заявку отримано!</h2>
          <p className="text-neutral-400 mb-8">
            Наш менеджер зв'яжеться з вами найближчим часом для уточнення деталей і вартості.
          </p>
          <a
            href="/"
            className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            На головну
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b]">
      <style>{autofillStyle}</style>

      {/* HERO */}
      <section
        className="bg-[#0f1923] text-white py-16 px-4 text-center"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-sm uppercase tracking-widest text-teal-400 mb-2 font-medium">Запчастини</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Замовлення деталей</h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Підберемо оригінал або перевірений аналог, організуємо доставку. Залишайте заявку — ми займемось усім.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6">Як це працює</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { num: "1", title: "Залишаєте заявку", desc: "Вказуєте деталь, артикул або VIN авто" },
            { num: "2", title: "Ми підбираємо", desc: "Знаходимо оригінал або кращий аналог за ціною" },
            { num: "3", title: "Доставка або самовивіз", desc: "Доставляємо або ви забираєте у нас на СТО" },
          ].map((step, i, arr) => (
            <div key={step.num} className="flex items-start gap-3">
              <div
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                className="bg-white/5 rounded-2xl p-5 flex-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-teal-400">{step.num}</span>
                  {i < arr.length - 1 && (
                    <ChevronRight size={16} className="text-neutral-700 sm:hidden" />
                  )}
                </div>
                <p className="font-semibold text-white text-sm mb-1">{step.title}</p>
                <p className="text-neutral-500 text-xs">{step.desc}</p>
              </div>
              {i < arr.length - 1 && (
                <ChevronRight size={18} className="text-neutral-700 mt-6 hidden sm:block shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* FORM */}
        <div
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          className="bg-white/3 rounded-3xl p-6 md:p-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/20">
              <Package size={20} className="text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Заявка на запчастини</h2>
              <p className="text-xs text-neutral-500">Заповніть форму — менеджер зв'яжеться з вами</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Row: name + phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field icon={<User size={15} />} label="Ваше ім'я" required>
                <input
                  type="text"
                  placeholder="Іван Іваненко"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488"; e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)"; }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </Field>
              <Field icon={<Phone size={15} />} label="Телефон" required>
                <input
                  type="tel"
                  placeholder="+38 050 000 00 00"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488"; e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)"; }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </Field>
            </div>

            {/* Row: carBrand + carModel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field icon={<Car size={15} />} label="Марка авто">
                <input
                  type="text"
                  placeholder="Volvo, DAF, MAN..."
                  value={form.carBrand}
                  onChange={(e) => set("carBrand", e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488"; e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)"; }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </Field>
              <Field icon={<Car size={15} />} label="Модель / рік">
                <input
                  type="text"
                  placeholder="FH16, 2018"
                  value={form.carModel}
                  onChange={(e) => set("carModel", e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488"; e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)"; }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </Field>
            </div>

            {/* VIN */}
            <Field icon={<Hash size={15} />} label="VIN-код (необов'язково)">
              <input
                type="text"
                placeholder="17 символів"
                value={form.vin}
                onChange={(e) => set("vin", e.target.value.toUpperCase())}
                maxLength={17}
                style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.05em" }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488"; e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </Field>

            {/* Part name + number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field icon={<Package size={15} />} label="Назва деталі" required>
                <input
                  type="text"
                  placeholder="Супорт, підшипник..."
                  value={form.partName}
                  onChange={(e) => set("partName", e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488"; e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)"; }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </Field>
              <Field icon={<FileText size={15} />} label="Артикул (якщо є)">
                <input
                  type="text"
                  placeholder="К58351"
                  value={form.partNumber}
                  onChange={(e) => set("partNumber", e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488"; e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)"; }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </Field>
            </div>

            {/* Comment */}
            <Field label="Додатковий коментар">
              <textarea
                placeholder="Кількість, терміновість, особливості..."
                value={form.comment}
                onChange={(e) => set("comment", e.target.value)}
                style={textareaStyle}
                onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488"; e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </Field>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              {loading ? "Надсилаємо..." : "Надіслати заявку"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
