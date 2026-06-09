"use client";

import { useEffect, useState, useCallback } from "react";
import { Suspense } from "react";
import { LogOut, Clock, CheckCircle2, Wrench, Search, ChevronRight, User, ReceiptText, Timer, Mail, Package } from "lucide-react";

interface Booking {
  id: string; service: string | null; carBrand: string | null; carModel: string | null;
  progress: string; price: number | null; partsCost: number | null;
  workItems: string[]; createdAt: string; status: string;
}
interface Client { email: string; name: string | null; phone: string | null; bookings: Booking[]; }

const PROGRESS_STEPS = [
  { key: "received",    label: "Прийнято" },
  { key: "diagnostics", label: "Діагностика" },
  { key: "in_progress", label: "В роботі" },
  { key: "done",        label: "Готово" },
];

const PROGRESS_ICONS: Record<string, React.ReactNode> = {
  received: <Clock size={13} />, diagnostics: <Search size={13} />,
  in_progress: <Wrench size={13} />, done: <CheckCircle2 size={13} />,
};

function ProgressBar({ current }: { current: string }) {
  const idx = PROGRESS_STEPS.findIndex((s) => s.key === current);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 14, flexWrap: "wrap" }}>
      {PROGRESS_STEPS.map((step, i) => (
        <div key={step.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500,
            background: i <= idx ? "var(--accent)" : "var(--surface2)",
            color: i <= idx ? "#fff" : "var(--text-faint)",
            border: "1px solid " + (i <= idx ? "var(--accent)" : "var(--border)"),
          }}>
            {PROGRESS_ICONS[step.key]}
            <span>{step.label}</span>
          </div>
          {i < PROGRESS_STEPS.length - 1 && (
            <ChevronRight size={11} style={{ color: i < idx ? "var(--accent)" : "var(--text-faint)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function StatsBar({ bookings }: { bookings: Booking[] }) {
  const total = bookings.length;
  const totalPrice = bookings.reduce((s, b) => s + (b.price || 0) + (b.partsCost || 0), 0);
  const done = bookings.filter((b) => b.progress === "done").length;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
      {[
        { icon: <ReceiptText size={18} style={{ color: "var(--accent)" }} />, val: total, label: "Замовлень" },
        { icon: <CheckCircle2 size={18} style={{ color: "var(--accent)" }} />, val: done, label: "Виконано" },
        { icon: <Timer size={18} style={{ color: "var(--accent)" }} />, val: totalPrice > 0 ? `${totalPrice.toLocaleString()} ₴` : "—", label: "Витрачено" },
      ].map(({ icon, val, label }) => (
        <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{icon}</div>
          <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{val}</p>
          <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function BookingCard({ b }: { b: Booking }) {
  const totalCost = (b.price || 0) + (b.partsCost || 0);
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>
            {b.carBrand || b.carModel ? `${b.carBrand || ""} ${b.carModel || ""}`.trim() : "Авто не вказано"}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{b.service || "Послуга"}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          {totalCost > 0 ? (
            <p style={{ fontWeight: 700, color: "var(--accent)", fontSize: 16 }}>{totalCost.toLocaleString()} ₴</p>
          ) : (
            <p style={{ fontSize: 12, color: "var(--text-faint)" }}>Ціна уточнюється</p>
          )}
          <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>{new Date(b.createdAt).toLocaleDateString("uk-UA")}</p>
        </div>
      </div>
      {(b.price || b.partsCost) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {b.price ? <span style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 99, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}><Wrench size={10} /> Робота: {b.price.toLocaleString()} ₴</span> : null}
          {b.partsCost ? <span style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 99, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}><Package size={10} /> Деталі: {b.partsCost.toLocaleString()} ₴</span> : null}
        </div>
      )}
      {b.workItems && b.workItems.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Виконані роботи</p>
          {b.workItems.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
              <span style={{ color: "var(--accent)", flexShrink: 0 }}>✓</span> {item}
            </div>
          ))}
        </div>
      )}
      <ProgressBar current={b.progress} />
    </div>
  );
}

function AuthForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await fetch("/api/client/send-magic-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setLoading(false); setSent(true);
  };

  if (sent) return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "60px 16px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(15,118,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Mail size={30} style={{ color: "var(--accent)" }} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Перевірте пошту</h2>
      <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Надіслали посилання для входу на <strong style={{ color: "var(--text)" }}>{email}</strong>. Воно діє 30 хвилин.</p>
      <button onClick={() => { setSent(false); setEmail(""); }} style={{ marginTop: 20, fontSize: 13, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>← Ввести інший email</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 360, margin: "0 auto", padding: "0 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(15,118,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <User size={24} style={{ color: "var(--accent)" }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Увійти / зареєструватись</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Введіть email — надішлемо посилання. Без пароля.</p>
      </div>
      <form onSubmit={submit} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Email <span style={{ color: "var(--accent)" }}>*</span></label>
          <div style={{ position: "relative" }}>
            <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
              style={{ width: "100%", borderRadius: 10, padding: "10px 12px 10px 36px", fontSize: 13, color: "var(--text)", background: "var(--surface2)", border: "1px solid var(--border)", outline: "none" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
            />
          </div>
        </div>
        <button type="submit" disabled={loading} style={{ background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: 13, padding: "12px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.65 : 1 }}>
          {loading ? "Надсилаємо..." : "Отримати посилання"}
        </button>
      </form>
      <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-faint)", marginTop: 14 }}>Акаунт створюється автоматично при першому вході.</p>
    </div>
  );
}

function CabinetContent() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch("/api/client/me", { credentials: "include" });
      if (res.ok) setClient(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const logout = async () => {
    await fetch("/api/client/logout", { method: "POST", credentials: "include" });
    setClient(null);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
    </div>
  );

  if (!client) return <AuthForm />;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
            {client.name ? `Вітаємо, ${client.name}!` : "Особистий кабінет"}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{client.email}</p>
        </div>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          <LogOut size={15} /> Вийти
        </button>
      </div>
      {client.bookings.length > 0 && <StatsBar bookings={client.bookings} />}
      {client.bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-faint)" }}>
          <Wrench size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
          <p>У вас ще немає замовлень</p>
          <a href="/services" style={{ marginTop: 12, display: "inline-block", fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>Переглянути послуги →</a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginBottom: 4 }}>Історія замовлень</h2>
          {client.bookings.map((b) => <BookingCard key={b.id} b={b} />)}
        </div>
      )}
    </div>
  );
}

export default function CabinetPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <section style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "48px 16px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)", marginBottom: 8 }}>Клієнтам</p>
        <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "var(--text)" }}>Особистий кабінет</h1>
      </section>
      <section style={{ padding: "28px 0" }}>
        <Suspense fallback={
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
          </div>
        }>
          <CabinetContent />
        </Suspense>
      </section>
    </main>
  );
}
