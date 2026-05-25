"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LogOut, Clock, CheckCircle2, Wrench, Search, ChevronRight, User } from "lucide-react";

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

function CabinetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const fetchClient = useCallback(async () => {
    const res = await fetch("/api/client/me");
    if (res.ok) setClient(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setVerifying(true);
      fetch(`/api/client/verify?token=${token}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.ok) { router.replace("/cabinet"); fetchClient(); }
          else { setLoading(false); setVerifying(false); }
        });
    } else { fetchClient(); }
  }, [searchParams, router, fetchClient]);

  const logout = async () => {
    await fetch("/api/client/logout", { method: "POST" });
    setClient(null);
  };

  if (loading || verifying) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!client) return <LoginForm />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
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

      {client.bookings.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          <Wrench size={40} className="mx-auto mb-3 opacity-30" />
          <p>У вас ще немає замовлень</p>
          <a href="/booking" className="mt-4 inline-block text-teal-400 hover:underline text-sm">
            Записатись на сервіс →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {client.bookings.map((b) => (
            <div key={b.id} style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{b.carBrand} {b.carModel}</p>
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

/* Global autofill override injected once */
const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 9999px #1a1a1a inset !important;
    -webkit-text-fill-color: #ffffff !important;
    caret-color: #ffffff;
  }
`;

function LoginForm() {
  const [step, setStep] = useState<"form" | "sent">("form");
  const [email, setEmail]   = useState("");
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/client/send-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, phone }),
    });
    setLoading(false);
    setStep("sent");
  };

  if (step === "sent") {
    return (
      <div className="text-center py-16">
        <CheckCircle2 size={48} className="mx-auto text-teal-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Перевірте пошту!</h2>
        <p className="text-neutral-400 max-w-sm mx-auto">
          Ми надіслали посилання для входу на <strong className="text-white">{email}</strong>.
          Воно діє 30 хвилин.
        </p>
      </div>
    );
  }

  /* Explicit inline style to guarantee white text regardless of Tailwind purge */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    color: "#ffffff",
    caretColor: "#ffffff",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    transition: "box-shadow 0.15s",
  };

  const labelCls = "block text-sm font-medium text-neutral-300 mb-1";

  return (
    <div className="max-w-md mx-auto">
      {/* Inject autofill override */}
      <style>{autofillStyle}</style>

      <div className="text-center mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600/20 mx-auto mb-4">
          <User size={28} className="text-teal-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Особистий кабінет</h1>
        <p className="text-neutral-400 mt-2 text-sm">
          Введіть email — ми надішлемо посилання для входу без пароля
        </p>
      </div>

      <form onSubmit={submit} style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        className="bg-white/5 rounded-3xl p-8 space-y-4">

        <div>
          <label className={labelCls}>Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488")}
            onBlur={(e)  => (e.currentTarget.style.boxShadow = "none")}
          />
        </div>

        <div>
          <label className={labelCls}>Ім&apos;я</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-ZЀ-ӿ\s\-']/g, "");
              setName(val);
            }}
            placeholder="Олексій"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488")}
            onBlur={(e)  => (e.currentTarget.style.boxShadow = "none")}
          />
        </div>

        <div>
          <label className={labelCls}>Телефон</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9+()\s\-]/g, "");
              setPhone(val);
            }}
            placeholder="+380 50 000 00 00"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #0d9488")}
            onBlur={(e)  => (e.currentTarget.style.boxShadow = "none")}
          />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors">
          {loading ? "Надсилаємо..." : "Отримати посилання"}
        </button>
      </form>
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
