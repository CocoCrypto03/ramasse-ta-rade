import Link from "next/link";
import { compterInscriptions, listerCollectes, obtenirImpact } from "@/lib/db";
import { infoMareeCollecte } from "@/lib/marees";
import CompteurImpact from "@/components/CompteurImpact";
import VagueDivider from "@/components/VagueDivider";
import IllustrationRade from "@/components/IllustrationRade";
import SchemaMaree from "@/components/SchemaMaree";
import CarteProchaineCollecte from "@/components/CarteProchaineCollecte";
import CarteCollecteListe from "@/components/CarteCollecteListe";

export const dynamic = "force-dynamic";

const ETAPES = [
  {
    titre: "Repérez une collecte",
    texte: "Ouvrez la carte de la rade de Brest et choisissez une collecte proche de vous, à venir ou déjà passée.",
  },
  {
    titre: "Inscrivez-vous en 30 secondes",
    texte: "Juste votre prénom et votre e-mail, sans créer de compte. Confirmation immédiate à l'écran.",
  },
  {
    titre: "Venez quand la mer découvre",
    texte: "Chaque collecte est calée sur l'horaire de marée basse du jour : plus de plage dégagée, plus de déchets accessibles.",
  },
];

export default async function Accueil() {
  const [collectes, impact] = await Promise.all([listerCollectes(), obtenirImpact()]);

  const aVenir = collectes
    .filter((c) => c.statut === "a_venir")
    .sort((a, b) => a.debut.localeCompare(b.debut));
  const prochaine = aVenir[0] ?? null;
  const restantes = aVenir.slice(1, 4);

  const placesParId = new Map<string, number>();
  await Promise.all(
    aVenir.map(async (c) => {
      const n = await compterInscriptions(c.id);
      placesParId.set(c.id, Math.max(0, c.places - n));
    }),
  );

  return (
    <>
      <section className="relative overflow-hidden bg-rade text-sable">
        <div className="mx-auto grid max-w-5xl gap-6 px-5 pb-10 pt-10 sm:grid-cols-[1.1fr_1fr] sm:items-center sm:gap-8 sm:pb-16 sm:pt-14">
          <div>
            <h1 className="font-display max-w-md text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Rien ne traîne sur notre rade.
            </h1>
            <p className="mt-4 max-w-md text-lg text-sable/90">
              Ramasse ta rade repère les collectes de déchets entre Plouzané et Plougastel-Daoulas, calées sur
              la marée basse pour ramasser un maximum, et vous inscrit sans compte.
            </p>
            <Link
              href="/carte"
              className="mt-7 inline-flex min-h-14 items-center rounded-full bg-bouee px-8 text-lg font-bold text-white shadow-sm transition-colors hover:bg-bouee-dark"
            >
              Trouver une collecte
            </Link>
          </div>
          <IllustrationRade className="w-full max-w-sm justify-self-center sm:max-w-none" />
        </div>
      </section>

      <VagueDivider />

      {prochaine && (
        <section className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
          <h2 className="font-display text-2xl font-bold text-rade">La prochaine collecte</h2>
          <div className="mt-5">
            <CarteProchaineCollecte
              collecte={prochaine}
              placesRestantes={placesParId.get(prochaine.id) ?? prochaine.places}
              infoMaree={infoMareeCollecte(prochaine.debut)}
            />
          </div>

          {restantes.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold text-rade">Et aussi, bientôt</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {restantes.map((c) => (
                  <CarteCollecteListe key={c.id} collecte={c} placesRestantes={placesParId.get(c.id)} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="bg-sable-dark/60">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
          <h2 className="font-display text-2xl font-bold text-rade">Comment ça marche</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {ETAPES.map((etape, i) => (
              <li key={etape.titre} className="flex gap-4 sm:flex-col sm:gap-2">
                <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-golfe text-lg font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-encre">{etape.titre}</p>
                  <p className="mt-1 text-sm text-encre/75">{etape.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
        <h2 className="font-display text-2xl font-bold text-rade">Pourquoi à marée basse ?</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_1.1fr] sm:items-center">
          <SchemaMaree className="w-full" />
          <div className="space-y-3 text-encre/85">
            <p>
              À marée basse, l&apos;estran se découvre : la bande de plage et de rochers habituellement sous
              l&apos;eau devient accessible. C&apos;est là, à la laisse de mer, que la mer dépose le plus de
              déchets au fil des marées — c&apos;est le moment où il y a le plus à ramasser.
            </p>
            <p>
              Chaque collecte se tient dans une fenêtre resserrée autour de la basse mer locale : on arrive
              quand la mer est basse, et on repart avant qu&apos;elle ne remonte sur la zone ramassée, pour
              la sécurité de tout le monde.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-sable-dark/60">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
          <h2 className="font-display text-2xl font-bold text-rade">L&apos;impact collectif</h2>
          <p className="mt-2 max-w-lg text-sm text-encre/75">
            Additionné à chaque bilan rempli par les ambassadeurs à la fin d&apos;une collecte.
          </p>
          <div className="mt-6">
            <CompteurImpact impact={impact} />
          </div>
        </div>
      </section>
    </>
  );
}
