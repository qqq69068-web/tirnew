"use client";

import { useState, useEffect } from "react";
import { Package, CheckCircle2, Phone, User, Car, FileText, Hash, Info } from "lucide-react";

/* Autofill uses CSS vars so it adapts to both themes */
const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 9999px var(--surface2) inset !important;
    -webkit-text-fill-color: var(--text) !important;
    caret-color: var(--text);
  }
  .parts-input, .parts-textarea {
    width: 100%;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    font-size: 0.875rem;
    color: var(--text);
    caret-color: var(--text);
    background: var(--surface2);
    border: 1px solid var(--border-strong);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    font-family: inherit;
  }
  .parts-input-noi {
    padding-left: 1rem !important;
  }
  .parts-textarea {
    padding-left: 1rem;
    resize: none;
    min-height: 90px;
    line-height: 1.6;
  }
  .parts-input::placeholder,
  .parts-textarea::placeholder {
    color: var(--text-faint);
  }
  .parts-input:focus,
  .parts-textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-glow);
  }
`;

function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) {
  const clean = e.target.value.replace(/[^\d+\s\-]/g, "");
  setter(clean);
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label
      className="block text-sm font-medium mb-1.5"
      style={{ color: "var(--text-muted)" }}
    >
      {text}{" "}
      {required && <span style={{ color: "var(--primary)" }}>*</span>}
    </label>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-wider mb-4"
      style={{ color: "var(--text-faint)", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}
    >
      {label}
    </p>
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

  /* ── Success screen ── */
  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="text-center max-w-md">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full mx-auto mb-6"
            style={{ background: "var(--primary-subtle)", border: "1px solid var(--border-accent)" }}
          >
            <CheckCircle2 size={48} style={{ color: "var(--primary)" }} />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>Заявку отримано!</h2>
          <p className="mb-2" style={{ color: "var(--text-muted)" }}>
            Наш менеджер зв'яжеться з вами найближчим часом.
          </p>
          {session && (
            <p className="text-xs mb-8" style={{ color: "var(--primary)" }}>
              Замовлення відобразиться в особистому кабінеті
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <a
              href="/"
              className="inline-block font-semibold px-6 py-3 rounded-full text-sm"
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border-strong)",
                color: "var(--text)",
              }}
            >
              На головну
            </a>
            {session && (
              <a
                href="/cabinet"
                className="inline-block font-semibold px-6 py-3 rounded-full text-sm"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                Мій кабінет
              </a>
            )}
          </div>
        </div>
      </main>
    );
  }

  /* ── Main form ── */
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <style>{autofillStyle}</style>

      {/* Hero */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <p
          className="text-sm uppercase tracking-widest mb-2 font-medium"
          style={{ color: "var(--primary)" }}
        >
          Запчастини
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold mb-3"
          style={{ color: "var(--text)", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Замовлення деталей
        </h1>
        <p className="max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
          Підберемо оригінал або перевірений аналог, організуємо доставку. Залишайте заявку — ми займемось усім.
        </p>
      </section>

      {/* Form section */}
      <section className="max-w-2xl mx-auto px-4 py-12">

        {/* Session info banner */}
        {session && (
          <div
            className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl"
            style={{
              background: "var(--primary-subtle)",
              border: "1px solid var(--border-accent)",
            }}
          >
            <Info size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Замовлення буде прив'язано до вашого кабінету{" "}
              <span className="font-semibold" style={{ color: "var(--text)" }}>{session.email}</span>
            </p>
          </div>
        )}

        {/* Form card */}
        <div
          className="rounded-3xl p-6 md:p-10"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Card header */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "var(--primary-subtle)", border: "1px solid var(--border-accent)" }}
            >
              <Package size={20} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
                Заявка на запчастини
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Менеджер зв'яжеться для уточнення ціни і термінів
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-8">

            {/* 01 — Що потрібно */}
            <div>
              <SectionHeading label="01 — Що потрібно" />
              <div className="space-y-4">
                <div>
                  <Label text="Назва деталі" required />
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Package size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Супорт, підшипник, повітряний ремінь..."
                      value={form.partName}
                      onChange={(e) => set("partName", e.target.value)}
                      required
                      className="parts-input"
                    />
                  </div>
                </div>
                <div>
                  <Label text="Артикул (якщо знаєте)" />
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <FileText size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Наприклад: K58351"
                      value={form.partNumber}
                      onChange={(e) => set("partNumber", e.target.value)}
                      className="parts-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 02 — Для якого авто */}
            <div>
              <SectionHeading label="02 — Для якого авто" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label text="Марка" />
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Car size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Volvo, DAF, MAN..."
                      value={form.carBrand}
                      onChange={(e) => set("carBrand", e.target.value)}
                      className="parts-input"
                    />
                  </div>
                </div>
                <div>
                  <Label text="Модель / рік" />
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Car size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="FH16, 2018"
                      value={form.carModel}
                      onChange={(e) => set("carModel", e.target.value)}
                      className="parts-input"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Label text="VIN-код (необов'язково)" />
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Hash size={15} />
                  </span>
                  <input
                    type="text"
                    placeholder="17 символів"
                    value={form.vin}
                    onChange={(e) => set("vin", e.target.value.toUpperCase())}
                    maxLength={17}
                    className="parts-input"
                    style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
                  />
                </div>
              </div>
            </div>

            {/* 03 — Ваші контакти */}
            <div>
              <SectionHeading label="03 — Ваші контакти" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label text="Ім'я" required />
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <User size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Іван"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      required
                      className="parts-input"
                    />
                  </div>
                </div>
                <div>
                  <Label text="Телефон" required />
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Phone size={15} />
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="+38 050 000 00 00"
                      value={form.phone}
                      onChange={(e) => handlePhoneInput(e, (v) => set("phone", v))}
                      required
                      className="parts-input"
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
                  className="parts-textarea"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                className="text-sm px-4 py-3 rounded-xl"
                style={{
                  color: "var(--primary)",
                  background: "var(--primary-subtle)",
                  border: "1px solid var(--border-accent)",
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-3.5 rounded-xl text-sm transition-all"
              style={{
                background: "var(--primary)",
                color: "#fff",
                opacity: loading ? 0.6 : 1,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.01em",
              }}
            >
              {loading ? "Надсилаємо..." : "Надіслати заявку"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
