#!/usr/bin/env node
/**
 * Génère data/marees.json (US-12) : pleines et basses mers de la rade de Brest.
 *
 * L'API Open-Meteo Marine ne prévoit que ~10 jours, mais donne ~3 mois
 * d'historique horaire. On ajuste donc sur cet historique un modèle
 * harmonique classique (somme de sinusoïdes aux fréquences astronomiques
 * M2, S2, N2, K1, O1…, moindres carrés), on le valide sur les derniers
 * jours qu'il n'a pas vus, puis on le prolonge jusqu'à fin janvier.
 * L'application lit ensuite ce fichier SANS appel réseau.
 *
 * Usage : node scripts/marees.mjs
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LATITUDE = 48.38;
const LONGITUDE = -4.49;
const DEBUT = "2026-10-01";
const FIN = "2027-01-31";
const JOURS_VALIDATION = 20;

// Vitesses angulaires (degrés / heure). Composantes séparables avec ~100 jours
// de données (critère de Rayleigh) ; K2 et P1, trop proches de S2 et K1, sont
// absorbées par celles-ci.
const COMPOSANTES = {
  M2: 28.9841042, S2: 30.0, N2: 28.4397295, "2N2": 27.8953548, L2: 29.5284789,
  K1: 15.0410686, O1: 13.9430356, Q1: 13.3986609,
  M3: 43.4761563, M4: 57.9682084, MS4: 58.9841042, MN4: 57.4238337,
  M6: 86.9523127, "2MS6": 87.9682084, M8: 115.9364166,
};
const VITESSES = Object.values(COMPOSANTES).map((v) => (v * Math.PI) / 180); // rad/h

async function recupererHauteurs() {
  const url =
    "https://marine-api.open-meteo.com/v1/marine" +
    `?latitude=${LATITUDE}&longitude=${LONGITUDE}` +
    "&hourly=sea_level_height_msl&timezone=GMT&past_days=92&forecast_days=16";
  const reponse = await fetch(url);
  if (!reponse.ok) throw new Error(`Open-Meteo a répondu ${reponse.status}`);
  const { hourly } = await reponse.json();
  return hourly.time
    .map((t, i) => ({ t: Date.parse(t + "Z"), h: hourly.sea_level_height_msl[i] }))
    .filter((p) => p.h !== null);
}

const T0 = Date.parse("2026-01-01T00:00Z");
const heures = (ms) => (ms - T0) / 3_600_000;

function base(ms) {
  const t = heures(ms);
  const ligne = [1];
  for (const w of VITESSES) ligne.push(Math.cos(w * t), Math.sin(w * t));
  return ligne;
}

// Moindres carrés par équations normales + élimination de Gauss.
function ajuster(points) {
  const n = 1 + 2 * VITESSES.length;
  const A = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  for (const { t, h } of points) {
    const x = base(t);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) A[i][j] += x[i] * x[j];
      A[i][n] += x[i] * h;
    }
  }
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k];
    }
  }
  return A.map((ligne, i) => ligne[n] / ligne[i]);
}

const hauteur = (coef, ms) => base(ms).reduce((s, x, i) => s + x * coef[i], 0);

// Extrema à la minute près, entre deux instants (ms).
function extrema(coef, debutMs, finMs) {
  const pas = 60_000;
  const sortie = [];
  let precedent = hauteur(coef, debutMs);
  let courant = hauteur(coef, debutMs + pas);
  for (let ms = debutMs + pas; ms < finMs; ms += pas) {
    const suivant = hauteur(coef, ms + pas);
    if (courant > precedent && courant >= suivant) sortie.push({ ms, type: "pleine_mer", h: courant });
    if (courant < precedent && courant <= suivant) sortie.push({ ms, type: "basse_mer", h: courant });
    precedent = courant;
    courant = suivant;
  }
  return sortie;
}

const formatParis = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});
const heureParis = (ms) => formatParis.format(new Date(ms)).replace(" ", "T");

// Extrema « observés » : sommet de la parabole passant par 3 points horaires.
function extremaObserves(points) {
  const sortie = [];
  for (let i = 1; i < points.length - 1; i++) {
    const [a, b, c] = [points[i - 1].h, points[i].h, points[i + 1].h];
    if ((b > a && b >= c) || (b < a && b <= c)) {
      const d = (a - c) / (2 * (a - 2 * b + c));
      sortie.push({ ms: points[i].t + d * 3_600_000, type: b > a ? "pleine_mer" : "basse_mer" });
    }
  }
  return sortie;
}

async function main() {
  const points = await recupererHauteurs();
  const coupure = points.at(-1).t - JOURS_VALIDATION * 86_400_000;

  // Validation : ajustement sans les 20 derniers jours, comparaison sur ceux-ci.
  const coefTest = ajuster(points.filter((p) => p.t < coupure));
  const test = points.filter((p) => p.t >= coupure);
  const rmse = Math.sqrt(test.reduce((s, p) => s + (hauteur(coefTest, p.t) - p.h) ** 2, 0) / test.length);
  const predits = extrema(coefTest, coupure, points.at(-1).t).filter((e) => e.type === "basse_mer");
  const ecarts = extremaObserves(test)
    .filter((e) => e.type === "basse_mer")
    .map((o) => Math.min(...predits.map((p) => Math.abs(p.ms - o.ms))) / 60_000)
    .sort((a, b) => a - b);
  const ecartMedian = Math.round(ecarts[Math.floor(ecarts.length / 2)]);
  const ecartMax = Math.round(ecarts.at(-1));

  const coef = ajuster(points);
  const evenements = extrema(coef, Date.parse(DEBUT + "T00:00Z") - 7_200_000, Date.parse(FIN + "T23:59Z")).map(
    (e) => ({ heure: heureParis(e.ms), type: e.type, hauteur_m: Math.round(e.h * 100) / 100 }),
  ).filter((e) => e.heure >= DEBUT && e.heure <= FIN + "T23:59");

  const sortie = {
    source:
      "Prédiction harmonique ajustée sur les hauteurs d'eau horaires Open-Meteo Marine (marine-api.open-meteo.com) en rade de Brest.",
    licence: "Données d'origine Open-Meteo sous CC BY 4.0 — https://open-meteo.com/en/license",
    avertissement:
      "Horaires approximatifs (projet étudiant). Avant toute collecte, vérifiez les horaires officiels sur maree.shom.fr.",
    point_reference: { latitude: LATITUDE, longitude: LONGITUDE, lieu: "Rade de Brest" },
    fuseau: "Europe/Paris",
    genere_le: new Date().toISOString(),
    methode: {
      donnees_ajustement: { debut: heureParis(points[0].t), fin: heureParis(points.at(-1).t), points: points.length },
      composantes: Object.keys(COMPOSANTES),
      validation: {
        jours_non_vus: JOURS_VALIDATION,
        rmse_hauteur_m: Math.round(rmse * 100) / 100,
        ecart_basse_mer_median_min: ecartMedian,
        ecart_basse_mer_max_min: ecartMax,
      },
    },
    plage_obtenue: { debut: DEBUT + "T00:00", fin: FIN + "T23:59" },
    nombre_basses_mers: evenements.filter((e) => e.type === "basse_mer").length,
    nombre_pleines_mers: evenements.filter((e) => e.type === "pleine_mer").length,
    evenements,
  };

  writeFileSync(path.join(__dirname, "..", "data", "marees.json"), JSON.stringify(sortie, null, 2) + "\n");
  console.log(`Ajustement sur ${points.length} h. Validation ${JOURS_VALIDATION} j : RMSE ${sortie.methode.validation.rmse_hauteur_m} m, écart basse mer médian ${ecartMedian} min, max ${ecartMax} min.`);
  console.log(`${evenements.length} extrema écrits (${DEBUT} → ${FIN}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
