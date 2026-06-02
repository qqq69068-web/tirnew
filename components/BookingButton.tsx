"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  serviceSlug: string;
  serviceTitle: string;
}

export default function BookingButton({ serviceSlug, serviceTitle }: Props) {
  const [status, setStatus] = useState<"loading" | "guest" | "auth">("loading");
  const [client, setClient] = useState<{ email: string; name: string | null } | null>(null);

  const [open, setOpen] = useState(false);
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.email) {
          setClient(data);
          setStatus("auth");
          if (data.phone) setPhone(data.phone);
        } else {
          setStatus("guest");
        }
      })
      .catch(() => setStatus("guest"));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const res = await fetch("/api/client/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceSlug, serviceTitle, carBrand, carModel, phone, message }),
    });
    setSending(false);
    if (res.ok) setDone(true);
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white";
  const labelCls = "block text-xs text-gray-400 mb-1";

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
        <p className="text-sm text-teal-600 mt-1">Ми зв&apos;яжемося з вами найближчим часом</p>
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
      <div>
        <label className={labelCls}>Марка авто</label>
        <input
          type="text"
          placeholder="напр. Volvo"
          value={carBrand}
          onChange={(e) => setCarBrand(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Модель авто</label>
        <input
          type="text"
          placeholder="напр. FH16"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Телефон *</label>
        <input
          type="tel"
          placeholder="+380 50 000 00 00"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Коментар</label>
        <textarea
          placeholder="необов'язково"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
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
