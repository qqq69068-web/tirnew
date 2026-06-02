"use client";

import { useEffect, useState, useCallback } from "react";
import { Suspense } from "react";
import {
  LogOut, Clock, CheckCircle2, Wrench, Search,
  ChevronRight, User, ReceiptText, Timer, Mail,
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
  const [debugInfo, setDebugInfo] = useState<string>("");

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch("/api/client/me", { credentials: "include" });
      console.log("[cabinet] /api/client/me status:", res.status);
      const data = await res.json();
      console.log("[cabinet] /api/client/me response:", data);
      setDebugInfo(`status: ${res.status} | ${JSON.stringify(data)}`);
      if (res.ok) setClient(data);
    } catch (e) {
      console.error("[cabinet] fetch error:", e);
      setDebugInfo(`fetch error: ${e}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const logout = async () => {
    await fetch("/api/client/logout", { method: "POST", credentials: "include" });
    setClient(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!client) return <AuthForm debugInfo={debugInfo} />;

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

const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 9999px #161616 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    caret-color: #ffffff;
  }
`;

function AuthForm({ debugInfo }: { debugInfo?: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/client/send-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-600/20 mx-auto mb-5">
          <Mail size={36} className="text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Перевірте пошту</h2>
        <p className="text-neutral-400">
          Надіслали посилання для входу на{" "}
          <strong className="text-white">{email}</strong>.
          {" "}Воно діє 30 хвилин.
        </p>
        <button
          onClick={() => { setSent(false); setEmail(""); }}
          className="mt-6 text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          ← Ввести інший email
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4">
      <style>{autofillStyle}</style>

      {debugInfo && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/30 text-xs text-red-300 break-all">
          <strong>Debug:</strong> {debugInfo}
        </div>
      )}

      <div className="text-center mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600/20 mx-auto mb-4">
          <User size={28} className="text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Увійти / зареєструватись</h2>
        <p className="text-neutral-500 mt-2 text-sm">
          Введіть email — надішлемо посилання. Без пароля.
        </p>
      </div>

      <form onSubmit={submit}
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        className="bg-white/5 rounded-3xl p-7 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            Email <span className="text-teal-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
              <Mail size={16} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem 0.75rem 2.75rem",
                fontSize: "0.875rem",
                color: "#ffffff",
                caretColor: "#ffffff",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                outline: "none",
              }}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
        >
          {loading ? "Надсилаємо..." : "Отримати посилання"}
        </button>
      </form>

      <p className="text-center text-xs text-neutral-600 mt-5">
        Немає акаунту? Акаунт створюється автоматично при першому вході.
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
