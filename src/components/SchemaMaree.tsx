// Petit schéma pédagogique (pas une donnée réelle) du principe « marée
// basse » pour la section de sensibilisation de l'accueil : une courbe
// illustrative, et la fenêtre de collecte -2h / +1h autour de la basse mer.

export default function SchemaMaree({ className = "" }: { className?: string }) {
  const largeur = 420;
  const hauteur = 150;

  // Courbe cosinus illustrative (deux cycles) — pédagogique, non chiffrée.
  const points: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const t = (i / 100) * largeur;
    const y = 75 - Math.cos((i / 100) * Math.PI * 2) * 45;
    points.push(`${i === 0 ? "M" : "L"}${t.toFixed(1)},${y.toFixed(1)}`);
  }

  // La basse mer illustrée est au centre du graphique (cycle complet) ;
  // fenêtre -2h/+1h représentée proportionnellement (sur ~12h30 de cycle).
  const centreBasseMer = largeur / 2;
  const largeurFenetre = (largeur / 12.4) * 3; // ~3h sur ~12h25 de cycle, à l'échelle du schéma
  const xFenetre = centreBasseMer - (largeur / 12.4) * 2;

  return (
    <svg
      viewBox={`0 0 ${largeur} ${hauteur + 34}`}
      className={className}
      role="img"
      aria-label="Schéma : la mer descend, atteint son niveau le plus bas, puis remonte. La collecte se place dans la fenêtre qui commence deux heures avant la basse mer et finit une heure après."
    >
      {/* fenêtre de collecte */}
      <rect x={xFenetre} y={10} width={largeurFenetre} height={hauteur - 10} fill="#ff5a1f" opacity={0.14} />
      <rect x={xFenetre} y={10} width={largeurFenetre} height={hauteur - 10} fill="none" stroke="#ff5a1f" strokeDasharray="4 4" opacity={0.6} />

      {/* ligne de référence (laisse de mer / estran) */}
      <line x1={0} y1={hauteur - 15} x2={largeur} y2={hauteur - 15} stroke="#11232b" strokeOpacity={0.15} />

      {/* courbe de hauteur d'eau illustrative */}
      <path d={points.join(" ")} fill="none" stroke="#1c7d96" strokeWidth={3} strokeLinecap="round" />

      {/* marqueur basse mer */}
      <circle cx={centreBasseMer} cy={30} r={5} fill="#0b3a4a" stroke="white" strokeWidth={1.5} />

      <text x={centreBasseMer} y={hauteur + 22} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0b3a4a">
        Basse mer
      </text>
      <text x={centreBasseMer} y={hauteur + 34} textAnchor="middle" fontSize={10.5} fill="#11232b" opacity={0.7}>
        estran découvert
      </text>
      <text x={xFenetre + largeurFenetre / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill="#e2470f">
        Fenêtre de collecte
      </text>
      <text x={xFenetre + largeurFenetre / 2} y={42} textAnchor="middle" fontSize={10} fill="#e2470f" opacity={0.85}>
        -2h à +1h
      </text>
    </svg>
  );
}
