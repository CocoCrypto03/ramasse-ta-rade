import Link from "next/link";
import { obtenirImpact } from "@/lib/db";
import CompteurImpact from "@/components/CompteurImpact";
import VagueDivider from "@/components/VagueDivider";

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
  const impact = await obtenirImpact();

  return (
    <>
      <section className="bg-rade text-sable">
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-10 sm:pb-16 sm:pt-16">
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
      </section>

      <VagueDivider />

      <section className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
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
