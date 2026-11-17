import { NextResponse } from "next/server";
import { creerCollecte, listerCollectes } from "@/lib/db";
import { codeAmbassadeurValide } from "@/lib/ambassadeur";
import { localParisVersISO } from "@/lib/temps";
import type { NouvelleCollecte } from "@/lib/types";

export async function GET() {
  const collectes = await listerCollectes();
  return NextResponse.json({ collectes });
}

// US-04 — création d'une collecte par un ambassadeur (code vérifié ici, côté serveur).
export async function POST(requete: Request) {
  const corps = await requete.json().catch(() => null);
  if (!corps) {
    return NextResponse.json({ erreur: "Corps de requête invalide." }, { status: 400 });
  }

  if (!codeAmbassadeurValide(corps.code)) {
    return NextResponse.json({ erreur: "Code ambassadeur invalide." }, { status: 403 });
  }

  const { titre, lieu, commune, lat, lng, date, heure, duree_min, places, organisateur, materiel } = corps;

  const champsManquants =
    !titre || !lieu || !commune || lat === undefined || lng === undefined || !date || !heure ||
    !duree_min || !places || !organisateur;

  if (champsManquants) {
    return NextResponse.json({ erreur: "Merci de remplir tous les champs obligatoires." }, { status: 400 });
  }

  const nouvelle: NouvelleCollecte = {
    titre: String(titre).trim(),
    lieu: String(lieu).trim(),
    commune: String(commune).trim(),
    lat: Number(lat),
    lng: Number(lng),
    debut: localParisVersISO(String(date), String(heure)),
    duree_min: Number(duree_min),
    places: Number(places),
    organisateur: String(organisateur).trim(),
    materiel: String(materiel ?? "").trim(),
  };

  const collecte = await creerCollecte(nouvelle);
  return NextResponse.json({ collecte }, { status: 201 });
}
