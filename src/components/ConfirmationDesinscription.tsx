"use client";

import { useState } from "react";
import Link from "next/link";

// Le jeton est dans le fragment de l'URL (/desinscription#<jeton>) : le
// navigateur ne l'envoie jamais au serveur en chargeant la page. On ne le
// lit qu'au clic, puis on le transmet dans le corps d'une requête POST.
// Une confirmation explicite évite qu'un aperçu de lien (messagerie,
// antivirus) ne désinscrive la personne à son insu.
export default function ConfirmationDesinscription() {
  const [etat, setEtat] = useState<"repos" | "envoi" | "succes" | "erreur">("repos");
  const [message, setMessage] = useState("");
  const [collecte, setCollecte] = useState<{ id: string; titre: string } | null>(null);

  async function confirmer() {
    const jeton = window.location.hash.slice(1);
    if (!jeton) {
      setEtat("erreur");
      setMessage("Ce lien est incomplet. Copiez-le en entier depuis la confirmation d'inscription.");
      return;
    }

    setEtat("envoi");
    try {
      const reponse = await fetch("/api/desinscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jeton }),
      });
      const data = await reponse.json();
      if (!reponse.ok) {
        setEtat("erreur");
        setMessage(data.erreur ?? "Désinscription impossible pour le moment.");
        return;
      }
      // Le jeton ne sert plus : on le retire de l'URL et de l'historique.
      window.history.replaceState(null, "", window.location.pathname);
      setCollecte(data.collecte);
      setEtat("succes");
    } catch {
      setEtat("erreur");
      setMessage("Connexion impossible. Réessayez.");
    }
  }

  if (etat === "succes") {
    return (
      <div className="rounded-lg border-2 border-algue bg-algue-light p-4" role="status">
        <p className="font-semibold text-algue">Vous êtes désinscrit·e.</p>
        <p className="mt-1 text-sm text-encre/80">
          {collecte ? <>Votre inscription à « {collecte.titre} » </> : <>Votre inscription </>}
          et votre adresse e-mail ont été supprimées.
        </p>
        <Link href="/carte" className="mt-3 inline-block font-semibold text-golfe underline">
          Voir les autres collectes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-encre/80">
        Votre prénom et votre e-mail seront définitivement supprimés de cette collecte.
      </p>
      {etat === "erreur" && (
        <p className="mt-3 text-sm font-semibold text-bouee-dark" role="alert">
          {message}
        </p>
      )}
      <button
        type="button"
        onClick={confirmer}
        disabled={etat === "envoi"}
        className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-bouee px-6 font-bold text-white transition-colors hover:bg-bouee-dark disabled:opacity-60"
      >
        {etat === "envoi" ? "Suppression…" : "Confirmer ma désinscription"}
      </button>
    </div>
  );
}
