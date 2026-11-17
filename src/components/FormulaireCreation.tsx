"use client";

import { useMemo, useState, type FormEvent } from "react";
import CarteCollectes from "./CarteCollectes";
import { bassesMersDuJour, dateCouverte } from "@/lib/marees";

type Etape = "code" | "formulaire" | "succes";

const ETAPES: { id: Etape; label: string }[] = [
  { id: "code", label: "Code" },
  { id: "formulaire", label: "Infos" },
  { id: "succes", label: "Confirmation" },
];

function Etapes({ actuelle }: { actuelle: Etape }) {
  const index = ETAPES.findIndex((e) => e.id === actuelle);
  return (
    <ol className="mb-6 flex items-center gap-2">
      {ETAPES.map((e, i) => (
        <li key={e.id} className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              i <= index ? "bg-bouee text-white" : "bg-sable-dark text-encre/50"
            }`}
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <span className={`text-sm font-semibold ${i <= index ? "text-encre" : "text-encre/50"}`}>
            {e.label}
          </span>
          {i < ETAPES.length - 1 && <span className="mx-1 h-px w-6 bg-encre/20" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

export default function FormulaireCreation() {
  const [etape, setEtape] = useState<Etape>("code");
  const [code, setCode] = useState("");
  const [erreurCode, setErreurCode] = useState("");

  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [titre, setTitre] = useState("");
  const [lieu, setLieu] = useState("");
  const [commune, setCommune] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [dureeMin, setDureeMin] = useState("120");
  const [places, setPlaces] = useState("20");
  const [organisateur, setOrganisateur] = useState("");
  const [materiel, setMateriel] = useState("Gants et sacs fournis");

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [idCree, setIdCree] = useState<string | null>(null);

  const bassesMers = useMemo(() => (date ? bassesMersDuJour(date) : []), [date]);
  const couverte = useMemo(() => (date ? dateCouverte(date) : true), [date]);

  function validerCode(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setErreurCode("Merci de saisir le code ambassadeur.");
      return;
    }
    setErreurCode("");
    setEtape("formulaire");
  }

  async function soumettreFormulaire(e: FormEvent) {
    e.preventDefault();
    if (!point) {
      setErreur("Touchez la carte pour choisir l'emplacement de la collecte.");
      return;
    }
    setEnvoi(true);
    setErreur("");

    try {
      const reponse = await fetch("/api/collectes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          titre,
          lieu,
          commune,
          lat: point.lat,
          lng: point.lng,
          date,
          heure,
          duree_min: Number(dureeMin),
          places: Number(places),
          organisateur,
          materiel,
        }),
      });
      const data = await reponse.json();

      if (!reponse.ok) {
        if (reponse.status === 403) {
          setEtape("code");
          setErreurCode(data.erreur ?? "Code ambassadeur invalide.");
        } else {
          setErreur(data.erreur ?? "Impossible de créer la collecte.");
        }
        setEnvoi(false);
        return;
      }

      setIdCree(data.collecte.id);
      setEtape("succes");
    } catch {
      setErreur("Connexion impossible. Réessayez.");
      setEnvoi(false);
    }
  }

  if (etape === "code") {
    return (
      <div>
        <Etapes actuelle={etape} />
        <form onSubmit={validerCode} className="max-w-sm">
          <label htmlFor="code" className="text-sm font-semibold text-encre">
            Code ambassadeur
          </label>
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 h-12 w-full rounded-lg border border-encre/20 bg-white px-3 text-base"
            placeholder="••••••••"
          />
          {erreurCode && <p className="mt-2 text-sm font-semibold text-bouee-dark">{erreurCode}</p>}
          <button
            type="submit"
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-rade px-6 font-bold text-sable"
          >
            Continuer
          </button>
          <p className="mt-3 text-xs text-encre/60">
            Réservé aux ambassadeur·rices (ex. Kelig). Demandez le code à l&apos;équipe si vous n&apos;en avez
            pas.
          </p>
        </form>
      </div>
    );
  }

  if (etape === "succes" && idCree) {
    return (
      <div>
        <Etapes actuelle={etape} />
        <div className="rounded-xl border-2 border-algue bg-algue-light p-5">
          <p className="font-display text-lg font-bold text-algue">Collecte créée !</p>
          <p className="mt-1 text-sm text-encre/80">Elle apparaît déjà sur la carte.</p>
          <a href={`/collecte/${idCree}`} className="mt-3 inline-block font-semibold text-golfe underline">
            Voir la page de la collecte
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Etapes actuelle={etape} />
      <form onSubmit={soumettreFormulaire} className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold text-encre">Emplacement — touchez la carte pour le choisir</p>
        <div className="mt-2 overflow-hidden rounded-xl border border-encre/15">
          <CarteCollectes collectes={[]} pointSelectionne={point} onClicCarte={(lat, lng) => setPoint({ lat, lng })} hauteurClasse="h-64" />
        </div>
        {point && (
          <p className="mt-1 text-xs text-encre/60">
            Point choisi : {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
          </p>
        )}
      </div>

      <Champ label="Titre de la collecte">
        <input required value={titre} onChange={(e) => setTitre(e.target.value)} className="champ" placeholder="Nettoyage de la grève" />
      </Champ>

      <div className="grid grid-cols-2 gap-3">
        <Champ label="Nom du lieu">
          <input required value={lieu} onChange={(e) => setLieu(e.target.value)} className="champ" placeholder="Plage du Minou" />
        </Champ>
        <Champ label="Commune">
          <input required value={commune} onChange={(e) => setCommune(e.target.value)} className="champ" placeholder="Plouzané" />
        </Champ>
      </div>

      <div>
        <Champ label="Date">
          <input required type="date" value={date} onChange={(e) => { setDate(e.target.value); setHeure(""); }} className="champ" />
        </Champ>

        {date && (
          <div className="mt-2">
            {!couverte ? (
              <p className="text-xs text-encre/60">
                Pas de donnée de marée locale pour cette date — vérifiez maree.shom.fr pour choisir l&apos;heure.
              </p>
            ) : bassesMers.length > 0 ? (
              <>
                <p className="text-xs font-semibold text-encre/70">Créneaux de basse mer ce jour-là (cliquez pour remplir l&apos;heure) :</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {bassesMers.map((bm) => {
                    const h = bm.heure.slice(11, 16);
                    return (
                      <button
                        key={bm.heure}
                        type="button"
                        onClick={() => setHeure(h)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                          heure === h ? "border-bouee bg-bouee text-white" : "border-golfe/40 text-golfe"
                        }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-xs text-encre/60">Aucune basse mer trouvée ce jour dans le fichier local.</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Champ label="Heure de début">
          <input required type="time" value={heure} onChange={(e) => setHeure(e.target.value)} className="champ" />
        </Champ>
        <Champ label="Durée (min)">
          <input required type="number" min={15} step={15} value={dureeMin} onChange={(e) => setDureeMin(e.target.value)} className="champ" />
        </Champ>
        <Champ label="Places">
          <input required type="number" min={1} value={places} onChange={(e) => setPlaces(e.target.value)} className="champ" />
        </Champ>
      </div>

      <Champ label="Organisateur·rice">
        <input required value={organisateur} onChange={(e) => setOrganisateur(e.target.value)} className="champ" placeholder="Kelig Ar Floc'h" />
      </Champ>

      <Champ label="Matériel à apporter">
        <input value={materiel} onChange={(e) => setMateriel(e.target.value)} className="champ" />
      </Champ>

      {erreur && <p className="text-sm font-semibold text-bouee-dark">{erreur}</p>}

      <button
        type="submit"
        disabled={envoi}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-bouee px-6 font-bold text-white disabled:opacity-60"
      >
        {envoi ? "Création…" : "Créer la collecte"}
      </button>
      </form>
    </div>
  );
}

function Champ({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-encre">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
