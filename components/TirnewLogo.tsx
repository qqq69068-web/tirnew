export function TirnewLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="Tirnew — Truck Service"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagonal frame */}
      <path
        d="M20 3L35 11.5V28.5L20 37L5 28.5V11.5L20 3Z"
        fill="var(--primary)"
        opacity="0.12"
      />
      <path
        d="M20 3L35 11.5V28.5L20 37L5 28.5V11.5L20 3Z"
        stroke="var(--primary)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* T letterform */}
      <path
        d="M13 14H27M20 14V27"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Speed accent */}
      <path
        d="M14 22H20"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
