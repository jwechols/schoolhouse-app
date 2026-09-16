// A clean little one-room schoolhouse mark: bell cupola, roof, arched door, two
// windows. The roof, cupola-roof, and door take var(--accent) (so it themes to
// each child); the body outline + windows use currentColor (set to ink). Pair
// with the "Schoolhouse" wordmark in EB Garamond.
export default function SchoolhouseLogo({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Schoolhouse"
      className={className}
      style={{ color: "var(--ink)", flexShrink: 0 }}
    >
      {/* bell cupola */}
      <rect x="29" y="7.5" width="6" height="6" fill="var(--surface)" stroke="currentColor" strokeWidth="2" />
      <path d="M27.2 7.5 L32 2.5 L36.8 7.5 Z" fill="var(--accent)" />
      {/* main roof */}
      <path d="M32 12 L58.5 31 L5.5 31 Z" fill="var(--accent)" />
      {/* body */}
      <rect x="13" y="31" width="38" height="25" rx="2.5" fill="var(--surface)" stroke="currentColor" strokeWidth="2.5" />
      {/* arched door */}
      <path d="M27 56 V44 a5 5 0 0 1 10 0 V56 Z" fill="var(--accent)" />
      {/* windows */}
      <rect x="17.5" y="37" width="6.5" height="6.5" rx="1" fill="currentColor" opacity="0.82" />
      <rect x="40" y="37" width="6.5" height="6.5" rx="1" fill="currentColor" opacity="0.82" />
    </svg>
  );
}
