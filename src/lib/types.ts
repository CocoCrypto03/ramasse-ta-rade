export type StatutCollecte = "a_venir" | "terminee";

export interface Collecte {
  id: string;
  titre: string;
  lieu: string;
  commune: string;
  lat: number;
  lng: number;
  debut: string; // ISO 8601, timestamptz
  duree_min: number;
  places: number;
  organisateur: string;
  materiel: string;
  statut: StatutCollecte;
  created_at: string;
}

export interface Inscription {
  id: string;
  collecte_id: string;
  prenom: string;
  email: string;
  created_at: string;
  /** Date du consentement RGPD (null pour les inscriptions antérieures à son recueil). */
  consentement_at: string | null;
}

export interface InscriptionPublique {
  prenom: string;
  created_at: string;
}

export interface Bilan {
  id: string;
  collecte_id: string;
  kg: number | null;
  sacs: number | null;
  participants: number;
  created_at: string;
}

export interface Impact {
  total_kg: number;
  collectes_terminees: number;
  participants: number;
}

export interface NouvelleCollecte {
  titre: string;
  lieu: string;
  commune: string;
  lat: number;
  lng: number;
  debut: string;
  duree_min: number;
  places: number;
  organisateur: string;
  materiel: string;
}

export interface NouveauBilan {
  kg: number | null;
  sacs: number | null;
  participants: number;
}
