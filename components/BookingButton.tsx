"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

const BookingModal = dynamic(() => import("./BookingModal"), { ssr: false });

interface Props {
  fullWidth?: boolean;
  size?: "sm" | "md";
  /** Якщо вказано — відкриває модалку з вже вибраною послугою */
  defaultService?: string;
  /** Якщо true — завжди веде на /contacts (navbar) */
  toContacts?: boolean;
}

export default function BookingButton({ fullWidth, size, defaultService, toContacts }: Props) {
  const [open, setOpen] = useState(false);

  const btnClass = `btn btn-primary${
    fullWidth ? " w-full" : ""
  }${size === "sm" ? " btn-sm" : ""}`;

  if (toContacts) {
    return (
      <Link href="/contacts" className={btnClass}>
        Записатись
      </Link>
    );
  }

  return (
    <>
      <button type="button" className={btnClass} onClick={() => setOpen(true)}>
        Записатись
      </button>
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        defaultService={defaultService}
      />
    </>
  );
}
