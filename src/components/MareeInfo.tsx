import type { InfoMareeCollecte } from "@/lib/marees";

function badge(statut: InfoMareeCollecte["statut"], terminee: boolean) {
  if (statut === "calee") {
    return {
      classe: "bg-algue-light text-algue",
      texte: terminee ? "Calée sur la marée basse" : "Calée sur la marée basse",
      symbole: "●",
    };
  }
  if (statut === "attention") {
    return {
      classe: "bg-bouee/10 text-bouee-dark",
      texte: terminee
        ? "La mer était déjà remontante à cette heure"
        : "Attention : marée montante, gardez un œil sur la mer",
      symbole: "▲",
    };
  }
  // "trop_tot"
  return {
    classe: "bg-golfe/10 text-golfe",
    texte: terminee
      ? "La mer n'était pas encore tout à fait basse à cette heure"
      : "Un peu tôt : la mer n'est pas encore basse",
    symbole: "◐",
  };
}

export default function MareeInfo({
  info,
  source,
  terminee = false,
}: {
  info: InfoMareeCollecte;
  source: { source: string; licence: string; avertissement: string; genereLe: string };
  terminee?: boolean;
}) {
  return (
    <div className="rounded-xl border border-golfe/30 bg-golfe/5 p-4">
      <h3 className="font-display text-lg font-bold text-rade">
        {terminee ? "Marée ce jour-là" : "Marée du jour"}
      </h3>

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
                {bm.heure.slice(11, 16).replace(":", "h")}
                {i < info.bassesMers.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>

          {(() => {
            const b = badge(info.statut, terminee);
            return (
              <p className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${b.classe}`}>
                <span aria-hidden="true">{b.symbole}</span> {b.texte}
              </p>
            );
          })()}
        </>
      )}

      <p className="mt-3 text-xs text-encre/60">
        Source : {source.source} ({source.licence}). Donnée approximative à but pédagogique —{" "}
        <strong>vérifiez toujours sur maree.shom.fr avant de partir.</strong>
      </p>
    </div>
  );
}
