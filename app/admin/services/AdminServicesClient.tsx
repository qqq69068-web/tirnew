"use client";

import { useState } from "react";
import { Pencil, Trash2, ToggleLeft, ToggleRight, Plus, X, Check } from "lucide-react";

type Service = {
  id: string;
  slug: string;
  title: string;
  short: string;
  description: string;
  price: string;
  priceMin: number;
  priceMax: number;
  hours: string;
  image: string;
  category: string;
  details: string[];
  order: number;
  active: boolean;
};

export default function AdminServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleActive(s: Service) {
    const res = await fetch(`/api/admin/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setServices((prev) => prev.map((x) => (x.id === s.id ? updated : x)));
    }
  }

  async function deleteService(s: Service) {
    if (!confirm(`Видалити «${s.title}»?`)) return;
    const res = await fetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
    if (res.ok) setServices((prev) => prev.filter((x) => x.id !== s.id));
  }

  async function saveEditing() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`/api/admin/services/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      const updated = await res.json();
      setServices((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setEditing(null);
    }
    setSaving(false);
  }

  function setField<K extends keyof Service>(key: K, val: Service[K]) {
    setEditing((e) => e ? { ...e, [key]: val } : e);
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Послуги</h1>
          <span className="text-sm text-gray-400">{services.length}</span>
        </div>
        <input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["#", "Назва", "Категорія", "Ціна від", "Статус", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((s) => (
              <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${!s.active ? "opacity-50" : ""}`}>
                <td className="px-4 py-3 text-gray-400 text-xs">{s.order}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 leading-tight">{s.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">{s.short}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">{s.category}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 font-medium">{s.price}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(s)} title={s.active ? "Деактивувати" : "Активувати"}>
                    {s.active
                      ? <ToggleRight size={22} className="text-teal-500" />
                      : <ToggleLeft size={22} className="text-gray-300" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditing(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-teal-600 transition">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteService(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Редагувати послугу</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <Field label="Назва" value={editing.title} onChange={(v) => setField("title", v)} />
              <Field label="Slug" value={editing.slug} onChange={(v) => setField("slug", v)} />
              <Field label="Категорія" value={editing.category} onChange={(v) => setField("category", v)} />
              <Field label="Короткий опис" value={editing.short} onChange={(v) => setField("short", v)} textarea />
              <Field label="Повний опис" value={editing.description} onChange={(v) => setField("description", v)} textarea />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ціна (текст)" value={editing.price} onChange={(v) => setField("price", v)} />
                <Field label="Час роботи" value={editing.hours} onChange={(v) => setField("hours", v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ціна від (грн)" value={String(editing.priceMin)} onChange={(v) => setField("priceMin", Number(v))} type="number" />
                <Field label="Ціна до (грн)" value={String(editing.priceMax)} onChange={(v) => setField("priceMax", Number(v))} type="number" />
              </div>
              <Field label="URL фото" value={editing.image} onChange={(v) => setField("image", v)} />
              {editing.image && (
                <img src={editing.image} alt="preview" className="rounded-xl w-full h-40 object-cover border border-gray-100" />
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Деталі (по одній на рядок)</label>
                <textarea
                  rows={4}
                  value={editing.details.join("\n")}
                  onChange={(e) => setField("details", e.target.value.split("\n"))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Порядок" value={String(editing.order)} onChange={(v) => setField("order", Number(v))} type="number" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Скасувати</button>
              <button
                onClick={saveEditing}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 transition"
              >
                <Check size={15} />
                {saving ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label, value, onChange, textarea = false, type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
}) {
  const cls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {textarea
        ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />}
    </div>
  );
}
