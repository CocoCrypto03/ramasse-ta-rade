import Link from "next/link";
import { notFound } from "next/navigation";
import {
  compterInscriptions,
  listerInscriptionsPubliques,
  obtenirBilan,
  obtenirCollecte,
} from "@/lib/db";
import { infoMareeCollecte, sourceMarees } from "@/lib/marees";
import { dateParisISO, ephemerideFr, formatDateLongueFr, formatHeureFr } from "@/lib/temps";
import RafraichirApresInscription from "@/components/RafraichirApresInscription";
import ListeInscrits from "@/components/ListeInscrits";
import MareeInfo from "@/components/MareeInfo";
import BoutonWhatsapp from "@/components/BoutonWhatsapp";
import CarteCollectes from "@/components/CarteCollectes";
import CourbeMaree from "@/components/CourbeMaree";

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
  const pctPlaces = collecte.places > 0 ? Math.min(100, Math.round((nbInscrits / collecte.places) * 100)) : 0;
  const info = infoMareeCollecte(collecte.debut);
  const source = sourceMarees();
  const terminee = collecte.statut === "terminee";
  const eph = ephemerideFr(collecte.debut);
  const lienItineraire = `https://www.openstreetmap.org/directions?to=${collecte.lat}%2C${collecte.lng}`;

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <Link href="/carte" className="text-sm font-semibold text-golfe">
        ← Retour à la carte
      </Link>

      <div className="mt-3 flex items-start gap-4">
        <div
          className={`flex shrink-0 flex-col items-center justify-center rounded-xl px-3.5 py-2 ${
            terminee ? "bg-encre/10 text-encre/70" : "bg-rade text-sable"
          }`}
        >
          <span className="font-display text-2xl font-extrabold leading-none">{eph.jour}</span>
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wide">{eph.mois.slice(0, 3)}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl font-extrabold text-rade sm:text-3xl">{collecte.titre}</h1>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                terminee ? "bg-encre/10 text-encre/70" : "bg-bouee/15 text-bouee-dark"
              }`}
            >
              {terminee ? "Terminée" : "À venir"}
            </span>
          </div>
          <p className="mt-1 text-sm uppercase tracking-wide text-encre/55">
            {eph.jourSemaine} {eph.jour} {eph.mois} {eph.annee}
          </p>
        </div>
      </div>

      <p className="mt-3 text-lg text-encre/80">
        {collecte.lieu}, {collecte.commune}
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-encre/15">
        <CarteCollectes collectes={[collecte]} hauteurClasse="h-44" interactif={false} />
      </div>
      <a
        href={lienItineraire}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-golfe underline"
      >
        Itinéraire vers {collecte.lieu}
      </a>

      <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-sable-dark/50 p-4 text-sm sm:grid-cols-3">
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
        <div className="col-span-2 sm:col-span-3">
          <dt className="text-encre/60">Matériel à apporter</dt>
          <dd className="font-semibold text-encre">{collecte.materiel || "Non précisé"}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl border border-encre/10 bg-white p-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold text-encre">Inscrit·es</span>
          <span className="text-encre/70">
            {nbInscrits} / {collecte.places} place{collecte.places > 1 ? "s" : ""}
          </span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-sable-dark" role="presentation">
          <div
            className={`h-full rounded-full ${placesRestantes === 0 ? "bg-bouee" : "bg-algue"}`}
            style={{ width: `${pctPlaces}%` }}
          />
        </div>
      </div>

      <div className="mt-5">
        <MareeInfo info={info} source={source} terminee={terminee} />
      </div>

      <div className="mt-5 rounded-xl border border-golfe/30 bg-white p-4">
        <h3 className="font-display text-lg font-bold text-rade">Hauteur d&apos;eau du jour</h3>
        <div className="mt-3">
          <CourbeMaree jourISO={dateParisISO(collecte.debut)} debutISO={collecte.debut} dureeMin={collecte.duree_min} />
        </div>
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
        <h2 className="font-display text-xl font-bold text-rade">Qui est inscrit·e</h2>
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
