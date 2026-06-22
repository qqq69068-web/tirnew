export function TirnewLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="DVTrucks — Truck Service"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Truck cab silhouette */}
      <rect x="4" y="18" width="20" height="14" rx="2"
        fill="var(--primary)" opacity="0.15"
        stroke="var(--primary)" strokeWidth="1.5" />
      {/* Trailer */}
      <rect x="22" y="14" width="14" height="18" rx="2"
        fill="var(--primary)" opacity="0.10"
        stroke="var(--primary)" strokeWidth="1.5" />
      {/* Cab window */}
      <rect x="6" y="20" width="8" height="5" rx="1"
        fill="var(--primary)" opacity="0.35" />
      {/* Wheels */}
      <circle cx="10" cy="33" r="3"
        fill="var(--primary)" opacity="0.9" />
      <circle cx="28" cy="33" r="3"
        fill="var(--primary)" opacity="0.9" />
      <circle cx="34" cy="33" r="3"
        fill="var(--primary)" opacity="0.9" />
      {/* Speed lines */}
      <path d="M4 15H14" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M4 12H11" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}
