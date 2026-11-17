// Illustration SVG maison de la rade à marée basse : ciel d'aube, collines de
// Plougastel, mer, estran découvert avec la laisse de mer, un sac de collecte
// et deux goélands. Vagues animées très lentement ; la règle globale
// prefers-reduced-motion de globals.css coupe l'animation.

const VAGUE = "M-100 0" + " q12.5 -6 25 0 t25 0".repeat(14);

export default function IllustrationRade({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="La rade de Brest à marée basse : collines, mer calme, plage découverte avec un sac de collecte et deux goélands"
    >
      <defs>
        <clipPath id="hublot">
          <rect width="400" height="300" rx="28" />
        </clipPath>
        <linearGradient id="ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9b0" />
          <stop offset="1" stopColor="#f4edd9" />
        </linearGradient>
        <linearGradient id="mer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa3bf" />
          <stop offset="1" stopColor="#1c7d96" />
        </linearGradient>
      </defs>
      <style>
        {`
          .derive-lente { animation: derive 14s linear infinite; }
          .derive-rapide { animation: derive 9s linear infinite reverse; }
          @keyframes derive { to { transform: translateX(-50px); } }
        `}
      </style>

      <g clipPath="url(#hublot)">
        <rect width="400" height="300" fill="url(#ciel)" />
        <circle cx="292" cy="112" r="38" fill="#ff8a50" opacity="0.85" />

        {/* collines lointaines puis presqu'île de Plougastel */}
        <path d="M0 158C60 126 112 134 164 146 226 160 262 124 324 130 362 134 386 144 400 142V200H0z" fill="#2fa3bf" opacity="0.35" />
        <path d="M0 178C46 156 94 158 136 170 176 182 212 166 256 172 300 178 340 170 400 176V200H0z" fill="#134f63" />

        {/* mer */}
        <rect y="186" width="400" height="80" fill="url(#mer)" />
        <g transform="translate(0 204)">
          <g className="derive-lente">
          <path d={VAGUE} fill="none" stroke="#f4edd9" strokeWidth="2" opacity="0.45" />
          </g>
        </g>
        <g transform="translate(0 222)">
          <g className="derive-rapide">
          <path d={VAGUE} fill="none" stroke="#f4edd9" strokeWidth="2" opacity="0.3" />
          </g>
        </g>

        {/* estran découvert, puis plage */}
        <path d="M0 246C90 230 170 234 250 242 310 248 360 244 400 236V300H0z" fill="#d9c79a" />
        <path d="M0 262C80 248 170 252 250 260 310 266 360 262 400 256V300H0z" fill="#e7dcbb" />

        {/* laisse de mer : algues et petits déchets */}
        <g fill="#2f6b45">
          <ellipse cx="40" cy="252" rx="10" ry="2.5" />
          <ellipse cx="160" cy="247" rx="12" ry="2.5" />
          <ellipse cx="300" cy="251" rx="9" ry="2.5" />
          <ellipse cx="365" cy="246" rx="8" ry="2" />
        </g>
        <g fill="#9fb5bd">
          <rect x="196" y="244" width="12" height="4" rx="2" transform="rotate(-12 202 246)" />
          <rect x="330" y="249" width="9" height="3.5" rx="1.75" transform="rotate(18 334 250)" />
          <circle cx="62" cy="249" r="2.5" />
        </g>

        {/* sac de collecte */}
        <g transform="translate(112 252)">
          <path d="M-14 0h28l4 26c0 5-4 8-9 8h-18c-5 0-9-3-9-8z" fill="#ff5a1f" />
          <path d="M-14 0c3-8 9-9 14-4 5-5 11-4 14 4" fill="none" stroke="#e2470f" strokeWidth="3" strokeLinecap="round" />
          <path d="M-6 12h12" stroke="#f4edd9" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* goélands */}
        <path d="M150 74c9-10 19-10 25 2 6-12 16-12 25-2-10 0-16 4-20 10-2 3-8 3-10 0-4-6-10-10-20-10z" fill="#11232b" />
        <path d="M222 50c6-6 12-6 16 1 4-7 10-7 16-1-6 0-10 3-13 6-1 2-5 2-6 0-3-3-7-6-13-6z" fill="#11232b" opacity="0.7" />
      </g>
    </svg>
  );
}
