"use client";

import { useEffect, useState, useCallback } from "react";
import { Suspense } from "react";
import {
  LogOut, Clock, CheckCircle2, Wrench, Search,
  ChevronRight, User, ReceiptText, Timer, Mail, Phone,
} from "lucide-react";

interface Booking {
  id: string;
  service: string | null;
  carBrand: string | null;
  carModel: string | null;
  progress: string;
  price: number | null;
  createdAt: string;
  status: string;
}

interface Client {
  email: string;
  name: string | null;
  phone: string | null;
  bookings: Booking[];
}

const PROGRESS_STEPS = [
  { key: "received",    label: "Прийнято" },
  { key: "diagnostics", label: "Діагностика" },
  { key: "in_progress", label: "В роботі" },
  { key: "done",        label: "Готово" },
];

const PROGRESS_ICONS: Record<string, React.ReactNode> = {
  received:    <Clock size={14} />,
  diagnostics: <Search size={14} />,
  in_progress: <Wrench size={14} />,
  done:        <CheckCircle2 size={14} />,
};

function ProgressBar({ current }: { current: string }) {
  const idx = PROGRESS_STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-1 mt-4">
      {PROGRESS_STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center gap-1">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            i <= idx ? "bg-teal-600 text-white" : "bg-white/10 text-neutral-500"
          }`}>
            {PROGRESS_ICONS[step.key]}
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {i < PROGRESS_STEPS.length - 1 && (
            <ChevronRight size={12} className={i < idx ? "text-teal-500" : "text-neutral-700"} />
          )}
        </div>
      ))}
    </div>
  );
}

function StatsBar({ bookings }: { bookings: Booking[] }) {
  const total = bookings.length;
  const totalPrice = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const done = bookings.filter((b) => b.progress === "done").length;
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {[{
        icon: <ReceiptText size={20} className="mx-auto text-teal-400 mb-1" />,
        val: total, label: "Замовлень",
      }, {
        icon: <CheckCircle2 size={20} className="mx-auto text-teal-400 mb-1" />,
        val: done, label: "Виконано",
      }, {
        icon: <Timer size={20} className="mx-auto text-teal-400 mb-1" />,
        val: totalPrice > 0 ? `${totalPrice.toLocaleString()} ₴` : "—",
        label: "Витрачено", accent: true,
      }].map(({ icon, val, label, accent }) => (
        <div key={label} style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          className="bg-white/5 rounded-2xl p-4 text-center">
          {icon}
          <p className={`text-2xl font-bold ${accent ? "text-teal-400" : "text-white"}`}>{val}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

function CabinetContent() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch("/api/client/me");
      if (res.ok) setClient(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const logout = async () => {
    await fetch("/api/client/logout", { method: "POST" });
    setClient(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!client) return <AuthForm />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {client.name ? `Вітаємо, ${client.name}!` : "Особистий кабінет"}
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5">{client.email}</p>
        </div>
        <button onClick={logout}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-red-400 transition-colors">
          <LogOut size={16} /> Вийти
        </button>
      </div>

      {client.bookings.length > 0 && <StatsBar bookings={client.bookings} />}

      {client.bookings.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          <Wrench size={40} className="mx-auto mb-3 opacity-30" />
          <p>У вас ще немає замовлень</p>
          <a href="/services" className="mt-4 inline-block text-teal-400 hover:underline text-sm">
            Переглянути послуги →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2">Історія замовлень</h2>
          {client.bookings.map((b) => (
            <div key={b.id} style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {b.carBrand || b.carModel
                      ? `${b.carBrand || ""} ${b.carModel || ""}`.trim()
                      : "Авто не вказано"}
                  </p>
                  <p className="text-sm text-neutral-400 mt-0.5">{b.service || "Послуга"}</p>
                </div>
                <div className="text-right">
                  {b.price
                    ? <p className="font-bold text-teal-400 text-lg">{b.price.toLocaleString()} ₴</p>
                    : <p className="text-xs text-neutral-500">Ціна уточнюється</p>}
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {new Date(b.createdAt).toLocaleDateString("uk-UA")}
                  </p>
                </div>
              </div>
              <ProgressBar current={b.progress} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Стилі ─── */
const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 9999px #161616 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    caret-color: #ffffff;
  }
`;

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem 0.75rem 2.75rem",
  fontSize: "0.875rem",
  color: "#ffffff",
  caretColor: "#ffffff",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
  transition: "box-shadow 0.15s, border-color 0.15s",
};

function InputField({
  icon, label, type = "text", value, onChange, placeholder, required,
}: {
  icon: React.ReactNode;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        {label}{required && <span className="text-teal-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488";
            e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        />
      </div>
    </div>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"form" | "sent">("form");
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setName("");
    setPhone("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/client/send-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name:  mode === "register" ? name  : undefined,
        phone: mode === "register" ? phone : undefined,
      }),
    });
    setLoading(false);
    setStep("sent");
  };

  if (step === "sent") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-600/20 mx-auto mb-5">
          <Mail size={36} className="text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Перевірте пошту!</h2>
        <p className="text-neutral-400 max-w-sm mx-auto">
          Ми надіслали посилання для входу на{" "}
          <strong className="text-white">{email}</strong>.
          Воно діє 30 хвилин.
        </p>
        <button
          onClick={() => { setStep("form"); setEmail(""); setName(""); setPhone(""); }}
          className="mt-6 text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          ← Повернутись
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <style>{autofillStyle}</style>

      <div className="text-center mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600/20 mx-auto mb-4">
          <User size={28} className="text-teal-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">
          {mode === "login" ? "Увійти" : "Реєстрація"}
        </h1>
        <p className="text-neutral-400 mt-2 text-sm">
          {mode === "login"
            ? "Введіть email — надішлемо посилання для входу без пароля"
            : "Заповніть дані для створення акаунту"}
        </p>
      </div>

      <div style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        className="flex rounded-2xl bg-white/5 p-1 mb-6">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === m
                ? "bg-teal-600 text-white shadow-lg shadow-teal-900/40"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {m === "login" ? "Увійти" : "Реєстрація"}
          </button>
        ))}
      </div>

      <form onSubmit={submit}
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        className="bg-white/5 rounded-3xl p-7 space-y-4">

        {mode === "register" && (
          <InputField
            icon={<User size={16} />}
            label="Ім'я"
            value={name}
            onChange={(v) => setName(v.replace(/[^a-zA-ZЀ-ӿ\s\-']/g, ""))}
            placeholder="Олексій"
          />
        )}

        <InputField
          icon={<Mail size={16} />}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="your@email.com"
          required
        />

        {mode === "register" && (
          <InputField
            icon={<Phone size={16} />}
            label="Телефон"
            type="tel"
            value={phone}
            onChange={(v) => setPhone(v.replace(/[^0-9+()\s\-]/g, ""))}
            placeholder="+380 50 000 00 00"
            required
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors mt-2"
        >
          {loading
            ? "Надсилаємо..."
            : mode === "login"
              ? "Отримати посилання"
              : "Створити акаунт"}
        </button>
      </form>

      <p className="text-center text-xs text-neutral-600 mt-5">
        {mode === "login" ? (
          <>Немає акаунту?{" "}
            <button type="button" onClick={() => switchMode("register")}
              className="text-teal-500 hover:text-teal-400 transition-colors">
              Зареєструйтесь
            </button>
          </>
        ) : (
          <>Вже є акаунт?{" "}
            <button type="button" onClick={() => switchMode("login")}
              className="text-teal-500 hover:text-teal-400 transition-colors">
              Увійти
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export default function CabinetPage() {
  return (
    <main className="min-h-screen bg-[#09090b]">
      <section
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        className="bg-[#0f1923] text-white py-16 px-4 text-center">
        <p className="text-sm uppercase tracking-widest text-teal-400 mb-2 font-medium">Клієнтам</p>
        <h1 className="text-4xl md:text-5xl font-bold">Особистий кабінет</h1>
      </section>
      <section className="py-12 px-4">
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-500 border-t-transparent" />
          </div>
        }>
          <CabinetContent />
        </Suspense>
      </section>
    </main>
  );
}
