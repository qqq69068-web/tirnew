"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Save, Mail, Calendar, Plus, X, Wrench, Package } from "lucide-react";
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
  partsCost: number | null;
  workItems: string[];
  clientEmail: string | null;
  status: string;
  createdAt: string;
  message: string | null;
  scheduledAt: string | null;
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

function toLocalDatetimeInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Record<string, unknown>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [newWorkItem, setNewWorkItem] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => { setBookings(data); setLoading(false); });
  }, []);

  const getServiceLabel = (slug: string | null) =>
    services.find((s) => s.slug === slug)?.title || slug || "—";

  const setEdit = (id: string, field: string, value: unknown) =>
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const getWorkItems = (b: Booking) =>
    (edits[b.id]?.workItems as string[]) ?? b.workItems ?? [];

  const addWorkItem = (id: string) => {
    const text = (newWorkItem[id] || "").trim();
    if (!text) return;
    const current = getWorkItems(bookings.find((b) => b.id === id)!);
    setEdit(id, "workItems", [...current, text]);
    setNewWorkItem((prev) => ({ ...prev, [id]: "" }));
  };

  const removeWorkItem = (id: string, idx: number) => {
    const current = getWorkItems(bookings.find((b) => b.id === id)!);
    setEdit(id, "workItems", current.filter((_, i) => i !== idx));
  };

  const save = async (id: string) => {
    setSaving(id);
    const body = { ...edits[id] } as Record<string, unknown>;
    if (body.scheduledAt && typeof body.scheduledAt === "string" && body.scheduledAt !== "") {
      body.scheduledAt = new Date(body.scheduledAt as string).toISOString();
    } else if (body.scheduledAt === "") {
      body.scheduledAt = null;
    }
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...body } as unknown as Booking : b))
    );
    setSaving(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  if (loading) return <div className="p-8 text-gray-400">Завантаження...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Замовлення</h1>
      {bookings.length === 0 && <p className="text-gray-400">Замовлень поки немає</p>}
      <div className="space-y-3">
        {bookings.map((b) => {
          const edit = edits[b.id] || {};
          const currentProgress = (edit.progress as string) || b.progress || "received";
          const isOpen = expanded === b.id;
          const scheduledValue = "scheduledAt" in edit
            ? (edit.scheduledAt as string)
            : toLocalDatetimeInput(b.scheduledAt);
          const workItems = getWorkItems(b);

          return (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                  {b.scheduledAt && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={11} />
                      {new Date(b.scheduledAt).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PROGRESS_COLORS[b.progress] || "bg-gray-100 text-gray-600"}`}>
                    {PROGRESS_OPTIONS.find((p) => p.value === b.progress)?.label || "Заявку прийнято"}
                  </span>
                  {b.price && <span className="text-sm font-bold text-teal-700">{b.price} ₴</span>}
                  {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-4 space-y-5">
                  {b.message && (
                    <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">{b.message}</p>
                  )}

                  {/* Main fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar size={11} /> Дата та час запису
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledValue}
                        onChange={(e) => setEdit(b.id, "scheduledAt", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Ціна роботи (₴)</label>
                      <input
                        type="number"
                        defaultValue={b.price || ""}
                        onChange={(e) => setEdit(b.id, "price", e.target.value)}
                        placeholder="0"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <Package size={11} /> Вартість деталей (₴)
                      </label>
                      <input
                        type="number"
                        defaultValue={b.partsCost || ""}
                        onChange={(e) => setEdit(b.id, "partsCost", e.target.value)}
                        placeholder="0"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
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

                  {/* Work items */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                      <Wrench size={11} /> Список виконаних робіт
                    </label>
                    <div className="space-y-1.5 mb-2">
                      {workItems.length === 0 && (
                        <p className="text-xs text-gray-400 italic">Роботи ще не додано</p>
                      )}
                      {workItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                          <span className="text-xs text-teal-600 font-medium">{idx + 1}.</span>
                          <span className="text-sm text-gray-700 flex-1">{item}</span>
                          <button
                            onClick={() => removeWorkItem(b.id, idx)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newWorkItem[b.id] || ""}
                        onChange={(e) => setNewWorkItem((prev) => ({ ...prev, [b.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && addWorkItem(b.id)}
                        placeholder="Наприклад: Заміна масла..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        onClick={() => addWorkItem(b.id)}
                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-3 py-2 rounded-lg transition-colors"
                      >
                        <Plus size={14} /> Додати
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  {((edit.price ?? b.price) || (edit.partsCost ?? b.partsCost)) && (
                    <div className="bg-teal-50 rounded-lg px-4 py-2.5 flex items-center justify-between">
                      <span className="text-xs text-teal-700">Загальна сума</span>
                      <span className="text-sm font-bold text-teal-800">
                        {((parseFloat(String(edit.price ?? b.price ?? 0)) || 0) + (parseFloat(String(edit.partsCost ?? b.partsCost ?? 0)) || 0)).toFixed(0)} ₴
                      </span>
                    </div>
                  )}

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
