"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const BookingModal = dynamic(() => import("./BookingModal"), { ssr: false });

interface Props {
  fullWidth?: boolean;
  size?: "sm" | "md";
  defaultService?: string;
}

export default function BookingButton({ fullWidth, size, defaultService }: Props) {
  const [open, setOpen] = useState(false);

  const btnClass = `btn btn-primary${
    fullWidth ? " w-full" : ""
  }${size === "sm" ? " btn-sm" : ""}`;

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
