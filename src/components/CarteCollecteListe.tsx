// Carte compacte pour une collecte dans une liste (accueil, carte) —
// grandes zones tactiles, contraste fort, lisible par des personnes âgées.

import Link from "next/link";
import type { Collecte } from "@/lib/types";
import { formatDateLongueFr, formatHeureFr } from "@/lib/temps";

export default function CarteCollecteListe({
  collecte,
  placesRestantes,
}: {
  collecte: Collecte;
  placesRestantes?: number;
}) {
  const terminee = collecte.statut === "terminee";

  return (
    <Link
      href={`/collecte/${collecte.id}`}
      className={`block rounded-xl border p-4 transition-colors ${
        terminee
          ? "border-encre/10 bg-white/40 hover:bg-white/70"
          : "border-golfe/20 bg-white hover:border-golfe/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`font-display text-lg font-bold ${terminee ? "text-encre/60" : "text-rade"}`}>
            {collecte.titre}
          </p>
          <p className={`mt-0.5 text-sm ${terminee ? "text-encre/50" : "text-encre/75"}`}>
            {collecte.lieu}, {collecte.commune}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
            terminee ? "bg-encre/10 text-encre/60" : "bg-bouee/15 text-bouee-dark"
          }`}
        >
          {terminee ? "Terminée" : "À venir"}
        </span>
      </div>

      <p className={`mt-2 text-sm font-semibold ${terminee ? "text-encre/60" : "text-encre"}`}>
        {formatDateLongueFr(collecte.debut)} à {formatHeureFr(collecte.debut)}
      </p>

      {!terminee && typeof placesRestantes === "number" && (
        <p className="mt-1 text-sm text-encre/70">
          {placesRestantes > 0 ? (
            <>
              <strong className="text-algue">{placesRestantes}</strong> place{placesRestantes > 1 ? "s" : ""}{" "}
              restante{placesRestantes > 1 ? "s" : ""} sur {collecte.places}
            </>
          ) : (
            <strong className="text-bouee-dark">Complet</strong>
          )}
        </p>
      )}
    </Link>
  );
}
