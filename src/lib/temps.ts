// Utilitaires de date/heure, toujours en fuseau Europe/Paris pour
// l'affichage, quel que soit le fuseau du serveur qui exécute Next.js.

const FUSEAU = "Europe/Paris";

/**
 * Convertit une date + heure locales (saisies dans le formulaire, en heure
 * de Paris) en instant UTC précis (ISO 8601), en tenant compte de l'heure
 * d'été / d'hiver.
 */
export function localParisVersISO(dateStr: string, heureStr: string): string {
  const [annee, mois, jour] = dateStr.split("-").map(Number);
  const [heure, minute] = heureStr.split(":").map(Number);

  // Première estimation : on traite les composants locaux comme s'ils
  // étaient déjà en UTC, puis on corrige avec le décalage réel de Paris.
  const estimation = new Date(Date.UTC(annee, mois - 1, jour, heure, minute, 0));
  const decalageMinutes = decalageParisEnMinutes(estimation);
  return new Date(estimation.getTime() - decalageMinutes * 60_000).toISOString();
}

// Décalage (en minutes, par rapport à UTC) de Paris à un instant donné.
function decalageParisEnMinutes(date: Date): number {
  const parts = partsEnZone(date, FUSEAU);
  const commeUTC = Date.UTC(
    parts.annee,
    parts.mois - 1,
    parts.jour,
    parts.heure,
    parts.minute,
    parts.seconde,
  );
  return Math.round((commeUTC - date.getTime()) / 60_000);
}

interface PartsDate {
  annee: number;
  mois: number;
  jour: number;
  heure: number;
  minute: number;
  seconde: number;
}

function partsEnZone(date: Date, fuseau: string): PartsDate {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: fuseau,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const valeurs: Record<string, string> = {};
  for (const p of dtf.formatToParts(date)) {
    if (p.type !== "literal") valeurs[p.type] = p.value;
  }
  return {
    annee: Number(valeurs.year),
    mois: Number(valeurs.month),
    jour: Number(valeurs.day),
    heure: Number(valeurs.hour),
    minute: Number(valeurs.minute),
    seconde: Number(valeurs.second),
  };
}

/**
 * Transforme un instant ISO en « horloge murale » de Paris, représentée
 * comme un Date en UTC portant les mêmes chiffres (pratique pour comparer
 * deux heures locales entre elles sans se soucier du fuseau réel).
 */
export function versHorlogeMuraleParis(iso: string): Date {
  const p = partsEnZone(new Date(iso), FUSEAU);
  return new Date(Date.UTC(p.annee, p.mois - 1, p.jour, p.heure, p.minute, p.seconde));
}

/** Date au format "YYYY-MM-DD" en heure de Paris. */
export function dateParisISO(iso: string): string {
  const p = partsEnZone(new Date(iso), FUSEAU);
  return `${p.annee}-${String(p.mois).padStart(2, "0")}-${String(p.jour).padStart(2, "0")}`;
}

const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function formatDateLongueFr(iso: string): string {
  const d = new Date(iso);
  const jourSemaine = new Intl.DateTimeFormat("fr-FR", { timeZone: FUSEAU, weekday: "long" }).format(d);
  const p = partsEnZone(d, FUSEAU);
  return `${jourSemaine} ${p.jour} ${MOIS[p.mois - 1]} ${p.annee}`;
}

export function formatHeureFr(iso: string): string {
  const p = partsEnZone(new Date(iso), FUSEAU);
  return `${String(p.heure).padStart(2, "0")}h${String(p.minute).padStart(2, "0")}`;
}

export function formatDateCourteFr(iso: string): string {
  const p = partsEnZone(new Date(iso), FUSEAU);
  return `${String(p.jour).padStart(2, "0")}/${String(p.mois).padStart(2, "0")}/${p.annee}`;
}

export { JOURS };
