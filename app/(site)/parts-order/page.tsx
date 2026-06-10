"use client";

import { useState, useEffect } from "react";
import { Package, CheckCircle2, Phone, User, Car, FileText, Hash, Info } from "lucide-react";

const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 9999px var(--bg2) inset !important;
    -webkit-text-fill-color: var(--text) !important;
    caret-color: var(--text);
  }
`;

const inp = {
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem 0.75rem 2.75rem",
  fontSize: "0.875rem",
  color: "var(--text)",
  caretColor: "var(--text)",
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

function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) {
  const clean = e.target.value.replace(/[^\d+\s\-]/g, "");
  setter(clean);
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
      {text} {required && <span style={{ color: "var(--accent)" }}>*</span>}
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
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="text-center max-w-md">
          <div className="flex h-24 w-24 items-center justify-center rounded-full mx-auto mb-6"
            style={{ background: "rgba(13,148,136,0.15)" }}>
            <CheckCircle2 size={48} style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>Заявку отримано!</h2>
          <p className="mb-2" style={{ color: "var(--text-muted)" }}>
            Наш менеджер зв'яжеться з вами найближчим часом.
          </p>
          {session && (
            <p className="text-xs mb-8" style={{ color: "var(--accent)" }}>
              Замовлення відобразиться в особистому кабінеті
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <a href="/" className="inline-block font-semibold px-6 py-3 rounded-full transition-colors text-sm"
              style={{ background: "rgba(255,255,255,0.08)", color: "var(--text)" }}>
              На головну
            </a>
            {session && (
              <a href="/cabinet" className="inline-block font-semibold px-6 py-3 rounded-full transition-colors text-sm"
                style={{ background: "var(--accent)", color: "#fff" }}>
                Мій кабінет
              </a>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <style>{autofillStyle}</style>

      {/* Hero */}
      <section
        className="text-white py-16 px-4 text-center"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <p className="text-sm uppercase tracking-widest mb-2 font-medium" style={{ color: "var(--accent)" }}>
          Запчастини
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "var(--text)" }}>
          Замовлення деталей
        </h1>
        <p className="max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
          Підберемо оригінал або перевірений аналог, організуємо доставку. Залишайте заявку — ми займемось усім.
        </p>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        {session && (
          <div
            className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl"
            style={{ background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.25)" }}
          >
            <Info size={15} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "var(--accent-light, #5eead4)" }}>
              Замовлення буде прив'язано до вашого кабінету{" "}
              <span className="font-semibold" style={{ color: "var(--text)" }}>{session.email}</span>
            </p>
          </div>
        )}

        <div
          className="rounded-3xl p-6 md:p-10"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(13,148,136,0.15)" }}>
              <Package size={20} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>Заявка на запчастини</h2>
              <p className="text-xs" style={{ color: "var(--text-subtle, var(--text-muted))" }}>
                Менеджер зв'яжеться для уточнення ціни і термінів
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-8">

            {/* 01 */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--text-muted)" }}>
                01 — Що потрібно
              </p>
              <div className="space-y-4">
                <div>
                  <Label text="Назва деталі" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}>
                      <Package size={15} />
                    </span>
                    <input type="text" placeholder="Супорт, підшипник, повітряний ремінь..."
                      value={form.partName} onChange={(e) => set("partName", e.target.value)}
                      required style={inp} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
                <div>
                  <Label text="Артикул (якщо знаєте)" />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}>
                      <FileText size={15} />
                    </span>
                    <input type="text" placeholder="Наприклад: K58351"
                      value={form.partNumber} onChange={(e) => set("partNumber", e.target.value)}
                      style={inp} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
              </div>
            </div>

            {/* 02 */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--text-muted)" }}>
                02 — Для якого авто
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label text="Марка" />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}>
                      <Car size={15} />
                    </span>
                    <input type="text" placeholder="Volvo, DAF, MAN..."
                      value={form.carBrand} onChange={(e) => set("carBrand", e.target.value)}
                      style={inp} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
                <div>
                  <Label text="Модель / рік" />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}>
                      <Car size={15} />
                    </span>
                    <input type="text" placeholder="FH16, 2018"
                      value={form.carModel} onChange={(e) => set("carModel", e.target.value)}
                      style={inp} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Label text="VIN-код (необов'язково)" />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--text-muted)" }}>
                    <Hash size={15} />
                  </span>
                  <input type="text" placeholder="17 символів"
                    value={form.vin}
                    onChange={(e) => set("vin", e.target.value.toUpperCase())}
                    maxLength={17}
                    style={{ ...inp, fontFamily: "monospace", letterSpacing: "0.05em" }}
                    onFocus={focus} onBlur={blur} />
                </div>
              </div>
            </div>

            {/* 03 */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--text-muted)" }}>
                03 — Ваші контакти
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label text="Ім'я" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}>
                      <User size={15} />
                    </span>
                    <input type="text" placeholder="Іван"
                      value={form.name} onChange={(e) => set("name", e.target.value)}
                      required style={inp} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
                <div>
                  <Label text="Телефон" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}>
                      <Phone size={15} />
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="+38 050 000 00 00"
                      value={form.phone}
                      onChange={(e) => handlePhoneInput(e, (v) => set("phone", v))}
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
                  value={form.comment} onChange={(e) => set("comment", e.target.value)}
                  style={taStyle} onFocus={focus} onBlur={blur} />
              </div>
            </div>

            {error && (
              <p className="text-sm px-4 py-3 rounded-xl"
                style={{ color: "var(--primary)", background: "rgba(185,28,28,0.1)" }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full font-semibold py-3.5 rounded-xl transition-colors text-sm"
              style={{ background: "var(--accent)", color: "#fff", opacity: loading ? 0.6 : 1 }}>
              {loading ? "Надсилаємо..." : "Надіслати заявку"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
