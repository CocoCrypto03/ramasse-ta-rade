"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [etat, setEtat] = useState<"repos" | "envoi" | "succes" | "erreur">("repos");
  const [messageErreur, setMessageErreur] = useState("");

  const complet = placesRestantes <= 0;

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    setMessageErreur("");

    try {
      const reponse = await fetch(`/api/collectes/${collecteId}/inscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, email }),
      });
      const data = await reponse.json();

      if (!reponse.ok) {
        setEtat("erreur");
        setMessageErreur(data.erreur ?? "Impossible de s'inscrire pour le moment.");
        return;
      }

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
        Votre e-mail n&apos;est utilisé que pour cette collecte et n&apos;est jamais affiché publiquement.
      </p>
    </form>
  );
}
