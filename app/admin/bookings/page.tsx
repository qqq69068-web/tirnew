"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Save, Mail } from "lucide-react";
import { services } from "@/lib/services";

interface Booking {
  id: string;
  name: string;
  phone: string;
  carBrand: string | null;
  carModel: string | null;
  service: string | null;
  progress: string;
  price: number | null;
  clientEmail: string | null;
  status: string;
  createdAt: string;
  message: string | null;
}

const PROGRESS_OPTIONS = [
  { value: "received", label: "Заявку прийнято" },
  { value: "diagnostics", label: "Діагностика" },
  { value: "in_progress", label: "В роботі" },
  { value: "done", label: "Готово до видачі" },
];

const PROGRESS_COLORS: Record<string, string> = {
  received: "bg-gray-100 text-gray-600",
  diagnostics: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<Booking>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => { setBookings(data); setLoading(false); });
  }, []);

  const getServiceLabel = (slug: string | null) =>
    services.find((s) => s.slug === slug)?.title || slug || "—";

  const setEdit = (id: string, field: string, value: string) =>
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const save = async (id: string) => {
    setSaving(id);
    const body = edits[id] || {};
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...body } : b))
    );
    setSaving(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  if (loading) return <div className="p-8 text-gray-400">Завантаження...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Замовлення</h1>
      {bookings.length === 0 && (
        <p className="text-gray-400">Замовлень поки немає</p>
      )}
      <div className="space-y-3">
        {bookings.map((b) => {
          const edit = edits[b.id] || {};
          const currentProgress = (edit.progress as string) || b.progress || "received";
          const isOpen = expanded === b.id;
          return (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : b.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div>
                    <p className="font-semibold text-gray-800">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.phone}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-600">{b.carBrand} {b.carModel}</p>
                    <p className="text-xs text-gray-400">{getServiceLabel(b.service)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PROGRESS_COLORS[b.progress] || "bg-gray-100 text-gray-600"}`}>
                    {PROGRESS_OPTIONS.find((p) => p.value === b.progress)?.label || "Заявку прийнято"}
                  </span>
                  {b.price && <span className="text-sm font-bold text-teal-700">{b.price} ₴</span>}
                  {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                  {b.message && (
                    <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">{b.message}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Progress */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Статус прогресу</label>
                      <select
                        value={currentProgress}
                        onChange={(e) => setEdit(b.id, "progress", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {PROGRESS_OPTIONS.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* Price */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Ціна (₴)</label>
                      <input
                        type="number"
                        defaultValue={b.price || ""}
                        onChange={(e) => setEdit(b.id, "price", e.target.value)}
                        placeholder="0"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    {/* Client email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <Mail size={11} /> Email клієнта
                      </label>
                      <input
                        type="email"
                        defaultValue={b.clientEmail || ""}
                        onChange={(e) => setEdit(b.id, "clientEmail", e.target.value)}
                        placeholder="client@email.com"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => save(b.id)}
                      disabled={saving === b.id}
                      className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save size={14} />
                      {saving === b.id ? "Зберігаємо..." : "Зберегти"}
                    </button>
                    {saved === b.id && <span className="text-xs text-green-600">✓ Збережено!</span>}
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(b.createdAt).toLocaleString("uk-UA")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
