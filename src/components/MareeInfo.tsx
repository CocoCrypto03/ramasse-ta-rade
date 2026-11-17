import type { InfoMareeCollecte } from "@/lib/marees";
import { formatHeureFr } from "@/lib/temps";

export default function MareeInfo({
  info,
  source,
}: {
  info: InfoMareeCollecte;
  source: { source: string; licence: string; avertissement: string; genereLe: string };
}) {
  return (
    <div className="rounded-xl border border-golfe/30 bg-golfe/5 p-4">
      <h3 className="font-display text-lg font-bold text-rade">Marée du jour</h3>

      {info.statut === "inconnue" ? (
        <p className="mt-2 text-sm text-encre/80">
          Donnée de marée indisponible pour cette date dans notre fichier local. Vérifiez les horaires sur{" "}
          <a href="https://maree.shom.fr" target="_blank" rel="noopener noreferrer" className="font-semibold text-golfe underline">
            maree.shom.fr
          </a>{" "}
          avant de partir.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-encre/80">
            Basse{info.bassesMers.length > 1 ? "s" : ""} mer{info.bassesMers.length > 1 ? "s" : ""} du jour :{" "}
            {info.bassesMers.map((bm, i) => (
              <span key={bm.heure} className="font-semibold text-encre">
                {formatHeureFr(bm.heure + ":00Z")}
                {i < info.bassesMers.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>

          {info.statut === "calee" ? (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-algue-light px-3 py-1.5 text-sm font-semibold text-algue">
              ● Calée sur la marée basse
            </p>
          ) : (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-bouee/10 px-3 py-1.5 text-sm font-semibold text-bouee-dark">
              ▲ Attention, marée montante à l&apos;heure de la collecte
            </p>
          )}
        </>
      )}

      <p className="mt-3 text-xs text-encre/60">
        Source : {source.source} ({source.licence}). Donnée approximative à but pédagogique —{" "}
        <strong>vérifiez toujours sur maree.shom.fr avant de partir.</strong>
      </p>
    </div>
  );
}
