// Paramètres RGPD partagés entre le serveur (purge) et l'affichage
// (formulaire d'inscription, page /confidentialite). Pas de dépendance
// Node ici : ce module peut être importé depuis un composant client.

/** Les inscriptions sont supprimées ce nombre de jours après la date de la collecte. */
export const DUREE_CONSERVATION_JOURS = 30;

/** Date limite : une collecte qui a commencé avant cet instant voit ses inscriptions purgées. */
export function limiteConservation(maintenant: Date = new Date()): Date {
  return new Date(maintenant.getTime() - DUREE_CONSERVATION_JOURS * 24 * 60 * 60 * 1000);
}
