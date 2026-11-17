"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DUREE_CONSERVATION_JOURS } from "@/lib/rgpd";

export default function FormulaireInscription({
  collecteId,
  placesRestantes,
  terminee,
  onInscrit,
}: {
  collecteId: string;
  placesRestantes: number;
  terminee: boolean;
  onInscrit?: (prenom: string) => void;
}) {
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [consentement, setConsentement] = useState(false);
  const router = useRouter();
  const [etat, setEtat] = useState<"repos" | "envoi" | "succes" | "erreur">("repos");
  const [messageErreur, setMessageErreur] = useState("");
  const [lienDesinscription, setLienDesinscription] = useState("");
  const [lienCopie, setLienCopie] = useState(false);

  const complet = placesRestantes <= 0;

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    setMessageErreur("");

    try {
      const reponse = await fetch(`/api/collectes/${collecteId}/inscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, email, consentement }),
      });
      const data = await reponse.json();

      if (!reponse.ok) {
        setEtat("erreur");
        setMessageErreur(data.erreur ?? "Impossible de s'inscrire pour le moment.");
        return;
      }

      // Jeton dans le fragment (#) : il n'est jamais envoyé au serveur en
      // ouvrant le lien, donc absent des journaux et de l'en-tête Referer.
      setLienDesinscription(`${window.location.origin}/desinscription#${data.jetonDesinscription}`);
      setEtat("succes");
      router.refresh();
      onInscrit?.(prenom);
    } catch {
      setEtat("erreur");
      setMessageErreur("Connexion impossible. Réessayez.");
    }
  }

  if (terminee) {
    return (
      <p className="rounded-lg bg-sable-dark/60 p-4 text-sm text-encre/80">
        Cette collecte est terminée, les inscriptions sont closes.
      </p>
    );
  }

  if (etat === "succes") {
    return (
      <div className="rounded-lg border-2 border-algue bg-algue-light p-4" role="status">
        <p className="font-semibold text-algue">C&apos;est noté, {prenom} !</p>
        <p className="mt-1 text-sm text-encre/80">
          Vous êtes inscrit·e. Pensez à vérifier l&apos;horaire de marée avant de partir, et à venir avec vos
          gants.
        </p>
        <a
          href={`/api/collectes/${collecteId}/agenda`}
          className="mt-3 inline-flex min-h-11 items-center rounded-full bg-algue px-5 text-sm font-bold text-white"
        >
          Ajouter à mon agenda
        </a>
        {lienDesinscription && (
          <div className="mt-3 border-t border-algue/30 pt-3">
            <p className="text-sm font-semibold text-encre">Votre lien de désinscription</p>
            <p className="mt-1 text-xs text-encre/70">
              Gardez-le : il permet de supprimer votre inscription et votre e-mail à tout moment. Il ne
              sera plus affiché.
            </p>
            <div className="mt-2 flex gap-2">
              <input
                readOnly
                value={lienDesinscription}
                onFocus={(e) => e.target.select()}
                aria-label="Lien de désinscription"
                className="h-11 min-w-0 flex-1 rounded-lg border border-encre/20 bg-white px-3 text-xs"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(lienDesinscription);
                    setLienCopie(true);
                  } catch {
                    // Presse-papiers indisponible : le champ reste sélectionnable à la main.
                  }
                }}
                className="h-11 shrink-0 rounded-lg bg-rade px-4 text-sm font-semibold text-sable"
              >
                {lienCopie ? "Copié" : "Copier"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (complet) {
    return (
      <p className="rounded-lg bg-sable-dark/60 p-4 text-sm text-encre/80">
        Cette collecte est complète. Regardez les autres collectes à venir sur la carte.
      </p>
    );
  }

  return (
    <form onSubmit={soumettre} className="flex flex-col gap-3">
      <div>
        <label htmlFor="prenom" className="text-sm font-semibold text-encre">
          Prénom
        </label>
        <input
          id="prenom"
          required
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="mt-1 h-12 w-full rounded-lg border border-encre/20 bg-white px-3 text-base"
          placeholder="Kaïna"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-encre">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 h-12 w-full rounded-lg border border-encre/20 bg-white px-3 text-base"
          placeholder="vous@exemple.fr"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-encre/80">
        <input
          type="checkbox"
          required
          checked={consentement}
          onChange={(e) => setConsentement(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-golfe"
        />
        <span>
          J&apos;accepte que mon prénom apparaisse dans la liste publique des inscrit·es et que mon e-mail soit
          transmis aux ambassadeur·rices pour me contacter au sujet de cette collecte.
        </span>
      </label>

      {etat === "erreur" && (
        <p className="text-sm font-semibold text-bouee-dark" role="alert">
          {messageErreur}
        </p>
      )}

      <button
        type="submit"
        disabled={etat === "envoi"}
        className="mt-1 inline-flex min-h-12 items-center justify-center rounded-full bg-bouee px-6 font-bold text-white transition-colors hover:bg-bouee-dark disabled:opacity-60"
      >
        {etat === "envoi" ? "Inscription…" : "Je m'inscris"}
      </button>
      <p className="text-xs text-encre/60">
        Votre e-mail n&apos;est jamais affiché publiquement. Vos données sont supprimées{" "}
        {DUREE_CONSERVATION_JOURS} jours après la collecte, et vous pouvez vous désinscrire à tout moment.{" "}
        <Link href="/confidentialite" className="font-semibold text-golfe underline">
          En savoir plus
        </Link>
      </p>
    </form>
  );
}
