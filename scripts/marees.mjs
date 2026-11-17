#!/usr/bin/env node
/**
 * Génère data/marees.json à partir de l'API Open-Meteo Marine.
 *
 * Interroge UNE SEULE FOIS, à la génération, la hauteur d'eau horaire
 * (sea_level_height_msl) au point le plus proche de la rade de Brest, puis
 * détecte les extrema locaux (pleines mers / basses mers) par simple
 * comparaison avec les heures voisines. Le fichier produit est ensuite lu
 * par l'application SANS AUCUN appel réseau à l'exécution (US-12).
 *
 * Usage : node scripts/marees.mjs
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Point de référence : rade de Brest (large de Sainte-Anne-du-Portzic).
const LATITUDE = 48.38;
const LONGITUDE = -4.49;

// Fenêtre souhaitée par le cahier des charges. L'API Open-Meteo Marine ne
// fournit des prévisions que sur un horizon limité (~2 semaines après la
// date du jour) ; on demande la fenêtre complète et on note ce qui a
// effectivement été renvoyé.
const START_DATE_SOUHAITE = "2026-10-01";
const END_DATE_SOUHAITEE = "2027-01-31";

async function recupererHauteurs(startDate, endDate) {
  const url =
    `https://marine-api.open-meteo.com/v1/marine` +
    `?latitude=${LATITUDE}&longitude=${LONGITUDE}` +
    `&hourly=sea_level_height_msl` +
    `&timezone=Europe%2FParis` +
    `&start_date=${startDate}&end_date=${endDate}`;

  const reponse = await fetch(url);
  const json = await reponse.json();

  if (json.error) {
    // La plage demandée dépasse l'horizon de prévision : on réduit et on
    // réessaie avec la plage maximale autorisée indiquée dans le message.
    const match = /to (\d{4}-\d{2}-\d{2})/.exec(json.reason ?? "");
    if (match) {
      const dateMax = match[1];
      if (dateMax !== endDate) {
        console.log(
          `Plage demandée réduite : l'API n'autorise que jusqu'au ${dateMax}.`,
        );
        return recupererHauteurs(startDate, dateMax);
      }
    }
    throw new Error("Échec de l'appel Open-Meteo Marine : " + json.reason);
  }

  return json;
}

// Détecte les extrema locaux (pleine mer = maximum, basse mer = minimum)
// dans une série horaire en comparant chaque point à ses voisins directs.
function detecterExtrema(temps, hauteurs) {
  const evenements = [];

  for (let i = 1; i < hauteurs.length - 1; i++) {
    const avant = hauteurs[i - 1];
    const courant = hauteurs[i];
    const apres = hauteurs[i + 1];

    if (courant === null || avant === null || apres === null) continue;

    const estMaximum = courant >= avant && courant >= apres && courant > avant;
    const estMinimum = courant <= avant && courant <= apres && courant < avant;

    if (estMaximum || estMinimum) {
      // Évite de compter deux fois un plateau (deux heures égales de suite)
      const dernier = evenements[evenements.length - 1];
      if (dernier && dernier.type === (estMaximum ? "pleine_mer" : "basse_mer")) {
        // Garde l'extremum le plus marqué du plateau
        if (
          (estMaximum && courant > dernier.hauteur_m) ||
          (estMinimum && courant < dernier.hauteur_m)
        ) {
          evenements[evenements.length - 1] = {
            heure: temps[i],
            type: estMaximum ? "pleine_mer" : "basse_mer",
            hauteur_m: courant,
          };
        }
        continue;
      }

      evenements.push({
        heure: temps[i],
        type: estMaximum ? "pleine_mer" : "basse_mer",
        hauteur_m: courant,
      });
    }
  }

  return evenements;
}

async function main() {
  console.log(
    `Appel Open-Meteo Marine (${START_DATE_SOUHAITE} → ${END_DATE_SOUHAITEE}) pour le point ${LATITUDE},${LONGITUDE}...`,
  );

  const json = await recupererHauteurs(START_DATE_SOUHAITE, END_DATE_SOUHAITEE);

  const temps = json.hourly.time;
  const hauteurs = json.hourly.sea_level_height_msl;
  const dateDebutReelle = temps[0];
  // L'API renvoie des dates jusqu'à la fin de la plage autorisée, mais les
  // valeurs au-delà de l'horizon de prévision réel (quelques jours) sont
  // `null`. On ne garde comme "couverture réelle" que la dernière heure où
  // une valeur exploitable existe.
  let dernierIndexValide = hauteurs.length - 1;
  while (dernierIndexValide >= 0 && hauteurs[dernierIndexValide] === null) {
    dernierIndexValide--;
  }
  const dateFinReelle = temps[dernierIndexValide];

  const evenements = detecterExtrema(temps, hauteurs);
  const basses = evenements.filter((e) => e.type === "basse_mer").length;
  const pleines = evenements.filter((e) => e.type === "pleine_mer").length;

  const couvertureComplete =
    dateDebutReelle.slice(0, 10) === START_DATE_SOUHAITE &&
    dateFinReelle.slice(0, 10) >= END_DATE_SOUHAITEE.slice(0, 8);

  const sortie = {
    source: "Open-Meteo Marine API (marine-api.open-meteo.com), modèle météo-marin basé sur les données de marée astronomique.",
    licence: "CC BY 4.0 — https://open-meteo.com/en/license",
    avertissement:
      "Données approximatives à but pédagogique (projet étudiant). Avant toute collecte, vérifiez les horaires officiels sur maree.shom.fr.",
    point_reference: { latitude: LATITUDE, longitude: LONGITUDE, lieu: "Rade de Brest" },
    fuseau: "Europe/Paris",
    genere_le: new Date().toISOString(),
    plage_demandee: { debut: START_DATE_SOUHAITE, fin: END_DATE_SOUHAITEE },
    plage_obtenue: { debut: dateDebutReelle, fin: dateFinReelle },
    couverture_complete: couvertureComplete,
    note_couverture: couvertureComplete
      ? "La plage obtenue couvre entièrement la plage demandée."
      : `L'API Open-Meteo Marine ne fournit des hauteurs d'eau exploitables (prévision réelle, pas null) que du ${dateDebutReelle} au ${dateFinReelle}, bien que la plage demandée soit ${START_DATE_SOUHAITE} → ${END_DATE_SOUHAITEE}. Au-delà de ${dateFinReelle}, l'application affiche "donnée de marée indisponible pour cette date, vérifiez maree.shom.fr".`,
    nombre_basses_mers: basses,
    nombre_pleines_mers: pleines,
    evenements,
  };

  const chemin = path.join(__dirname, "..", "data", "marees.json");
  writeFileSync(chemin, JSON.stringify(sortie, null, 2) + "\n", "utf-8");

  console.log(
    `OK : ${evenements.length} extrema détectés (${basses} basses mers, ${pleines} pleines mers).`,
  );
  console.log(`Écrit dans ${chemin}`);
  if (!couvertureComplete) {
    console.log("Attention : " + sortie.note_couverture);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
