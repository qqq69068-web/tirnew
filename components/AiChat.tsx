"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, User, Calendar, CheckCircle2, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  bookingId?: string;
}

interface BookingData {
  service?: string;
  carBrand?: string;
  carModel?: string;
  carCategory?: string;
  date?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

const QUICK_SUGGESTIONS = [
  { label: "📅 Записатись на ремонт", text: "Хочу записатись на ремонт" },
  { label: "🔧 Які послуги є?", text: "Які послуги ви надаєте?" },
  { label: "💰 Скільки коштує ТО?", text: "Скільки коштує технічне обслуговування?" },
  { label: "🕐 Час роботи", text: "Який у вас графік роботи?" },
];

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingPending, setBookingPending] = useState<BookingData | null>(null);
  const [emailPending, setEmailPending] = useState<BookingData | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/client/me", { credentials: "include" })
      .then((r) => r.ok ? setIsAuth(true) : setIsAuth(false))
      .catch(() => setIsAuth(false));
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "Добридень! Я ваш AI-помічник DVTrucks. Можу допомогти з записом, відповісти на питання про послуги чи ціни. Оберіть варіант або напишіть своє питання!",
      }]);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          ? `✅ Запис підтверджено! Номер вашого запису: #${data.bookingId}\n\nМи зв'яжемось з вами найближчим часом для підтвердження часу. На вашу пошту надійшло підтвердження з посиланням для входу в особистий кабінет.`
          : `✅ Запис підтверджено! Номер вашого запису: #${data.bookingId}\n\nМи зв'яжемось з вами найближчим часом для підтвердження часу.`;
        setMessages((prev) => [...prev, { role: "assistant", content: successMsg, bookingId: data.bookingId }]);
      } else {
        const errMsg = data.error === "no_slots"
          ? "❌ На жаль, цей час вже зайнятий. Усі майстри зайняті. Будь ласка, вкажіть інший час або день — і я запишу вас."
          : `❌ Не вдалось створити запис: ${data.error || "помилка"}. Спробуйте ще раз або зателефонуйте: +38 (066) 418-88-26`;
        setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
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
    await doBooking(bookingPending as Record<string, string>);
  }, [bookingPending, doBooking]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (emailPending) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(text.trim())) {
        const bookData = { ...emailPending, email: text.trim() };
        setEmailPending(null);
        setLoading(false);
        await doBooking(bookData as Record<string, string>);
        return;
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Похоже, email неправильний. Спробуйте ще раз або напишіть 'пропустити'." }]);
        setLoading(false);
        return;
      }
    }

    try {
      // Формуємо масив повідомлень у форматі який очікує API
      const apiMessages = [...messages.slice(-13), userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: "❌ Помилка сервера. Спробуйте ще раз." }]);
        return;
      }

      const reply: string = data.reply || "";

      // Перевіряємо чи є дія запису в відповіді
      const bookMatch = reply.match(/<BOOK_ACTION>\s*([\s\S]*?)\s*<\/BOOK_ACTION>/);
      if (bookMatch) {
        try {
          const booking: BookingData = JSON.parse(bookMatch[1]);
          if (!isAuth && !booking.email) {
            setEmailPending(booking);
            setMessages((prev) => [...prev, {
              role: "assistant",
              content: `Чудово, майже все готово! \n\nОстаннє питання: вкажіть ваш email, щоб ви могли стежити статус ремонту в особистому кабінеті. Або напишіть 'пропустити'.`,
            }]);
          } else {
            setBookingPending(booking);
            const b = booking;
            const dateStr = b.date ? new Date(b.date).toLocaleString("uk-UA", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "не вказано";
            const confirmMsg = `Підтверджуємо запис:\n\n🔧 Послуга: ${b.service || "—"}\n🚗 Авто: ${[b.carBrand, b.carModel].filter(Boolean).join(" ") || "—"}\n📅 Час: ${dateStr}\n👤 Ім'я: ${b.name || "—"}\n📱 Телефон: ${b.phone || "—"}\n\nНатисніть "Підтвердити" або "Скасувати" для виправлення даних.`;
            setMessages((prev) => [...prev, { role: "assistant", content: confirmMsg }]);
          }
        } catch {
          setMessages((prev) => [...prev, { role: "assistant", content: reply.replace(/<BOOK_ACTION>[\s\S]*?<\/BOOK_ACTION>/, "").trim() || "Щось пішло не так. Спробуйте ще раз." }]);
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: reply || "Не вдалось отримати відповідь. Спробуйте ще раз." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Помилка зв'язку. Спробуйте ще раз." }]);
    } finally {
      setLoading(false);
    }
  }, [messages, isAuth, emailPending, doBooking]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="ai-chat-bubble"
        aria-label="Відкрити AI-помічник"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="ai-chat-panel">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="ai-chat-avatar">
                <Bot size={16} />
              </div>
              <div>
                <p className="ai-chat-title">AI-помічник</p>
                <p className="ai-chat-subtitle">DVTrucks</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="ai-chat-close" aria-label="Закрити">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ai-msg--${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="ai-msg-avatar">
                    <Bot size={12} />
                  </div>
                )}
                <div className="ai-msg-bubble">
                  {msg.content.split("\n").map((line, j) => (
                    <span key={j}>{line}{j < msg.content.split("\n").length - 1 && <br />}</span>
                  ))}
                  {msg.bookingId && (
                    <div className="ai-msg-booking-badge">
                      <CheckCircle2 size={12} />
                      Запис #{msg.bookingId}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="ai-msg-avatar ai-msg-avatar--user">
                    <User size={12} />
                  </div>
                )}
              </div>
            ))}

            {showSuggestions && (
              <div className="ai-suggestions">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    className="ai-suggestion-chip"
                    onClick={() => sendMessage(s.text)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="ai-msg ai-msg--assistant">
                <div className="ai-msg-avatar"><Bot size={12} /></div>
                <div className="ai-msg-bubble ai-msg-bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {bookingPending && !loading && (
              <div className="ai-confirm-row">
                <button onClick={confirmBooking} className="ai-confirm-btn ai-confirm-btn--ok">
                  <CheckCircle2 size={13} /> Підтвердити
                </button>
                <button
                  onClick={() => {
                    setBookingPending(null);
                    setMessages((prev) => [...prev, { role: "assistant", content: "Добре, запис скасовано. Що змінити?" }]);
                  }}
                  className="ai-confirm-btn ai-confirm-btn--cancel"
                >
                  Скасувати
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-chat-input-row">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишіть повідомлення..."
              disabled={loading}
              className="ai-chat-input"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="ai-chat-send"
              aria-label="Надіслати"
            >
              {loading ? <Loader2 size={16} className="ai-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .ai-chat-bubble {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #4a9e6b;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(74,158,107,0.40);
          border: none;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .ai-chat-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(74,158,107,0.50); }
        .ai-chat-bubble:active { transform: scale(0.96); }

        .ai-chat-panel {
          position: fixed;
          bottom: 88px;
          right: 24px;
          z-index: 1000;
          width: 360px;
          max-width: calc(100vw - 32px);
          height: 520px;
          max-height: calc(100dvh - 120px);
          background: var(--surface, #fff);
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 18px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.14);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: ai-panel-in 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes ai-panel-in {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .ai-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border, #e5e7eb);
          background: var(--surface, #fff);
          flex-shrink: 0;
        }
        .ai-chat-header-info { display: flex; align-items: center; gap: 10px; }
        .ai-chat-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(74,158,107,0.12);
          color: #4a9e6b;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ai-chat-title { font-size: 13px; font-weight: 700; color: var(--text, #111); }
        .ai-chat-subtitle { font-size: 11px; color: var(--text-muted, #888); margin-top: 1px; }
        .ai-chat-close {
          width: 28px; height: 28px; border-radius: 8px;
          color: var(--text-muted, #888); background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .ai-chat-close:hover { background: var(--surface2, #f5f5f5); }

        .ai-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scroll-behavior: smooth;
        }

        .ai-msg { display: flex; gap: 8px; align-items: flex-end; }
        .ai-msg--user { flex-direction: row-reverse; }
        .ai-msg-avatar {
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(74,158,107,0.12); color: #4a9e6b;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ai-msg-avatar--user { background: #4a9e6b; color: #fff; }
        .ai-msg-bubble {
          max-width: 78%;
          padding: 9px 13px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.5;
          word-break: break-word;
          background: var(--surface2, #f5f7f5);
          color: var(--text, #111);
          border-bottom-left-radius: 4px;
        }
        .ai-msg--user .ai-msg-bubble {
          background: #4a9e6b;
          color: #fff;
          border-bottom-left-radius: 14px;
          border-bottom-right-radius: 4px;
        }
        .ai-msg-bubble--typing {
          display: flex; gap: 4px; align-items: center; padding: 12px 16px;
        }
        .ai-msg-bubble--typing span {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--text-muted, #aaa);
          animation: ai-bounce 1.2s infinite;
        }
        .ai-msg-bubble--typing span:nth-child(2) { animation-delay: 0.2s; }
        .ai-msg-bubble--typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ai-bounce {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }

        .ai-msg-booking-badge {
          display: inline-flex; align-items: center; gap: 4px;
          margin-top: 6px; font-size: 11px; font-weight: 600;
          color: #4a9e6b; background: rgba(74,158,107,0.12);
          border-radius: 99px; padding: 2px 8px;
        }

        .ai-suggestions {
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding: 2px 0 4px 32px;
        }
        .ai-suggestion-chip {
          align-self: flex-start;
          padding: 7px 13px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          background: var(--surface, #fff);
          color: #4a9e6b;
          border: 1.5px solid rgba(74,158,107,0.35);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.12s;
          text-align: left;
          white-space: nowrap;
        }
        .ai-suggestion-chip:hover {
          background: rgba(74,158,107,0.08);
          border-color: #4a9e6b;
          transform: translateY(-1px);
        }
        .ai-suggestion-chip:active { transform: scale(0.97); }

        .ai-confirm-row {
          display: flex; gap: 8px; padding: 0 4px;
        }
        .ai-confirm-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 9px 12px; border-radius: 10px; font-size: 13px; font-weight: 600;
          border: none; cursor: pointer; transition: opacity 0.15s, transform 0.12s;
        }
        .ai-confirm-btn:active { transform: scale(0.97); }
        .ai-confirm-btn--ok { background: #4a9e6b; color: #fff; }
        .ai-confirm-btn--ok:hover { background: #3a8459; }
        .ai-confirm-btn--cancel { background: var(--surface2, #f0f0f0); color: var(--text-muted, #666); }
        .ai-confirm-btn--cancel:hover { background: var(--border, #e5e5e5); }

        .ai-chat-input-row {
          display: flex; align-items: center; gap: 8px;
          padding: 12px;
          border-top: 1px solid var(--border, #e5e7eb);
          background: var(--surface, #fff);
          flex-shrink: 0;
        }
        .ai-chat-input {
          flex: 1; padding: 9px 12px; border-radius: 10px;
          font-size: 13px; color: var(--text, #111);
          background: var(--surface2, #f5f5f5);
          border: 1px solid var(--border, #e5e7eb);
          outline: none; transition: border-color 0.15s;
        }
        .ai-chat-input:focus { border-color: #4a9e6b; }
        .ai-chat-send {
          width: 36px; height: 36px; border-radius: 10px;
          background: #4a9e6b; color: #fff;
          display: flex; align-items: center; justify-content: center;
          border: none; cursor: pointer; flex-shrink: 0;
          transition: background 0.15s, transform 0.12s;
        }
        .ai-chat-send:hover:not(:disabled) { background: #3a8459; }
        .ai-chat-send:active:not(:disabled) { transform: scale(0.94); }
        .ai-chat-send:disabled { opacity: 0.45; cursor: not-allowed; }
        .ai-spin { animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .ai-chat-panel { right: 12px; bottom: 80px; width: calc(100vw - 24px); }
          .ai-chat-bubble { bottom: 16px; right: 16px; }
        }
      `}</style>
    </>
  );
}
