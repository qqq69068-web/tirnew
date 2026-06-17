"use client";

import Link from "next/link";

interface Props {
  fullWidth?: boolean;
  size?: "sm" | "md";
}

export default function BookingButton({ fullWidth, size }: Props) {
  const btnClass = `btn btn-primary${fullWidth ? " w-full" : ""}${size === "sm" ? " btn-sm" : ""}`;

  return (
    <Link href="/contacts" className={btnClass}>
      Записатись
    </Link>
  );
}
