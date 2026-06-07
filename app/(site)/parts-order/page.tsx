"use client";

import { useState, useEffect } from "react";
import { Package, CheckCircle2, Phone, User, Car, FileText, Hash, Info } from "lucide-react";

const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 9999px #111827 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    caret-color: #ffffff;
  }
`;

const inp = {
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem 0.75rem 2.75rem",
  fontSize: "0.875rem",
  color: "#ffffff",
  caretColor: "#ffffff",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
} as const;

const inpNoIcon = { ...inp, paddingLeft: "1rem" } as const;
const taStyle = { ...inpNoIcon, resize: "none" as const, minHeight: "90px" };

function focus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488";
  e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)";
}
function blur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.boxShadow = "none";
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
      {text} {required && <span className="text-teal-400">*</span>}
    </label>
  );
}

export default function PartsOrderPage() {
  const [session, setSession] = useState<{ email: string; name: string | null; phone?: string | null } | null>(null);

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

  useEffect(() => {
    fetch("/api/client/me", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.email) {
          setSession({ email: data.email, name: data.name, phone: data.phone });
          setForm((f) => ({
            ...f,
            name:  f.name  || data.name  || "",
            phone: f.phone || data.phone || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const msgParts = [
        form.vin        ? `VIN: ${form.vin}` : "",
        form.partNumber ? `Артикул: ${form.partNumber}` : "",
        form.comment    ? `Коментар: ${form.comment}` : "",
      ].filter(Boolean).join(" | ");

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        form.name,
          phone:       form.phone,
          carBrand:    form.carBrand  || null,
          carModel:    form.carModel  || null,
          service:     `Замовлення запчастин: ${form.partName}`,
          message:     msgParts       || null,
          clientEmail: session?.email || null,
        }),
      });
      if (!res.ok) throw new Error();
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
          <p className="text-neutral-400 mb-2">
            Наш менеджер зв'яжеться з вами найближчим часом.
          </p>
          {session && (
            <p className="text-xs text-teal-400 mb-8">
              Замовлення відобразиться в особистому кабінеті
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <a
              href="/"
              className="inline-block bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
            >
              На головну
            </a>
            {session && (
              <a
                href="/cabinet"
                className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
              >
                Мій кабінет
              </a>
            )}
          </div>
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

      <section className="max-w-2xl mx-auto px-4 py-12">

        {/* Бейдж сесії */}
        {session && (
          <div
            className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl"
            style={{ background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.25)" }}
          >
            <Info size={15} className="text-teal-400 shrink-0" />
            <p className="text-sm text-teal-300">
              Замовлення буде прив'язано до вашого кабінету{" "}
              <span className="font-semibold text-white">{session.email}</span>
            </p>
          </div>
        )}

        {/* FORM CARD */}
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
              <p className="text-xs text-neutral-500">Менеджер зв'яжеться для уточнення ціни і термінів</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-8">

            {/* Блок 1: Деталь */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">01 — Що потрібно</p>
              <div className="space-y-4">

                <div>
                  <Label text="Назва деталі" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                      <Package size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Супорт, підшипник, повітряний ремінь..."
                      value={form.partName}
                      onChange={(e) => set("partName", e.target.value)}
                      required
                      style={inp}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                </div>

                <div>
                  <Label text="Артикул (якщо знаєте)" />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                      <FileText size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Наприклад: K58351"
                      value={form.partNumber}
                      onChange={(e) => set("partNumber", e.target.value)}
                      style={inp}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Блок 2: Авто */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">02 — Для якого авто</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label text="Марка" />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                      <Car size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Volvo, DAF, MAN..."
                      value={form.carBrand}
                      onChange={(e) => set("carBrand", e.target.value)}
                      style={inp}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                </div>

                <div>
                  <Label text="Модель / рік" />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                      <Car size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="FH16, 2018"
                      value={form.carModel}
                      onChange={(e) => set("carModel", e.target.value)}
                      style={inp}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label text="VIN-код (необов'язково)" />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                    <Hash size={15} />
                  </span>
                  <input
                    type="text"
                    placeholder="17 символів"
                    value={form.vin}
                    onChange={(e) => set("vin", e.target.value.toUpperCase())}
                    maxLength={17}
                    style={{ ...inp, fontFamily: "monospace", letterSpacing: "0.05em" }}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </div>
              </div>
            </div>

            {/* Блок 3: Контакти */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">03 — Ваші контакти</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label text="Ім'я" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                      <User size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Іван"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      required
                      style={inp}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                </div>

                <div>
                  <Label text="Телефон" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                      <Phone size={15} />
                    </span>
                    <input
                      type="tel"
                      placeholder="+38 050 000 00 00"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      required
                      style={inp}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label text="Коментар" />
                <textarea
                  placeholder="Кількість, терміновість, особливості..."
                  value={form.comment}
                  onChange={(e) => set("comment", e.target.value)}
                  style={taStyle}
                  onFocus={focus}
                  onBlur={blur}
                />
              </div>
            </div>

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
