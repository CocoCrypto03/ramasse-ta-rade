// Lecture des horaires de marée depuis le fichier local data/marees.json
// (généré une fois par scripts/marees.mjs). AUCUN appel réseau ici : c'est
// le but de l'US-12.

import donnees from "../../data/marees.json";
import { dateParisISO, versHorlogeMuraleParis } from "./temps";

export interface EvenementMaree {
  heure: string; // "YYYY-MM-DDTHH:mm", heure locale de Paris (naïve)
  type: "pleine_mer" | "basse_mer";
  hauteur_m: number;
}

interface DonneesMarees {
  source: string;
  licence: string;
  avertissement: string;
  genere_le: string;
  plage_obtenue: { debut: string; fin: string };
  evenements: EvenementMaree[];
}

const DONNEES = donnees as DonneesMarees;

export function sourceMarees() {
  return {
    source: DONNEES.source,
    licence: DONNEES.licence,
    avertissement: DONNEES.avertissement,
    genereLe: DONNEES.genere_le,
  };
}

/** true si le fichier local couvre la date demandée (YYYY-MM-DD, Europe/Paris). */
export function dateCouverte(dateISOJour: string): boolean {
  const debut = DONNEES.plage_obtenue.debut.slice(0, 10);
  const fin = DONNEES.plage_obtenue.fin.slice(0, 10);
  return dateISOJour >= debut && dateISOJour <= fin;
}

/** Événements de marée (pleines et basses mers) d'une date donnée. */
export function evenementsDuJour(dateISOJour: string): EvenementMaree[] {
  return DONNEES.evenements.filter((e) => e.heure.startsWith(dateISOJour));
}

/** Seulement les basses mers d'une date donnée, triées par heure. */
export function bassesMersDuJour(dateISOJour: string): EvenementMaree[] {
  return evenementsDuJour(dateISOJour)
    .filter((e) => e.type === "basse_mer")
    .sort((a, b) => a.heure.localeCompare(b.heure));
}

export type StatutMaree = "calee" | "attention" | "inconnue";

export interface InfoMareeCollecte {
  statut: StatutMaree;
  bassesMers: EvenementMaree[];
  dateCouverte: boolean;
}

/**
 * Calcule, pour une collecte dont le début est `debutISO` (instant UTC),
 * si elle est calée sur la marée basse : fenêtre basse mer -2h / +1h.
 */
export function infoMareeCollecte(debutISO: string): InfoMareeCollecte {
  const jour = dateParisISO(debutISO);
  const couverte = dateCouverte(jour);
  const bassesMers = bassesMersDuJour(jour);

  if (!couverte || bassesMers.length === 0) {
    return { statut: "inconnue", bassesMers, dateCouverte: couverte };
  }

  const debutMural = versHorlogeMuraleParis(debutISO).getTime();

  const dansLaFenetre = bassesMers.some((bm) => {
    const bmMural = new Date(bm.heure + ":00Z").getTime();
    const diffMinutes = (debutMural - bmMural) / 60_000;
    // Fenêtre : de 2h avant la basse mer à 1h après.
    return diffMinutes >= -120 && diffMinutes <= 60;
  });

  return {
    statut: dansLaFenetre ? "calee" : "attention",
    bassesMers,
    dateCouverte: couverte,
  };
}
