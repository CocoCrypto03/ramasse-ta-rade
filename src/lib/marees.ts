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

function decalerJourISO(dateISOJour: string, deltaJours: number): string {
  const d = new Date(`${dateISOJour}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + deltaJours);
  return d.toISOString().slice(0, 10);
}

/** Écart en jours entre deux dates "YYYY-MM-DD" (a - b). */
function diffEnJours(a: string, b: string): number {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86_400_000);
}

export interface PointCourbeMaree {
  /** Heure décimale depuis 0h du jour de référence (peut être négative ou > 24, pour interpoler aux bords). */
  heureDecimale: number;
  hauteur_m: number;
  type: EvenementMaree["type"];
}

/**
 * Extrema de hauteur d'eau (pleines et basses mers) utiles pour tracer la
 * courbe du jour, en incluant la toute fin de la veille et le tout début du
 * lendemain : nécessaire pour interpoler proprement en cosinus jusqu'aux
 * bords 0h et 24h de la journée affichée.
 */
export function extremaPourCourbe(dateISOJour: string): PointCourbeMaree[] {
  const jours = [decalerJourISO(dateISOJour, -1), dateISOJour, decalerJourISO(dateISOJour, 1)];
  return jours
    .flatMap((j) => evenementsDuJour(j))
    .map((e) => {
      const jourEvt = e.heure.slice(0, 10);
      const [h, m] = e.heure.slice(11, 16).split(":").map(Number);
      const heureDecimale = diffEnJours(jourEvt, dateISOJour) * 24 + h + m / 60;
      return { heureDecimale, hauteur_m: e.hauteur_m, type: e.type };
    })
    .filter((p) => p.heureDecimale >= -6 && p.heureDecimale <= 30)
    .sort((a, b) => a.heureDecimale - b.heureDecimale);
}

// "calee" : collecte dans la fenêtre basse mer -2h / +1h.
// "trop_tot" : collecte commencée plus de 2h avant la basse mer la plus
//              proche (la mer n'est pas encore basse).
// "attention" : collecte commencée plus d'1h après la basse mer la plus
//               proche (la mer est déjà en train de remonter).
// "inconnue" : pas de donnée de marée locale pour cette date.
export type StatutMaree = "calee" | "trop_tot" | "attention" | "inconnue";

export interface InfoMareeCollecte {
  statut: StatutMaree;
  bassesMers: EvenementMaree[];
  /** Écart en minutes entre le début de la collecte et la basse mer la plus proche (négatif = avant). */
  ecartMinutes: number | null;
  /** Basse mer la plus proche du début de la collecte. */
  basseMerLaPlusProche: EvenementMaree | null;
  dateCouverte: boolean;
}

/**
 * Calcule, pour une collecte dont le début est `debutISO` (instant UTC),
 * sa position par rapport à la basse mer la plus proche : fenêtre de
 * référence basse mer -2h / +1h (US-12).
 */
export function infoMareeCollecte(debutISO: string): InfoMareeCollecte {
  const jour = dateParisISO(debutISO);
  const couverte = dateCouverte(jour);
  const bassesMers = bassesMersDuJour(jour);

  if (!couverte || bassesMers.length === 0) {
    return {
      statut: "inconnue",
      bassesMers,
      ecartMinutes: null,
      basseMerLaPlusProche: null,
      dateCouverte: couverte,
    };
  }

  const debutMural = versHorlogeMuraleParis(debutISO).getTime();

  // On compare à la basse mer la plus proche du début de la collecte (il
  // peut y en avoir deux dans la journée).
  let plusProche = bassesMers[0];
  let ecart = (debutMural - new Date(plusProche.heure + ":00Z").getTime()) / 60_000;
  for (const bm of bassesMers.slice(1)) {
    const diff = (debutMural - new Date(bm.heure + ":00Z").getTime()) / 60_000;
    if (Math.abs(diff) < Math.abs(ecart)) {
      plusProche = bm;
      ecart = diff;
    }
  }

  // Fenêtre de référence : de 2h avant la basse mer à 1h après.
  let statut: StatutMaree;
  if (ecart < -120) {
    statut = "trop_tot";
  } else if (ecart > 60) {
    statut = "attention";
  } else {
    statut = "calee";
  }

  return {
    statut,
    bassesMers,
    ecartMinutes: ecart,
    basseMerLaPlusProche: plusProche,
    dateCouverte: couverte,
  };
}
