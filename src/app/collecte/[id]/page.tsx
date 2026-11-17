import Link from "next/link";
import { notFound } from "next/navigation";
import {
  compterInscriptions,
  listerInscriptionsPubliques,
  obtenirBilan,
  obtenirCollecte,
} from "@/lib/db";
import { infoMareeCollecte, sourceMarees } from "@/lib/marees";
import { formatDateLongueFr, formatHeureFr } from "@/lib/temps";
import RafraichirApresInscription from "@/components/RafraichirApresInscription";
import ListeInscrits from "@/components/ListeInscrits";
import MareeInfo from "@/components/MareeInfo";
import BoutonWhatsapp from "@/components/BoutonWhatsapp";

export const dynamic = "force-dynamic";

function formatDuree(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const reste = min % 60;
  return reste === 0 ? `${h} h` : `${h} h ${reste}`;
}

export default async function DetailCollecte({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collecte = await obtenirCollecte(id);
  if (!collecte) notFound();

  const [nbInscrits, inscritsPublics, bilan] = await Promise.all([
    compterInscriptions(id),
    listerInscriptionsPubliques(id),
    obtenirBilan(id),
  ]);

  const placesRestantes = Math.max(0, collecte.places - nbInscrits);
  const info = infoMareeCollecte(collecte.debut);
  const source = sourceMarees();
  const terminee = collecte.statut === "terminee";

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <Link href="/carte" className="text-sm font-semibold text-golfe">
        ← Retour à la carte
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold text-rade">{collecte.titre}</h1>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            terminee ? "bg-encre/10 text-encre/70" : "bg-bouee/15 text-bouee-dark"
          }`}
        >
          {terminee ? "Terminée" : "À venir"}
        </span>
      </div>

      <p className="mt-1 text-lg text-encre/80">
        {collecte.lieu}, {collecte.commune}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-sable-dark/50 p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-encre/60">Date</dt>
          <dd className="font-semibold text-encre">{formatDateLongueFr(collecte.debut)}</dd>
        </div>
        <div>
          <dt className="text-encre/60">Heure</dt>
          <dd className="font-semibold text-encre">{formatHeureFr(collecte.debut)}</dd>
        </div>
        <div>
          <dt className="text-encre/60">Durée</dt>
          <dd className="font-semibold text-encre">{formatDuree(collecte.duree_min)}</dd>
        </div>
        <div>
          <dt className="text-encre/60">Organisateur·rice</dt>
          <dd className="font-semibold text-encre">{collecte.organisateur}</dd>
        </div>
        <div>
          <dt className="text-encre/60">Places</dt>
          <dd className="font-semibold text-encre">
            {terminee ? `${collecte.places} places` : `${placesRestantes} / ${collecte.places} restantes`}
          </dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-encre/60">Matériel à apporter</dt>
          <dd className="font-semibold text-encre">{collecte.materiel || "Non précisé"}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <MareeInfo info={info} source={source} />
      </div>

      {terminee && bilan && (
        <div className="mt-5 rounded-xl border border-algue/30 bg-algue-light p-4">
          <h3 className="font-display text-lg font-bold text-algue">Bilan de la collecte</h3>
          <p className="mt-2 text-sm text-encre/80">
            {bilan.kg !== null && (
              <>
                <strong>{bilan.kg} kg</strong> de déchets ramassés
                {bilan.sacs !== null ? ", " : ""}
              </>
            )}
            {bilan.sacs !== null && (
              <>
                <strong>{bilan.sacs}</strong> sac{bilan.sacs > 1 ? "s" : ""} remplis
              </>
            )}
            {" — "}
            <strong>{bilan.participants}</strong> participant{bilan.participants > 1 ? "s" : ""}.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <BoutonWhatsapp titre={collecte.titre} lieu={`${collecte.lieu}, ${collecte.commune}`} dateTexte={formatDateLongueFr(collecte.debut)} />
        {!terminee && (
          <Link href={`/collecte/${id}/bilan`} className="text-sm font-semibold text-encre/60 underline">
            Je suis ambassadeur·rice, saisir le bilan
          </Link>
        )}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-rade">
          Inscrit·es ({nbInscrits}{!terminee ? ` / ${collecte.places}` : ""})
        </h2>
        <div className="mt-3">
          <ListeInscrits collecteId={id} inscritsInitiaux={inscritsPublics} />
        </div>
      </section>

      {!terminee && (
        <section className="mt-8 border-t border-encre/15 pt-6">
          <h2 className="font-display text-xl font-bold text-rade">S&apos;inscrire</h2>
          <p className="mt-1 text-sm text-encre/70">Prénom et e-mail, en moins de 30 secondes, sans compte.</p>
          <div className="mt-4">
            <RafraichirApresInscription collecteId={id} placesRestantes={placesRestantes} terminee={terminee} />
          </div>
        </section>
      )}
    </div>
  );
}
