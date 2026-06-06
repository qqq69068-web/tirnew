"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CAR_BRANDS, getModels } from "@/lib/carData";
import { getAvailableDates } from "@/lib/scheduling";

interface Props {
  serviceSlug: string;
  serviceTitle: string;
  priceCar?: number | null;
  priceTruck?: number | null;
  priceTrailer?: number | null;
  priceMin?: number | null;
}

type CarCategory = "car" | "truck" | "trailer" | "";
type Step = "form" | "date" | "time" | "confirm";

interface SlotInfo {
  time: string;
  timeLabel: string;
  free: number;
  total: number;
  available: boolean;
}

const SELECT_CLS =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white appearance-none cursor-pointer";
const INPUT_CLS =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white";
const LABEL_CLS = "block text-xs text-gray-400 mb-1";

const TRUCK_BRANDS_LIST = CAR_BRANDS.filter((b) => b.category === "truck");
const CAR_BRANDS_LIST = CAR_BRANDS.filter((b) => b.category === "car");

function getCategoryFromBrand(brandName: string): CarCategory {
  const brand = CAR_BRANDS.find((b) => b.name === brandName);
  if (!brand) return "";
  if (
    brand.name.includes("причіп") || brand.name.includes("Schmitz") ||
    brand.name.includes("Krone") || brand.name.includes("Wielton") ||
    brand.name.includes("Fliegl") || brand.name.includes("Fruehauf") ||
    brand.name.includes("Kogel") || brand.name.includes("Köge")
  ) return "trailer";
  if (brand.category === "truck") return "truck";
  return "car";
}

function getCategoryLabel(cat: CarCategory) {
  if (cat === "car") return "🚗 Легкове";
  if (cat === "truck") return "🚛 Вантажне / Тягач";
  if (cat === "trailer") return "🚌 Причіп";
  return "";
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("uk-UA", { weekday: "short", day: "numeric", month: "short" });
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function BookingButton({
  serviceSlug,
  serviceTitle,
  priceCar,
  priceTruck,
  priceTrailer,
  priceMin,
}: Props) {
  const [status, setStatus] = useState<"loading" | "guest" | "auth">("loading");
  const [client, setClient] = useState<{ email: string; name: string | null; phone?: string | null } | null>(null);
  const [profilePhone, setProfilePhone] = useState("");

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");

  // Крок 1 — деталі авто
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [carCategory, setCarCategory] = useState<CarCategory>("");
  const [phone, setPhone] = useState("");
  const [editPhone, setEditPhone] = useState(false);
  const [message, setMessage] = useState("");

  // Крок 2 — вибір дати
  const [availableDates] = useState<Date[]>(() => getAvailableDates());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Крок 3 — вибір часу
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const models = getModels(carBrand);

  const hasCategoryPrices = priceCar != null || priceTruck != null || priceTrailer != null;
  const dynamicPrice: number | null =
    carCategory === "car" ? (priceCar ?? null) :
    carCategory === "truck" ? (priceTruck ?? null) :
    carCategory === "trailer" ? (priceTrailer ?? null) : null;

  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.email) {
          setClient(data);
          setStatus("auth");
          if (data.phone) { setProfilePhone(data.phone); setPhone(data.phone); }
        } else setStatus("guest");
      })
      .catch(() => setStatus("guest"));
  }, []);

  const handleBrandChange = (val: string) => {
    setCarBrand(val);
    setCarModel("");
    setCustomModel("");
    setCarCategory(getCategoryFromBrand(val));
  };

  // Завантажуємо слоти при виборі дати
  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlotsLoading(true);
    setStep("time");
    try {
      const params = new URLSearchParams({
        date: toDateKey(date),
        serviceSlug,
        carCategory: carCategory || "truck",
      });
      const res = await fetch(`/api/client/slots?${params}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const finalModel = carModel === "__custom__" ? customModel : carModel;
  const finalPhone = editPhone ? phone : profilePhone || phone;

  const submit = async () => {
    if (!selectedSlot) return;
    setSending(true);
    setErrorMsg("");
    const res = await fetch("/api/client/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceSlug,
        serviceTitle,
        carBrand,
        carModel: finalModel,
        carCategory,
        phone: finalPhone,
        message,
        scheduledAt: selectedSlot.time,
      }),
    });
    setSending(false);
    if (res.ok) {
      setDone(true);
    } else {
      const data = await res.json();
      if (data.error === "no_slots") {
        setErrorMsg("На жаль, цей час вже зайнятий. Оберіть інший.");
        // Перезавантажуємо слоти
        if (selectedDate) handleDateSelect(selectedDate);
        setStep("time");
      } else {
        setErrorMsg("Помилка. Спробуйте ще раз.");
      }
    }
  };

  if (status === "loading") return <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse" />;

  if (status === "guest") {
    return (
      <div className="space-y-2">
        <Link href="/cabinet" className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors">
          Увійти для запису
        </Link>
        <p className="text-xs text-gray-400 text-center">Потрібен акаунт для онлайн-запису</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
        <p className="text-teal-700 font-semibold text-lg">✅ Запис підтверджено!</p>
        {selectedSlot && selectedDate && (
          <p className="text-sm text-teal-600 mt-1">
            {formatDate(selectedDate)}, {selectedSlot.timeLabel}
          </p>
        )}
        <p className="text-sm text-teal-600 mt-1">Ми зв&apos;яжемося з вами найближчим часом</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors">
        Записатись
      </button>
    );
  }

  // ===== КРОК 1: Дані авто та контакт =====
  if (step === "form") {
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Ваші дані</p>
        {client?.name && <p className="text-sm text-gray-600">👤 {client.name}</p>}

        {/* Марка */}
        <div>
          <label className={LABEL_CLS}>Марка авто</label>
          <div className="relative">
            <select value={carBrand} onChange={(e) => handleBrandChange(e.target.value)} className={SELECT_CLS} style={{ color: '#111827' }}>
              <option value="" style={{ color: '#6b7280' }}>— Оберіть марку —</option>
              <optgroup label="🚛 Вантажні / Тягачі / Причепи" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                {TRUCK_BRANDS_LIST.map((b) => <option key={b.name} value={b.name} style={{ color: '#111827', backgroundColor: '#ffffff' }}>{b.name}</option>)}
              </optgroup>
              <optgroup label="🚗 Легкові" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                {CAR_BRANDS_LIST.map((b) => <option key={b.name} value={b.name} style={{ color: '#111827', backgroundColor: '#ffffff' }}>{b.name}</option>)}
              </optgroup>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
          </div>
        </div>

        {/* Категорія + ціна */}
        {carBrand && carCategory && (
          <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
            <span className="text-sm text-gray-600">{getCategoryLabel(carCategory)}</span>
            {hasCategoryPrices && (
              <span className="font-semibold text-teal-700 text-sm">
                {dynamicPrice != null ? `від ${dynamicPrice.toLocaleString("uk-UA")} грн` : <span className="text-gray-400 text-xs">ціна за запитом</span>}
              </span>
            )}
          </div>
        )}

        {/* Модель */}
        {carBrand && (
          <div>
            <label className={LABEL_CLS}>Модель авто</label>
            <div className="relative">
              <select value={carModel} onChange={(e) => setCarModel(e.target.value)} className={SELECT_CLS} style={{ color: '#111827' }}>
                <option value="" style={{ color: '#6b7280' }}>— Оберіть модель —</option>
                {models.map((m) => <option key={m} value={m} style={{ color: '#111827', backgroundColor: '#ffffff' }}>{m}</option>)}
                <option value="__custom__" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Інша модель...</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
            </div>
            {carModel === "__custom__" && (
              <input type="text" placeholder="Введіть модель вручну" value={customModel} onChange={(e) => setCustomModel(e.target.value)} className={`${INPUT_CLS} mt-2`} />
            )}
          </div>
        )}

        {/* Телефон */}
        <div>
          <label className={LABEL_CLS}>Телефон *</label>
          {profilePhone && !editPhone ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-700">{profilePhone}</div>
              <button type="button" onClick={() => { setEditPhone(true); setPhone(""); }} className="text-xs text-teal-600 hover:text-teal-800 whitespace-nowrap">Змінити</button>
            </div>
          ) : (
            <input type="tel" placeholder="+380 50 000 00 00" required value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT_CLS} />
          )}
        </div>

        {/* Коментар */}
        <div>
          <label className={LABEL_CLS}>Коментар</label>
          <textarea placeholder="необов'язково" value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className={`${INPUT_CLS} resize-none`} />
        </div>

        <button
          onClick={() => { if (carBrand && (profilePhone || phone)) setStep("date"); }}
          disabled={!carBrand || (!profilePhone && !phone)}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Обрати дату та час →
        </button>
        <button type="button" onClick={() => setOpen(false)} className="w-full text-gray-400 hover:text-gray-600 text-sm py-1 transition-colors">Скасувати</button>
      </div>
    );
  }

  // ===== КРОК 2: Вибір дати =====
  if (step === "date") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setStep("form")} className="text-gray-400 hover:text-gray-600 text-sm">← Назад</button>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Оберіть дату</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {availableDates.map((d) => (
            <button
              key={toDateKey(d)}
              onClick={() => handleDateSelect(d)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-left hover:border-teal-400 hover:bg-teal-50 transition-colors"
            >
              <span className="font-medium text-gray-800 capitalize">{d.toLocaleDateString("uk-UA", { weekday: "short" })}</span>
              <span className="text-gray-500 ml-1">{d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}</span>
            </button>
          ))}
        </div>

        <button type="button" onClick={() => setOpen(false)} className="w-full text-gray-400 hover:text-gray-600 text-sm py-1 transition-colors">Скасувати</button>
      </div>
    );
  }

  // ===== КРОК 3: Вибір часу =====
  if (step === "time") {
    const totalWorkers = carCategory === "car" ? 2 : 5;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button onClick={() => { setStep("date"); setSelectedSlot(null); }} className="text-gray-400 hover:text-gray-600 text-sm">← Назад</button>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {selectedDate && formatDate(selectedDate)}
          </p>
        </div>

        <p className="text-xs text-gray-400">
          {carCategory === "car" ? "Майстрів для легкових: 2" : "Майстрів для вантажних: 5"}
        </p>

        {slotsLoading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => { setSelectedSlot(slot); setStep("confirm"); }}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-colors border ${
                  !slot.available
                    ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                    : slot.free < totalWorkers
                    ? "border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-400"
                    : "border-gray-200 bg-white text-gray-800 hover:border-teal-400 hover:bg-teal-50"
                }`}
              >
                <div>{slot.timeLabel}</div>
                <div className={`text-xs mt-0.5 ${ !slot.available ? "text-gray-300" : slot.free < totalWorkers ? "text-orange-500" : "text-teal-600" }`}>
                  {slot.available ? `${slot.free} вільн.` : "зайнято"}
                </div>
              </button>
            ))}
          </div>
        )}

        {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}
        <button type="button" onClick={() => setOpen(false)} className="w-full text-gray-400 hover:text-gray-600 text-sm py-1 transition-colors">Скасувати</button>
      </div>
    );
  }

  // ===== КРОК 4: Підтвердження =====
  if (step === "confirm") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setStep("time")} className="text-gray-400 hover:text-gray-600 text-sm">← Назад</button>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Підтвердження</p>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Послуга</span>
            <span className="text-gray-800 font-medium text-right max-w-[60%]">{serviceTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Авто</span>
            <span className="text-gray-800">{carBrand} {finalModel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Тип</span>
            <span className="text-gray-800">{getCategoryLabel(carCategory)}</span>
          </div>
          {selectedDate && selectedSlot && (
            <div className="flex justify-between">
              <span className="text-gray-500">Час</span>
              <span className="text-gray-800 font-semibold">{formatDate(selectedDate)}, {selectedSlot.timeLabel}</span>
            </div>
          )}
          {dynamicPrice != null && (
            <div className="flex justify-between">
              <span className="text-gray-500">Ціна</span>
              <span className="text-teal-700 font-semibold">від {dynamicPrice.toLocaleString("uk-UA")} грн</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Телефон</span>
            <span className="text-gray-800">{finalPhone}</span>
          </div>
        </div>

        {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}

        <button
          onClick={submit}
          disabled={sending}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {sending ? "Надсилаємо..." : "✅ Підтвердити запис"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="w-full text-gray-400 hover:text-gray-600 text-sm py-1 transition-colors">Скасувати</button>
      </div>
    );
  }

  return null;
}
