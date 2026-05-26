"use client";

import { useEffect, useState } from "react";
import { CheckCheck, Phone, Calendar } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  read: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Нове",
  read: "Переглянуто",
  done: "Оброблено",
};

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((data) => { setMessages(data); setLoading(false); });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
    setUpdating(null);
  };

  if (loading) return <div className="p-8 text-gray-400">Завантаження...</div>;

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Повідомлення</h1>
        {newCount > 0 && (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
            {newCount} нових
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400">Повідомлень поки немає</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-colors ${
                m.status === "new" ? "border-amber-200" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{m.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[m.status] || "bg-gray-100 text-gray-500"
                    }`}>
                      {STATUS_LABELS[m.status] || m.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{m.message}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <a
                      href={`tel:${m.phone}`}
                      className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium"
                    >
                      <Phone size={12} />
                      {m.phone}
                    </a>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(m.createdAt).toLocaleString("uk-UA")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {m.status === "new" && (
                    <button
                      onClick={() => updateStatus(m.id, "read")}
                      disabled={updating === m.id}
                      className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                      Переглянуто
                    </button>
                  )}
                  {m.status !== "done" && (
                    <button
                      onClick={() => updateStatus(m.id, "done")}
                      disabled={updating === m.id}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCheck size={12} />
                      Оброблено
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
