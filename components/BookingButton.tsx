"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CAR_BRANDS, getModels } from "@/lib/carData";

interface Props {
  serviceSlug: string;
  serviceTitle: string;
  priceCar?: number | null;
  priceTruck?: number | null;
  priceTrailer?: number | null;
  priceMin?: number | null;
}

type CarCategory = "car" | "truck" | "trailer" | "";

const SELECT_CLS =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white appearance-none cursor-pointer";
const INPUT_CLS =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white";
const LABEL_CLS = "block text-xs text-gray-400 mb-1";

const TRUCK_BRANDS_LIST = CAR_BRANDS.filter((b) => b.category === "truck");
const CAR_BRANDS_LIST = CAR_BRANDS.filter((b) => b.category === "car");

function getCategoryFromBrand(brandName: string): CarCategory {
  const brand = CAR_BRANDS.find((b) => b.name === brandName);
  if (!brand) return "";
  if (brand.name.includes("причіп") || brand.name.includes("Schmitz") || brand.name.includes("Krone") ||
      brand.name.includes("Wielton") || brand.name.includes("Fliegl") || brand.name.includes("Fruehauf") ||
      brand.name.includes("Kogel") || brand.name.includes("Köge")) return "trailer";
  if (brand.category === "truck") return "truck";
  return "car";
}

function getCategoryLabel(cat: CarCategory) {
  if (cat === "car") return "🚗 Легкове";
  if (cat === "truck") return "🚛 Вантажне / Тягач";
  if (cat === "trailer") return "🚌 Причіп";
  return "";
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
  const [client, setClient] = useState<{
    email: string;
    name: string | null;
    phone?: string | null;
  } | null>(null);
  const [profilePhone, setProfilePhone] = useState("");

  const [open, setOpen] = useState(false);
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [carCategory, setCarCategory] = useState<CarCategory>("");
  const [phone, setPhone] = useState("");
  const [editPhone, setEditPhone] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const models = getModels(carBrand);

  // Динамічна ціна на основі категорії
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
          if (data.phone) {
            setProfilePhone(data.phone);
            setPhone(data.phone);
          }
        } else {
          setStatus("guest");
        }
      })
      .catch(() => setStatus("guest"));
  }, []);

  const handleBrandChange = (val: string) => {
    setCarBrand(val);
    setCarModel("");
    setCustomModel("");
    setCarCategory(getCategoryFromBrand(val));
  };

  const finalModel = carModel === "__custom__" ? customModel : carModel;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const finalPhone = editPhone ? phone : profilePhone || phone;
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
      }),
    });
    setSending(false);
    if (res.ok) setDone(true);
  };

  if (status === "loading") {
    return <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse" />;
  }

  if (status === "guest") {
    return (
      <div className="space-y-2">
        <Link
          href="/cabinet"
          className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Увійти для запису
        </Link>
        <p className="text-xs text-gray-400 text-center">
          Потрібен акаунт для онлайн-запису
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
        <p className="text-teal-700 font-semibold">✅ Заявку надіслано!</p>
        <p className="text-sm text-teal-600 mt-1">
          Ми зв&apos;яжемося з вами найближчим часом
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Записатись
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Ваші дані</p>
      {client?.name && (
        <p className="text-sm text-gray-600">👤 {client.name}</p>
      )}

      {/* Марка */}
      <div>
        <label className={LABEL_CLS}>Марка авто</label>
        <div className="relative">
          <select
            value={carBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className={SELECT_CLS}
          >
            <option value="">— Оберіть марку —</option>
            <optgroup label="🚛 Вантажні / Тягачі / Причепи">
              {TRUCK_BRANDS_LIST.map((b) => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </optgroup>
            <optgroup label="🚗 Легкові">
              {CAR_BRANDS_LIST.map((b) => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </optgroup>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
        </div>
      </div>

      {/* Категорія авто + динамічна ціна */}
      {carBrand && carCategory && (
        <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
          <span className="text-sm text-gray-600">{getCategoryLabel(carCategory)}</span>
          {hasCategoryPrices && (
            <span className="font-semibold text-teal-700 text-sm">
              {dynamicPrice != null
                ? `від ${dynamicPrice.toLocaleString("uk-UA")} грн`
                : <span className="text-gray-400 text-xs">ціна за запитом</span>}
            </span>
          )}
        </div>
      )}

      {/* Модель */}
      {carBrand && (
        <div>
          <label className={LABEL_CLS}>Модель авто</label>
          <div className="relative">
            <select
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className={SELECT_CLS}
            >
              <option value="">— Оберіть модель —</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="__custom__">Інша модель...</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
          </div>
          {carModel === "__custom__" && (
            <input
              type="text"
              placeholder="Введіть модель вручну"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              className={`${INPUT_CLS} mt-2`}
            />
          )}
        </div>
      )}

      {/* Телефон */}
      <div>
        <label className={LABEL_CLS}>Телефон *</label>
        {profilePhone && !editPhone ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-700">
              {profilePhone}
            </div>
            <button
              type="button"
              onClick={() => { setEditPhone(true); setPhone(""); }}
              className="text-xs text-teal-600 hover:text-teal-800 whitespace-nowrap"
            >
              Змінити
            </button>
          </div>
        ) : (
          <input
            type="tel"
            placeholder="+380 50 000 00 00"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={INPUT_CLS}
            autoFocus
          />
        )}
      </div>

      {/* Коментар */}
      <div>
        <label className={LABEL_CLS}>Коментар</label>
        <textarea
          placeholder="необов'язково"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className={`${INPUT_CLS} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {sending ? "Надсилаємо..." : "Підтвердити запис"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="w-full text-gray-400 hover:text-gray-600 text-sm py-1 transition-colors"
      >
        Скасувати
      </button>
    </form>
  );
}
