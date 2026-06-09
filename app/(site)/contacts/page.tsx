"use client";

import { useState } from "react";
import { Phone, MapPin, Clock, CheckCircle2, Send, MessageSquare } from "lucide-react";

export default function ContactsPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name" && !/^[a-zA-Z\u0400-\u04FF\s\-']*$/.test(value)) return;
    if (name === "phone" && !/^[0-9+()\-\s]*$/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch { setError("Помилка відправки. Спробуйте ще раз або зателефонуйте нам."); }
    finally { setLoading(false); }
  };

  const info = [
    { icon: Phone, label: "Телефон", value: "+38 (066) 418-88-26", href: "tel:+380664188826" },
    { icon: MapPin, label: "Адреса", value: "Рівненська обл., с. Велика Омеляна, вул. Шевченка 35", href: "https://maps.google.com/?q=Велика+Омеляна+вул.Шевченка+35" },
    { icon: Clock, label: "Графік роботи", value: "Пн–Сб: 08:00 – 18:00", href: null },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%", borderRadius: 10, padding: "10px 14px", fontSize: 13,
    color: "var(--text)", background: "var(--surface2)",
    border: "1px solid var(--border)", outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "56px 16px 48px", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 70%)" }} />
        <p style={{ position: "relative", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--primary)", marginBottom: 10 }}>Зв&apos;язатись з нами</p>
        <h1 style={{ position: "relative", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>Контакти</h1>
        <p style={{ position: "relative", fontSize: 14, color: "var(--text-muted)", maxWidth: 380, margin: "0 auto" }}>
          Маєте питання або хочете записатись? Напишіть нам або зателефонуйте.
        </p>
      </section>

      {/* INFO CARDS */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px 16px" }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {info.map(({ icon: Icon, label, value, href }) => (
            <div key={label} style={{ background: "var(--surface)", borderRadius: 12, padding: "18px 18px", border: "1px solid var(--border)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon size={16} style={{ color: "var(--primary)" }} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginBottom: 4 }}>{label}</p>
              {href ? (
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", textDecoration: "none" }}>{value}</a>
              ) : (
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* MAP + FORM */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 48px" }}>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>

          {/* MAP */}
          <div style={{ background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", minHeight: 320 }}>
            <iframe
              title="Tirnew на карті"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.0!2d26.2300!3d50.6200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0JLQtdC70LjQutCwINCe0LzQtdC70Y_QvdCwLCDQstGD0LsuINCo0LXQstGH0LXQvdC60LAsMzU!5e0!3m2!1suk!2sua!4v1700000000000"
              width="100%" height="100%"
              style={{ minHeight: 320, display: "block" }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* FORM */}
          <div style={{ background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)", padding: "24px 20px" }}>
            {submitted ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <CheckCircle2 size={28} style={{ color: "#22c55e" }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Повідомлення надіслано!</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 260 }}>Ми отримали ваше повідомлення і зв&apos;яжемось найближчим часом.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", message: "" }); }} style={{ marginTop: 20, fontSize: 13, color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}>Надіслати ще одне</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageSquare size={15} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Напишіть нам</h2>
                    <p style={{ fontSize: 12, color: "var(--text-faint)" }}>Відповімо протягом робочого дня</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }} htmlFor="name">Ім&apos;я *</label>
                    <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Олексій" autoComplete="name" style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                      onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }} htmlFor="phone">Телефон *</label>
                    <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+380 66 418 88 26" autoComplete="tel" inputMode="numeric" style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                      onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }} htmlFor="message">Повідомлення *</label>
                    <textarea id="message" name="message" required rows={4} value={form.message} onChange={handleChange} placeholder="Ваше питання або проблема..." style={{ ...inputStyle, resize: "none" }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                      onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                  </div>
                  {error && <p style={{ fontSize: 13, color: "var(--primary)" }}>{error}</p>}
                  <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: 13, padding: "12px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.65 : 1 }}>
                    {loading ? <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> : <Send size={14} />}
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
