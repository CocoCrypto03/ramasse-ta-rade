// Illustration SVG maison de la rade (littoral stylisé, vagues, goéland en
// vol) pour le héros de l'accueil. Animation de vague très discrète,
// respectueuse de prefers-reduced-motion (règle globale dans globals.css qui
// coupe toutes les animations de la page quand la préférence est activée).

export default function IllustrationRade({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      role="img"
      aria-label="Illustration d'une côte rocheuse au-dessus de la mer, avec un goéland en vol"
    >
      <style>
        {`
          .vague-anim-1 { animation: derive-vague 9s linear infinite; }
          .vague-anim-2 { animation: derive-vague 13s linear infinite reverse; }
          @keyframes derive-vague {
            from { transform: translateX(0); }
            to { transform: translateX(-80px); }
          }
        `}
      </style>

      {/* ciel */}
      <rect width="400" height="260" fill="#eaf3ea" opacity={0} />

      {/* mer, deux bandes de vagues qui dérivent doucement */}
      <g className="vague-anim-1">
        <path
          d="M-80 170c20-8 40-8 60 0s40 8 60 0 40-8 60 0 40 8 60 0 40-8 60 0 40 8 60 0 40-8 60 0 40 8 60 0v90H-80z"
          fill="#2fa3bf"
          opacity={0.35}
        />
      </g>
      <g className="vague-anim-2">
        <path
          d="M-80 190c20-6 40-6 60 0s40 6 60 0 40-6 60 0 40 6 60 0 40-6 60 0 40 6 60 0 40-6 60 0v70H-80z"
          fill="#1c7d96"
          opacity={0.9}
        />
      </g>

      {/* côte rocheuse stylisée, à gauche et à droite */}
      <path d="M0 150c22-28 46-46 70-40 16 4 20 24 42 20 26-5 30-34 58-30v30H0z" fill="#0b3a4a" />
      <path d="M400 160c-24-22-50-34-76-26-16 5-18 24-40 22-22-2-26-22-50-14v48h166z" fill="#134f63" />

      {/* goéland en vol */}
      <g transform="translate(200 70)">
        <path
          d="M-34 6c12-14 26-14 34 2 8-16 22-16 34-2-14 0-22 6-28 14-3 4-9 4-12 0-6-8-14-14-28-14z"
          fill="#11232b"
        />
      </g>
      <g transform="translate(250 40) scale(0.6)">
        <path
          d="M-34 6c12-14 26-14 34 2 8-16 22-16 34-2-14 0-22 6-28 14-3 4-9 4-12 0-6-8-14-14-28-14z"
          fill="#11232b"
          opacity={0.7}
        />
      </g>
    </svg>
  );
}
