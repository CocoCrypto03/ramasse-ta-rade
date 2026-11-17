// Graphique SVG maison (aucune dépendance) de la hauteur d'eau du jour,
// interpolée en cosinus entre les extrema réels de data/marees.json —
// US-02 / section « page détail ». Composant serveur : aucune interactivité.

import { extremaPourCourbe, type PointCourbeMaree } from "@/lib/marees";
import { heureDecimaleParis } from "@/lib/temps";

const LARGEUR = 600;
const HAUTEUR = 190;
const MARGE_GAUCHE = 8;
const MARGE_DROITE = 8;
const MARGE_HAUT = 20;
const MARGE_BAS = 26;
const ZONE_L = LARGEUR - MARGE_GAUCHE - MARGE_DROITE;
const ZONE_H = HAUTEUR - MARGE_HAUT - MARGE_BAS;

function hauteurInterpolee(t: number, points: PointCourbeMaree[]): number {
  // Cherche les deux extrema qui encadrent l'instant t pour interpoler en
  // cosinus (forme réaliste d'une courbe de marée, cf. README US-12).
  let i = 0;
  while (i < points.length - 2 && points[i + 1].heureDecimale < t) i++;
  const p0 = points[i];
  const p1 = points[i + 1] ?? p0;
  if (p1.heureDecimale === p0.heureDecimale) return p0.hauteur_m;
  const phase = (Math.PI * (t - p0.heureDecimale)) / (p1.heureDecimale - p0.heureDecimale);
  return (p0.hauteur_m + p1.hauteur_m) / 2 + ((p0.hauteur_m - p1.hauteur_m) / 2) * Math.cos(phase);
}

function formatHeureDecimale(h: number): string {
  const hh = Math.floor(((h % 24) + 24) % 24);
  const mm = Math.round((h - Math.floor(h)) * 60);
  return `${String(hh).padStart(2, "0")}h${String(mm).padStart(2, "0")}`;
}

export default function CourbeMaree({
  jourISO,
  debutISO,
  dureeMin,
}: {
  jourISO: string;
  debutISO: string;
  dureeMin: number;
}) {
  const extrema = extremaPourCourbe(jourISO);
  if (extrema.length < 2) {
    return (
      <p className="text-sm text-encre/70">
        Pas assez de données de marée locales pour tracer la courbe de ce jour.
      </p>
    );
  }

  const hauteurs = extrema.map((p) => p.hauteur_m);
  const hMin = Math.min(...hauteurs) - 0.4;
  const hMax = Math.max(...hauteurs) + 0.4;

  const x = (t: number) => MARGE_GAUCHE + (t / 24) * ZONE_L;
  const y = (h: number) => MARGE_HAUT + ((hMax - h) / (hMax - hMin)) * ZONE_H;

  const pas = 0.2;
  const chemin: string[] = [];
  for (let t = 0; t <= 24.0001; t += pas) {
    const h = hauteurInterpolee(Math.min(t, 24), extrema);
    chemin.push(`${t === 0 ? "M" : "L"}${x(t).toFixed(1)},${y(h).toFixed(1)}`);
  }

  const debutH = heureDecimaleParis(debutISO);
  const finH = Math.min(24, debutH + dureeMin / 60);

  const extremaDuJour = extrema.filter((p) => p.heureDecimale >= 0 && p.heureDecimale <= 24);
  const ticks = [0, 4, 8, 12, 16, 20, 24];

  const resume = extremaDuJour
    .map((p) => `${p.type === "basse_mer" ? "basse mer" : "pleine mer"} à ${formatHeureDecimale(p.heureDecimale)}`)
    .join(", ");

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Hauteur d'eau du jour : ${resume}. Collecte de ${formatHeureDecimale(debutH)} à ${formatHeureDecimale(finH)}, surlignée sur le graphique.`}
      >
        {/* grille horaire */}
        {ticks.map((t) => (
          <line
            key={t}
            x1={x(t)}
            y1={MARGE_HAUT}
            x2={x(t)}
            y2={MARGE_HAUT + ZONE_H}
            stroke="#11232b"
            strokeOpacity={0.08}
          />
        ))}

        {/* fenêtre de la collecte */}
        <rect
          x={x(debutH)}
          y={MARGE_HAUT}
          width={Math.max(2, x(finH) - x(debutH))}
          height={ZONE_H}
          fill="#ff5a1f"
          fillOpacity={0.14}
        />
        <rect
          x={x(debutH)}
          y={MARGE_HAUT}
          width={Math.max(2, x(finH) - x(debutH))}
          height={ZONE_H}
          fill="none"
          stroke="#ff5a1f"
          strokeOpacity={0.5}
          strokeDasharray="3 3"
        />

        {/* courbe de hauteur d'eau */}
        <path d={chemin.join(" ")} fill="none" stroke="#1c7d96" strokeWidth={2.5} strokeLinecap="round" />

        {/* extrema (pleines / basses mers) */}
        {extremaDuJour.map((p) => (
          <g key={p.heureDecimale}>
            <circle
              cx={x(p.heureDecimale)}
              cy={y(p.hauteur_m)}
              r={4.5}
              fill={p.type === "basse_mer" ? "#0b3a4a" : "#2fa3bf"}
              stroke="white"
              strokeWidth={1.5}
            />
            <text
              x={x(p.heureDecimale)}
              y={p.type === "basse_mer" ? y(p.hauteur_m) + 16 : y(p.hauteur_m) - 10}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill="#11232b"
            >
              {formatHeureDecimale(p.heureDecimale)}
            </text>
          </g>
        ))}

        {/* axe des heures */}
        {ticks.map((t) => (
          <text
            key={t}
            x={x(t)}
            y={HAUTEUR - 6}
            textAnchor="middle"
            fontSize={10}
            fill="#11232b"
            opacity={0.6}
          >
            {t}h
          </text>
        ))}
      </svg>
      <figcaption className="mt-1 text-xs text-encre/60">
        Hauteur d&apos;eau estimée le jour de la collecte — zone orangée : horaire de la collecte.
      </figcaption>
    </figure>
  );
}
