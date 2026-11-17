// Données de démonstration (US de la story T-02 du TD). Utilisées par le
// stockage en mémoire (lib/db.ts) quand Supabase n'est pas configuré, et
// par supabase/seed.sql pour peupler une vraie base.
//
// Lieux vérifiés sur le littoral de la rade de Brest (coordonnées relevées
// via OpenStreetMap / Nominatim).

import type { Collecte, Inscription, Bilan } from "./types";

export const COLLECTES_DEMO: Collecte[] = [
  {
    id: "c1",
    titre: "Grand nettoyage de la plage du Moulin Blanc",
    lieu: "Plage du Moulin Blanc",
    commune: "Brest",
    lat: 48.3966071,
    lng: -4.4331847,
    debut: "2026-11-21T06:00:00.000Z", // 21/11/2026 07h00 Europe/Paris
    duree_min: 150,
    places: 20,
    organisateur: "Kelig Ar Floc'h",
    materiel: "Gants et sacs fournis, bottes conseillées",
    statut: "a_venir",
    created_at: "2026-09-15T10:00:00.000Z",
  },
  {
    id: "c2",
    titre: "Collecte à Sainte-Anne-du-Portzic",
    lieu: "Plage de Sainte-Anne-du-Portzic",
    commune: "Plouzané",
    lat: 48.361632,
    lng: -4.5537712,
    debut: "2026-11-22T07:00:00.000Z", // 22/11/2026 08h00
    duree_min: 120,
    places: 15,
    organisateur: "Enora Le Bris",
    materiel: "Gants, sacs, une pince si vous en avez",
    statut: "a_venir",
    created_at: "2026-09-16T10:00:00.000Z",
  },
  {
    id: "c3",
    titre: "Ramassage au Dellec",
    lieu: "Le Dellec",
    commune: "Plouzané",
    lat: 48.3529708,
    lng: -4.5718008,
    debut: "2026-11-23T08:00:00.000Z", // 23/11/2026 09h00
    duree_min: 120,
    places: 25,
    organisateur: "Kelig Ar Floc'h",
    materiel: "Gants et bottes, sacs fournis",
    statut: "a_venir",
    created_at: "2026-09-17T10:00:00.000Z",
  },
  {
    id: "c4",
    titre: "Collecte à l'Auberlac'h",
    lieu: "L'Auberlac'h",
    commune: "Plougastel-Daoulas",
    lat: 48.3382523,
    lng: -4.4144926,
    debut: "2026-11-24T09:00:00.000Z", // 24/11/2026 10h00
    duree_min: 90,
    places: 12,
    organisateur: "Yann Quéméner",
    materiel: "Gants, sac personnel si possible",
    statut: "a_venir",
    created_at: "2026-09-18T10:00:00.000Z",
  },
  {
    id: "c5",
    titre: "Nettoyage du port de commerce",
    lieu: "Port de commerce (Le Polder)",
    commune: "Brest",
    lat: 48.385355,
    lng: -4.4766421,
    debut: "2026-12-18T14:30:00.000Z", // 18/12/2026 15h30
    duree_min: 120,
    places: 18,
    organisateur: "Kelig Ar Floc'h",
    materiel: "Gants, chasuble si vous en avez",
    statut: "a_venir",
    created_at: "2026-09-19T10:00:00.000Z",
  },
  {
    id: "c6",
    titre: "Collecte du Passage",
    lieu: "Le Passage",
    commune: "Le Relecq-Kerhuon",
    lat: 48.3960965,
    lng: -4.3816047,
    debut: "2026-10-10T07:30:00.000Z", // 10/10/2026 09h30 (CEST) — basse mer à 11h02
    duree_min: 120,
    places: 20,
    organisateur: "Kelig Ar Floc'h",
    materiel: "Gants et sacs fournis",
    statut: "terminee",
    created_at: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "c7",
    titre: "Grand nettoyage de la plage du Minou",
    lieu: "Plage du Minou",
    commune: "Plouzané",
    lat: 48.3394703,
    lng: -4.6157574,
    debut: "2026-11-07T09:00:00.000Z", // 07/11/2026 10h00 (CET)
    duree_min: 150,
    places: 20,
    organisateur: "Enora Le Bris",
    materiel: "Gants, sacs, bottes conseillées",
    statut: "terminee",
    created_at: "2026-09-10T10:00:00.000Z",
  },
];

export const INSCRIPTIONS_DEMO: Omit<Inscription, "consentement_at">[] = [
  // c1 — Moulin Blanc (20 places, 6 inscrits)
  { id: "i1", collecte_id: "c1", prenom: "Kaïna", email: "kaina.etudiante@example.fr", created_at: "2026-09-20T08:00:00.000Z" },
  { id: "i2", collecte_id: "c1", prenom: "Loïc", email: "loic.m@example.fr", created_at: "2026-09-20T09:00:00.000Z" },
  { id: "i3", collecte_id: "c1", prenom: "Maëlys", email: "maelys.k@example.fr", created_at: "2026-09-21T10:00:00.000Z" },
  { id: "i4", collecte_id: "c1", prenom: "Tangi", email: "tangi.b@example.fr", created_at: "2026-09-21T11:00:00.000Z" },
  { id: "i5", collecte_id: "c1", prenom: "Anaïs", email: "anais.d@example.fr", created_at: "2026-09-22T12:00:00.000Z" },
  { id: "i6", collecte_id: "c1", prenom: "Youenn", email: "youenn.l@example.fr", created_at: "2026-09-22T13:00:00.000Z" },

  // c2 — Sainte-Anne-du-Portzic (15 places, COMPLET -> teste le refus d'inscription)
  { id: "i7", collecte_id: "c2", prenom: "Camille", email: "camille.r@example.fr", created_at: "2026-09-23T08:00:00.000Z" },
  { id: "i8", collecte_id: "c2", prenom: "Erwan", email: "erwan.g@example.fr", created_at: "2026-09-23T09:00:00.000Z" },
  { id: "i9", collecte_id: "c2", prenom: "Gwenn", email: "gwenn.p@example.fr", created_at: "2026-09-23T10:00:00.000Z" },
  { id: "i10", collecte_id: "c2", prenom: "Soazig", email: "soazig.h@example.fr", created_at: "2026-09-23T11:00:00.000Z" },
  { id: "i11", collecte_id: "c2", prenom: "Ewen", email: "ewen.t@example.fr", created_at: "2026-09-24T08:00:00.000Z" },
  { id: "i12", collecte_id: "c2", prenom: "Perrine", email: "perrine.v@example.fr", created_at: "2026-09-24T09:00:00.000Z" },
  { id: "i13", collecte_id: "c2", prenom: "Mathéo", email: "matheo.n@example.fr", created_at: "2026-09-24T10:00:00.000Z" },
  { id: "i14", collecte_id: "c2", prenom: "Lou", email: "lou.f@example.fr", created_at: "2026-09-24T11:00:00.000Z" },
  { id: "i15", collecte_id: "c2", prenom: "Ronan", email: "ronan.c@example.fr", created_at: "2026-09-25T08:00:00.000Z" },
  { id: "i16", collecte_id: "c2", prenom: "Awen", email: "awen.s@example.fr", created_at: "2026-09-25T09:00:00.000Z" },
  { id: "i17", collecte_id: "c2", prenom: "Lilou", email: "lilou.j@example.fr", created_at: "2026-09-25T10:00:00.000Z" },
  { id: "i18", collecte_id: "c2", prenom: "Jade", email: "jade.m@example.fr", created_at: "2026-09-25T11:00:00.000Z" },
  { id: "i19", collecte_id: "c2", prenom: "Noa", email: "noa.d@example.fr", created_at: "2026-09-26T08:00:00.000Z" },
  { id: "i20", collecte_id: "c2", prenom: "Ambre", email: "ambre.q@example.fr", created_at: "2026-09-26T09:00:00.000Z" },
  { id: "i21", collecte_id: "c2", prenom: "Gurvan", email: "gurvan.a@example.fr", created_at: "2026-09-26T10:00:00.000Z" },

  // c3 — Le Dellec (25 places, 3 inscrits)
  { id: "i22", collecte_id: "c3", prenom: "Ilan", email: "ilan.r@example.fr", created_at: "2026-09-27T08:00:00.000Z" },
  { id: "i23", collecte_id: "c3", prenom: "Nolwenn", email: "nolwenn.b@example.fr", created_at: "2026-09-27T09:00:00.000Z" },
  { id: "i24", collecte_id: "c3", prenom: "Corentin", email: "corentin.g@example.fr", created_at: "2026-09-27T10:00:00.000Z" },

  // c4 — L'Auberlac'h (12 places, 0 inscrit)

  // c5 — Port de commerce (18 places, 2 inscrits)
  { id: "i25", collecte_id: "c5", prenom: "Jean", email: "jean.po@example.fr", created_at: "2026-09-28T08:00:00.000Z" },
  { id: "i26", collecte_id: "c5", prenom: "Gaspard", email: "gaspard.l@example.fr", created_at: "2026-09-28T09:00:00.000Z" },

  // c6 — Le Passage (terminée, bilan b1, 9 participants)
  { id: "i27", collecte_id: "c6", prenom: "Gwenn", email: "gwenn.a@example.fr", created_at: "2026-10-01T08:00:00.000Z" },
  { id: "i28", collecte_id: "c6", prenom: "Loïc", email: "loic.p@example.fr", created_at: "2026-10-01T09:00:00.000Z" },
  { id: "i29", collecte_id: "c6", prenom: "Maëlys", email: "maelys.r@example.fr", created_at: "2026-10-02T08:00:00.000Z" },
  { id: "i30", collecte_id: "c6", prenom: "Tangi", email: "tangi.v@example.fr", created_at: "2026-10-02T09:00:00.000Z" },
  { id: "i31", collecte_id: "c6", prenom: "Anaïs", email: "anais.k@example.fr", created_at: "2026-10-03T08:00:00.000Z" },
  { id: "i32", collecte_id: "c6", prenom: "Youenn", email: "youenn.d@example.fr", created_at: "2026-10-03T09:00:00.000Z" },
  { id: "i33", collecte_id: "c6", prenom: "Camille", email: "camille.b@example.fr", created_at: "2026-10-04T08:00:00.000Z" },
  { id: "i34", collecte_id: "c6", prenom: "Erwan", email: "erwan.m@example.fr", created_at: "2026-10-04T09:00:00.000Z" },
  { id: "i35", collecte_id: "c6", prenom: "Kaïna", email: "kaina.s@example.fr", created_at: "2026-10-05T08:00:00.000Z" },

  // c7 — Plage du Minou (terminée, bilan b2, 14 participants)
  { id: "i36", collecte_id: "c7", prenom: "Kelig", email: "kelig.a@example.fr", created_at: "2026-10-20T08:00:00.000Z" },
  { id: "i37", collecte_id: "c7", prenom: "Soazig", email: "soazig.l@example.fr", created_at: "2026-10-20T09:00:00.000Z" },
  { id: "i38", collecte_id: "c7", prenom: "Ewen", email: "ewen.r@example.fr", created_at: "2026-10-21T08:00:00.000Z" },
  { id: "i39", collecte_id: "c7", prenom: "Perrine", email: "perrine.k@example.fr", created_at: "2026-10-21T09:00:00.000Z" },
  { id: "i40", collecte_id: "c7", prenom: "Mathéo", email: "matheo.b@example.fr", created_at: "2026-10-22T08:00:00.000Z" },
  { id: "i41", collecte_id: "c7", prenom: "Lou", email: "lou.v@example.fr", created_at: "2026-10-22T09:00:00.000Z" },
  { id: "i42", collecte_id: "c7", prenom: "Ronan", email: "ronan.d@example.fr", created_at: "2026-10-23T08:00:00.000Z" },
  { id: "i43", collecte_id: "c7", prenom: "Awen", email: "awen.m@example.fr", created_at: "2026-10-23T09:00:00.000Z" },
  { id: "i44", collecte_id: "c7", prenom: "Lilou", email: "lilou.c@example.fr", created_at: "2026-10-24T08:00:00.000Z" },
  { id: "i45", collecte_id: "c7", prenom: "Jade", email: "jade.s@example.fr", created_at: "2026-10-24T09:00:00.000Z" },
  { id: "i46", collecte_id: "c7", prenom: "Noa", email: "noa.j@example.fr", created_at: "2026-10-25T08:00:00.000Z" },
  { id: "i47", collecte_id: "c7", prenom: "Ambre", email: "ambre.n@example.fr", created_at: "2026-10-25T09:00:00.000Z" },
  { id: "i48", collecte_id: "c7", prenom: "Gurvan", email: "gurvan.t@example.fr", created_at: "2026-10-26T08:00:00.000Z" },
  { id: "i49", collecte_id: "c7", prenom: "Ilan", email: "ilan.f@example.fr", created_at: "2026-10-26T09:00:00.000Z" },
];

export const BILANS_DEMO: Bilan[] = [
  { id: "b1", collecte_id: "c6", kg: 12, sacs: 3, participants: 9, created_at: "2026-10-10T11:00:00.000Z" },
  { id: "b2", collecte_id: "c7", kg: 31, sacs: 7, participants: 14, created_at: "2026-11-07T13:00:00.000Z" },
];
