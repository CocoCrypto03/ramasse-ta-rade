"use client";

import { useState, type FormEvent } from "react";
import type { Inscription, InscriptionPublique } from "@/lib/types";
import { formatDateCourteFr } from "@/lib/temps";

export default function ListeInscrits({
  collecteId,
  inscritsInitiaux,
}: {
  collecteId: string;
  inscritsInitiaux: InscriptionPublique[];
}) {
  const [inscrits, setInscrits] = useState<InscriptionPublique[]>(inscritsInitiaux);
  const [complets, setComplets] = useState<Inscription[] | null>(null);
  const [code, setCode] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "erreur">("repos");
  const [ouvert, setOuvert] = useState(false);

  async function voirLesEmails(e: FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    try {
      const reponse = await fetch(`/api/collectes/${collecteId}/inscriptions/emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!reponse.ok) {
        setEtat("erreur");
        return;
      }
      const data = await reponse.json();
      setComplets(data.inscrits);
      setInscrits(data.inscrits);
      setEtat("repos");
    } catch {
      setEtat("erreur");
    }
  }

  return (
    <div>
      {inscrits.length === 0 ? (
        <p className="text-sm text-encre/70">Personne ne s&apos;est encore inscrit·e. Soyez le premier !</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {inscrits.map((i, idx) => (
            <li
              key={`${i.prenom}-${idx}`}
              className="rounded-full bg-sable-dark/60 px-3 py-1 text-sm text-encre"
            >
              {i.prenom}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        {!complets && (
          <button
            type="button"
            onClick={() => setOuvert((v) => !v)}
            className="text-sm font-semibold text-golfe underline"
          >
            Vous êtes ambassadeur·rice ? Voir les e-mails
          </button>
        )}

        {ouvert && !complets && (
          <form onSubmit={voirLesEmails} className="mt-2 flex max-w-xs gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code ambassadeur"
              className="h-11 flex-1 rounded-lg border border-encre/20 bg-white px-3 text-sm"
            />
            <button
              type="submit"
              disabled={etat === "envoi"}
              className="h-11 rounded-lg bg-rade px-4 text-sm font-semibold text-sable"
            >
              Valider
            </button>
          </form>
        )}

        {etat === "erreur" && <p className="mt-2 text-sm font-semibold text-bouee-dark">Code incorrect.</p>}

        {complets && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-encre/20 text-encre/60">
                  <th className="py-1 pr-3 font-semibold">Prénom</th>
                  <th className="py-1 pr-3 font-semibold">E-mail</th>
                  <th className="py-1 font-semibold">Inscrit·e le</th>
                </tr>
              </thead>
              <tbody>
                {complets.map((i) => (
                  <tr key={i.id} className="border-b border-encre/10">
                    <td className="py-1.5 pr-3">{i.prenom}</td>
                    <td className="py-1.5 pr-3">{i.email}</td>
                    <td className="py-1.5">{formatDateCourteFr(i.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
