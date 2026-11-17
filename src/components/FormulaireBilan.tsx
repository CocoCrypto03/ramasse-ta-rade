"use client";

import { useState, type FormEvent } from "react";

function EtapesBilan({ succes }: { succes: boolean }) {
  const etapes = ["Saisie du bilan", "Confirmation"];
  return (
    <ol className="mb-6 flex items-center gap-2">
      {etapes.map((label, i) => {
        const actif = succes ? true : i === 0;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                actif ? "bg-bouee text-white" : "bg-sable-dark text-encre/50"
              }`}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className={`text-sm font-semibold ${actif ? "text-encre" : "text-encre/50"}`}>{label}</span>
            {i < etapes.length - 1 && <span className="mx-1 h-px w-6 bg-encre/20" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

export default function FormulaireBilan({ collecteId }: { collecteId: string }) {
  const [code, setCode] = useState("");
  const [kg, setKg] = useState("");
  const [sacs, setSacs] = useState("");
  const [participants, setParticipants] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");

    try {
      const reponse = await fetch(`/api/collectes/${collecteId}/bilan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, kg: kg === "" ? null : Number(kg), sacs: sacs === "" ? null : Number(sacs), participants: Number(participants) }),
      });
      const data = await reponse.json();
      if (!reponse.ok) {
        setErreur(data.erreur ?? "Impossible d'enregistrer le bilan.");
        setEnvoi(false);
        return;
      }
      setSucces(true);
    } catch {
      setErreur("Connexion impossible. Réessayez.");
      setEnvoi(false);
    }
  }

  if (succes) {
    return (
      <div>
        <EtapesBilan succes />
        <div className="rounded-xl border-2 border-algue bg-algue-light p-5">
          <p className="font-display text-lg font-bold text-algue">Bilan enregistré !</p>
          <p className="mt-1 text-sm text-encre/80">
            La collecte passe au statut « terminée » et le compteur d&apos;impact est mis à jour.
          </p>
          <a href={`/collecte/${collecteId}`} className="mt-3 inline-block font-semibold text-golfe underline">
            Voir la collecte
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EtapesBilan succes={false} />
      <form onSubmit={soumettre} className="flex flex-col gap-4 max-w-sm">
      <label className="block">
        <span className="text-sm font-semibold text-encre">Code ambassadeur</span>
        <input value={code} onChange={(e) => setCode(e.target.value)} required className="champ mt-1" placeholder="••••••••" />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-semibold text-encre">Kilos ramassés</span>
          <input type="number" min={0} step="0.1" value={kg} onChange={(e) => setKg(e.target.value)} className="champ mt-1" placeholder="12" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-encre">Nombre de sacs</span>
          <input type="number" min={0} value={sacs} onChange={(e) => setSacs(e.target.value)} className="champ mt-1" placeholder="3" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-encre">Nombre de participants</span>
        <input type="number" min={0} required value={participants} onChange={(e) => setParticipants(e.target.value)} className="champ mt-1" placeholder="9" />
      </label>

      {erreur && <p className="text-sm font-semibold text-bouee-dark">{erreur}</p>}

      <button
        type="submit"
        disabled={envoi}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-bouee px-6 font-bold text-white disabled:opacity-60"
      >
        {envoi ? "Envoi…" : "Enregistrer le bilan"}
      </button>
      </form>
    </div>
  );
}
