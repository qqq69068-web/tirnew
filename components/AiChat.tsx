"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, ChevronDown, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  bookingId?: string;
}

// Стан очікування email перед записом
interface EmailPending {
  bookData: Record<string, string>;
}

const QUICK_ACTIONS = [
  { label: "📅 Записатися",        text: "Хочу записатися на ремонт" },
  { label: "📋 Мої записи",        text: "Покажи мої записи" },
  { label: "🔧 Послуги",           text: "Які послуги ви надаєте?" },
  { label: "💰 Ціни",              text: "Які ціни на послуги?" },
  { label: "📍 Контакти",          text: "Контакти та адреса" },
  { label: "⏰ Графік роботи",     text: "Коли ви працюєте?" },
  { label: "🔍 Діагностика",       text: "Потрібна діагностика авто" },
  { label: "📜 Історія ремонтів",  text: "Покажи історію ремонтів" },
];

const WELCOME_UNAUTH = `Привіт! 👋

Я AI-помічник Tirnew Truck Service.

Можу:
• допомогти з вибором послуги
• відповісти на питання
• підказати ціни
• записати вас на ремонт прямо тут
• надати контакти та інформацію про сервіс

Чим можу допомогти?`;

const WELCOME_AUTH = `Привіт! 👋

Я AI-помічник Tirnew Truck Service.

Можу:
• показати ваші записи
• записати на ремонт прямо тут
• показати історію ремонтів
• проконсультувати щодо послуг
• відповісти на питання

Чим можу допомогти?`;

function parseBookAction(text: string): { bookData: Record<string, string>; displayText: string } | null {
  const tagMatch = text.match(/<BOOK_ACTION>([\s\S]*?)<\/BOOK_ACTION>/);
  if (tagMatch) {
    try {
      const bookData = JSON.parse(tagMatch[1].trim());
      if (!bookData.service) return null;
      const displayText = text.replace(/<BOOK_ACTION>[\s\S]*?<\/BOOK_ACTION>/, "").trim();
      return { bookData, displayText };
    } catch { /* fall through */ }
  }

  const jsonMatch = text.match(/\{[\s\S]*?"service"[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      const bookData = JSON.parse(jsonMatch[0]);
      if (!bookData.service) return null;
      const displayText = text.replace(jsonMatch[0], "").trim();
      return { bookData, displayText };
    } catch { /* not valid JSON */ }
  }

  return null;
}

function isConfirmation(text: string): boolean {
  const t = text.trim().toLowerCase();
  return ["так", "yes", "підтверджую", "підтвердити", "ок", "ok", "добре", "згоден", "погоджуюсь"].some((w) => t === w || t.startsWith(w));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [unread, setUnread] = useState(false);
  const [bookingPending, setBookingPending] = useState<{ data: Record<string, string>; msgIndex: number } | null>(null);
  // Очікуємо email від незареєстрованого перед показом підтвердження
  const [emailPending, setEmailPending] = useState<EmailPending | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => setIsAuth(r.ok))
      .catch(() => setIsAuth(false));
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const welcome = isAuth ? WELCOME_AUTH : WELCOME_UNAUTH;
    setMessages([{ role: "assistant", content: welcome }]);
  }, [isAuth]);

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const doBooking = useCallback(async (bookData: Record<string, string>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      const data = await res.json();
      if (data.ok) {
        const hasEmail = !!bookData.email;
        const successMsg = isAuth || hasEmail
          ? `✅ Запис підтверджено! Номер вашого запису: #${data.bookingId}\n\nМи зв'яжемося з вами найближчим часом для підтвердження часу. На вашу пошту надійшло підтвердження з посиланням для входу в особистий кабінет.`
          : `✅ Запис підтверджено! Номер вашого запису: #${data.bookingId}\n\nМи зв'яжемося з вами найближчим часом для підтвердження часу.`;
        setMessages((prev) => [...prev, { role: "assistant", content: successMsg, bookingId: data.bookingId }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: `❌ Не вдалось створити запис: ${data.error || "помилка"}. Спробуйте ще раз або зателефонуйте: +38 (066) 418-88-26` }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Помилка зв'язку. Спробуйте ще раз або зателефонуйте: +38 (066) 418-88-26" }]);
    } finally {
      setLoading(false);
      setBookingPending(null);
      setEmailPending(null);
    }
  }, [isAuth]);

  const confirmBooking = useCallback(async () => {
    if (!bookingPending) return;
    await doBooking(bookingPending.data);
  }, [bookingPending, doBooking]);

  const cancelBooking = useCallback(() => {
    setBookingPending(null);
    setEmailPending(null);
    setMessages((prev) => [...prev, { role: "assistant", content: "Запис скасовано. Якщо захочете — звертайтесь ще! 😊" }]);
  }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput("");

    // Якщо чекаємо email від незареєстрованого
    if (emailPending) {
      setMessages((prev) => [...prev, { role: "user", content }]);
      if (isValidEmail(content)) {
        // Явна типізація щоб TypeScript знав повний тип
        const bookDataWithEmail: Record<string, string> = {
          ...emailPending.bookData,
          email: content.trim(),
        };
        setEmailPending(null);
        // Показуємо підтвердження вже з email
        const bd = bookDataWithEmail;
        const confirmText =
          `Підготував запис:\n` +
          `📋 Послуга: ${bd["service"] || "—"}\n` +
          `🚛 Авто: ${bd["carBrand"] || "—"} ${bd["carModel"] || ""}\n` +
          `📅 Дата: ${bd["date"] ? new Date(bd["date"]).toLocaleString("uk-UA") : "буде узгоджено"}\n` +
          `👤 Ім'я: ${bd["name"] || "—"}\n` +
          `📞 Телефон: ${bd["phone"] || "—"}\n` +
          `📧 Email: ${bd["email"]}\n\n` +
          `Підтвердити запис?`;
        setMessages((prev) => [...prev, { role: "assistant", content: confirmText }]);
        setBookingPending({ data: bookDataWithEmail, msgIndex: 0 });
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "❗ Схоже, це не схоже на email-адресу. Будь ласка, вкажіть дійсний email (наприклад: ivan@gmail.com)" }]);
      }
      return;
    }

    // Якщо чекаємо підтвердження запису
    if (bookingPending && isConfirmation(content)) {
      setMessages((prev) => [...prev, { role: "user", content }]);
      confirmBooking();
      return;
    }

    const userMsg: Message = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const rawReply: string = data.reply || "Вибачте, не вдалось отримати відповідь.";

      const bookAction = parseBookAction(rawReply);
      if (bookAction) {
        const { bookData, displayText } = bookAction;

        // ЗАХИСТ: незареєстрований без email — спочатку запитати email
        if (!isAuth && !bookData.email) {
          const askEmailText =
            (displayText ? displayText + "\n\n" : "") +
            `📧 Майже готово! Залишилось вказати ваш email — на нього надійде підтвердження запису та посилання для входу в особистий кабінет де ви зможете стежити за статусом ремонту.\n\nВведіть ваш email:`;
          setMessages((prev) => [...prev, { role: "assistant", content: askEmailText }]);
          setEmailPending({ bookData });
          return;
        }

        // Є email (або авторизований) — показуємо підтвердження
        const confirmText = displayText ||
          `Підготував запис:\n` +
          `📋 Послуга: ${bookData.service || "—"}\n` +
          `🚛 Авто: ${bookData.carBrand || "—"} ${bookData.carModel || ""}\n` +
          `📅 Дата: ${bookData.date ? new Date(bookData.date).toLocaleString("uk-UA") : "буде узгоджено"}\n` +
          `👤 Ім'я: ${bookData.name || "—"}\n` +
          `📞 Телефон: ${bookData.phone || "—"}\n` +
          (bookData.email ? `📧 Email: ${bookData.email}\n` : "") +
          `\nПідтвердити запис?`;
        const msgIndex = next.length;
        setMessages((prev) => [...prev, { role: "assistant", content: confirmText }]);
        setBookingPending({ data: bookData, msgIndex });
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: rawReply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Помилка зв'язку. Спробуйте ще раз або зателефонуйте нам." }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, bookingPending, emailPending, isAuth, confirmBooking]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpen = () => { setOpen(true); setUnread(false); };

  // Підказка placeholder залежно від стану
  const getPlaceholder = () => {
    if (emailPending) return "Введіть ваш email...";
    if (bookingPending) return "Підтвердіть або скасуйте запис вище...";
    return "Напишіть повідомлення...";
  };

  return (
    <>
      {/* Trigger button — id="ai-chat-trigger" дозволяє відкривати чат з будь-якого місця на сайті */}
      <button
        id="ai-chat-trigger"
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label="AI-помічник"
        style={{
          position: "fixed",
          bottom: 24, right: 24, zIndex: 9998,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #dc2626, #991b1b)",
          color: "#fff", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(220,38,38,0.45), 0 2px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        {open ? <ChevronDown size={22} /> : <Bot size={22} />}
        {!open && unread && (
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 10, height: 10, borderRadius: "50%",
            background: "#22c55e", border: "2px solid #fff",
          }} />
        )}
      </button>

      <div
        style={{
          position: "fixed",
          bottom: 92, right: 24, zIndex: 9997,
          width: "min(390px, calc(100vw - 32px))",
          height: "min(600px, calc(100dvh - 120px))",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.1)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.25s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 16px",
          background: "linear-gradient(135deg, #dc2626, #991b1b)",
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Sparkles size={17} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>AI-помічник</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Tirnew Truck Service</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(255,255,255,0.15)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"; }}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{
          flex: 1, overflowY: "auto",
          padding: "14px 14px 6px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              gap: 7, alignItems: "flex-end",
            }}>
              {m.role === "assistant" && (
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: m.bookingId ? "linear-gradient(135deg, #16a34a, #15803d)" : "linear-gradient(135deg, #dc2626, #991b1b)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {m.bookingId ? <CheckCircle2 size={12} color="#fff" /> : <Bot size={12} color="#fff" />}
                </div>
              )}
              <div style={{
                maxWidth: "82%",
                padding: "9px 12px",
                borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.role === "user"
                  ? "var(--primary)"
                  : m.bookingId
                    ? "rgba(22,163,74,0.1)"
                    : "var(--surface2)",
                color: m.role === "user" ? "#fff" : "var(--text)",
                fontSize: 13, lineHeight: 1.55,
                whiteSpace: "pre-wrap", wordBreak: "break-word",
                boxShadow: "var(--shadow-sm)",
                border: m.bookingId ? "1px solid rgba(22,163,74,0.25)" : "none",
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {/* Підсвічений блок введення email */}
          {emailPending && !loading && (
            <div style={{
              paddingLeft: 33,
              padding: "8px 8px 8px 33px",
            }}>
              <div style={{
                background: "rgba(220,38,38,0.06)",
                border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 12,
                color: "var(--text-muted)",
              }}>
                📧 Введіть email у полі нижче для підтвердження запису
              </div>
            </div>
          )}

          {bookingPending && !loading && !emailPending && (
            <div style={{ display: "flex", gap: 8, paddingLeft: 33 }}>
              <button
                onClick={confirmBooking}
                style={{
                  flex: 1, padding: "8px 12px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  color: "#fff", border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                <CheckCircle2 size={14} /> Підтвердити запис
              </button>
              <button
                onClick={cancelBooking}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "var(--surface2)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  cursor: "pointer", fontSize: 12,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--surface-offset)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--surface2)"; }}
              >
                Скасувати
              </button>
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Bot size={12} color="#fff" />
              </div>
              <div style={{
                padding: "10px 14px",
                borderRadius: "14px 14px 14px 4px",
                background: "var(--surface2)",
                display: "flex", gap: 5, alignItems: "center",
              }}>
                <Loader2 size={13} style={{ color: "var(--text-muted)", animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Думаю...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div style={{
            padding: "6px 14px 8px",
            display: "flex", flexWrap: "wrap", gap: 5,
            borderTop: "1px solid var(--border)",
          }}>
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => sendMessage(a.text)}
                style={{
                  padding: "5px 10px",
                  borderRadius: 99,
                  border: "1px solid var(--border-strong)",
                  background: "var(--bg)",
                  color: "var(--text-muted)",
                  fontSize: 11, fontWeight: 500,
                  cursor: "pointer",
                  transition: "border-color 0.15s, color 0.15s, background 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                  (e.currentTarget as HTMLElement).style.color = "var(--primary)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLElement).style.background = "var(--bg)";
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        <div style={{
          padding: "10px 12px",
          borderTop: emailPending ? "1px solid rgba(220,38,38,0.3)" : "1px solid var(--border)",
          display: "flex", gap: 8, alignItems: "flex-end",
          background: emailPending ? "rgba(220,38,38,0.03)" : "var(--surface)",
          flexShrink: 0,
          transition: "background 0.2s, border-color 0.2s",
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            disabled={loading}
            rows={1}
            style={{
              flex: 1, resize: "none",
              border: emailPending ? "1px solid rgba(220,38,38,0.4)" : "1px solid var(--border-strong)",
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 13, lineHeight: 1.5,
              background: "var(--bg)",
              color: "var(--text)", outline: "none",
              maxHeight: 100, overflowY: "auto",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = emailPending ? "rgba(220,38,38,0.4)" : "var(--border-strong)"; }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: input.trim() && !loading ? "var(--primary)" : "var(--surface2)",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: input.trim() && !loading ? "#fff" : "var(--text-faint)",
              transition: "background 0.2s, color 0.2s, transform 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { if (input.trim() && !loading) (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
