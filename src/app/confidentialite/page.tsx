import type { Metadata } from "next";
import { DUREE_CONSERVATION_JOURS } from "@/lib/rgpd";

export const metadata: Metadata = {
  title: "Confidentialité — Ramasse ta rade",
};

// CONTACT_RGPD est lu au rendu, pas au build (l'image Docker ne le reçoit
// qu'au démarrage).
export const dynamic = "force-dynamic";

// Information des personnes (RGPD, art. 13). À relire par l'équipe si le
// responsable du traitement ou l'hébergement changent.
export default function ConfidentialitePage() {
  const contact = process.env.CONTACT_RGPD?.trim();

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-display text-3xl font-extrabold text-rade">Vos données personnelles</h1>
      <p className="mt-3 text-encre/80">
        Pour s&apos;inscrire à une collecte, on vous demande seulement un prénom et une adresse e-mail. Voici ce
        qu&apos;on en fait.
      </p>

      <section className="mt-6">
        <h2 className="font-display text-xl font-bold text-rade">Qui est responsable ?</h2>
        <p className="mt-2 text-encre/80">
          L&apos;équipe Les Goélands (Jean, Cheun, Gaspard, Corentin), dans le cadre d&apos;un projet de M2 Gestion
          de projet.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-bold text-rade">Quelles données, et pourquoi ?</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-encre/80">
          <li>
            <strong>Votre prénom</strong> : affiché dans la liste publique des inscrit·es de la collecte, pour que
            chacun·e sache qui vient.
          </li>
          <li>
            <strong>Votre e-mail</strong> : jamais affiché publiquement. Seul·es les ambassadeur·rices de Ramasse
            ta rade, avec leur code d&apos;accès, peuvent le consulter, pour vous prévenir d&apos;un changement
            (horaire, annulation, météo).
          </li>
          <li>
            <strong>Les dates d&apos;inscription et de consentement</strong> : pour prouver que vous avez accepté
            ce traitement.
          </li>
        </ul>
        <p className="mt-2 text-encre/80">
          La base légale est votre consentement, donné en cochant la case du formulaire. Vos données ne sont ni
          vendues, ni utilisées pour de la publicité, ni pour une lettre d&apos;information.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-bold text-rade">Combien de temps ?</h2>
        <p className="mt-2 text-encre/80">
          Votre inscription (prénom et e-mail) est supprimée automatiquement {DUREE_CONSERVATION_JOURS} jours
          après la date de la collecte. Seul le bilan chiffré (kilos ramassés, nombre de participant·es) est
          conservé, sans aucune donnée personnelle.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-bold text-rade">Où sont-elles stockées ?</h2>
        <p className="mt-2 text-encre/80">
          Le site est hébergé par Vercel et la base de données par Supabase, qui agissent comme sous-traitants.
          Le site n&apos;utilise aucun cookie ni outil de mesure d&apos;audience. La carte affiche des fonds
          OpenStreetMap : votre navigateur les télécharge directement depuis leurs serveurs.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-bold text-rade">Vos droits</h2>
        <p className="mt-2 text-encre/80">
          Vous pouvez accéder à vos données, les corriger, les supprimer ou retirer votre consentement à tout
          moment :
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-encre/80">
          <li>
            <strong>Vous désinscrire</strong> en ouvrant le lien personnel affiché après votre inscription : votre
            prénom et votre e-mail sont supprimés immédiatement.
          </li>
          <li>
            {contact ? (
              <>
                <strong>Nous écrire</strong> à{" "}
                <a href={`mailto:${contact}`} className="font-semibold text-golfe underline">
                  {contact}
                </a>{" "}
                pour toute autre demande, ou si vous avez perdu votre lien.
              </>
            ) : (
              <>
                <strong>Nous contacter</strong> via l&apos;ambassadeur·rice qui organise votre collecte pour toute
                autre demande, ou si vous avez perdu votre lien.
              </>
            )}
          </li>
        </ul>
        <p className="mt-2 text-encre/80">
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la{" "}
          <a
            href="https://www.cnil.fr/fr/plaintes"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-golfe underline"
          >
            CNIL
          </a>
          .
        </p>
      </section>
    </div>
  );
}
