// Logo : un goéland en vol portant un sac de collecte dans le bec,
// dans une pastille sable pour rester lisible sur fond sombre comme clair.

export default function LogoGoeland({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Logo Ramasse ta rade : un goéland tenant un sac de collecte"
    >
      <circle cx="32" cy="32" r="31" fill="currentColor" className="text-sable" />
      {/* vague */}
      <path d="M6 46c5-3 9-3 13 0s8 3 13 0 9-3 13 0 8 3 13 0v12H6z" fill="currentColor" className="text-golfe" />
      {/* ailes */}
      <path
        d="M8 24c7-5 15-5 22 2 2-1 4-1 6 0 7-7 15-7 22-2-8-1-14 1-19 7-3 2-9 2-12 0-5-6-11-8-19-7z"
        fill="currentColor"
        className="text-rade"
      />
      {/* tête et bec */}
      <circle cx="33" cy="27" r="3.2" fill="currentColor" className="text-rade" />
      <path d="M33 29l1.5 4h-3z" fill="currentColor" className="text-bouee" />
      {/* sac de collecte */}
      <path d="M33 33v2" stroke="currentColor" strokeWidth="1.4" className="text-rade" />
      <path
        d="M29 36h8l1 7c0 1.7-1.3 3-3 3h-4c-1.7 0-3-1.3-3-3z"
        fill="currentColor"
        className="text-bouee"
      />
    </svg>
  );
}
