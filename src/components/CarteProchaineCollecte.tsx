// Carte mise en avant de la prochaine collecte à venir, sur l'accueil
// (US-01/US-02) : date, lieu, heure, basse mer, places restantes, bouton.

import Link from "next/link";
import type { Collecte } from "@/lib/types";
import type { InfoMareeCollecte } from "@/lib/marees";
import { formatDateLongueFr, formatHeureFr, jourMoisAbregeFr } from "@/lib/temps";

export default function CarteProchaineCollecte({
  collecte,
  placesRestantes,
  infoMaree,
}: {
  collecte: Collecte;
  placesRestantes: number;
  infoMaree: InfoMareeCollecte;
}) {
  const { jour, moisAbrege } = jourMoisAbregeFr(collecte.debut);
  const basseMer = infoMaree.basseMerLaPlusProche ?? infoMaree.bassesMers[0] ?? null;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-bouee bg-white shadow-sm">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-rade px-5 py-3 text-sable">
          <span className="font-display text-3xl font-extrabold leading-none">{jour}</span>
          <span className="mt-0.5 text-xs font-bold uppercase tracking-wide">{moisAbrege}</span>
        </div>

        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-bouee-dark">Prochaine collecte</p>
          <p className="font-display mt-1 text-xl font-bold text-rade">{collecte.titre}</p>
          <p className="mt-1 text-sm text-encre/75">
            {collecte.lieu}, {collecte.commune} · {formatDateLongueFr(collecte.debut)} à{" "}
            {formatHeureFr(collecte.debut)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {basseMer && (
              <span className="rounded-full bg-golfe/10 px-3 py-1 font-semibold text-golfe">
                Basse mer à {basseMer.heure.slice(11, 16).replace(":", "h")}
              </span>
            )}
            <span className="rounded-full bg-algue-light px-3 py-1 font-semibold text-algue">
              {placesRestantes > 0
                ? `${placesRestantes} place${placesRestantes > 1 ? "s" : ""} restante${placesRestantes > 1 ? "s" : ""}`
                : "Complet"}
            </span>
          </div>
        </div>

        <Link
          href={`/collecte/${collecte.id}`}
          className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-full bg-bouee px-7 text-base font-bold text-white shadow-sm transition-colors hover:bg-bouee-dark"
        >
          Je participe
        </Link>
      </div>
    </div>
  );
}
