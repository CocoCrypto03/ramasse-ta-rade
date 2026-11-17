import { NextResponse } from "next/server";
import { creerInscription, DbError, listerInscriptionsPubliques } from "@/lib/db";

// Liste publique : prénoms seulement, jamais les e-mails (RGPD, US-09).
export async function GET(_requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inscrits = await listerInscriptionsPubliques(id);
  return NextResponse.json({ inscrits });
}

// US-03 — inscription prénom + e-mail, avec consentement RGPD explicite.
export async function POST(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const corps = await requete.json().catch(() => null);

  const prenom = typeof corps?.prenom === "string" ? corps.prenom.trim() : "";
  const email = typeof corps?.email === "string" ? corps.email.trim() : "";

  if (!prenom || !email || !email.includes("@")) {
    return NextResponse.json({ erreur: "Merci d'indiquer un prénom et un e-mail valide." }, { status: 400 });
  }

  // Le consentement doit être un acte positif : on exige le booléen true,
  // pas une valeur « truthy » quelconque.
  if (corps?.consentement !== true) {
    return NextResponse.json(
      { erreur: "Merci d'accepter l'utilisation de vos données pour vous inscrire." },
      { status: 400 },
    );
  }

  try {
    // Le jeton de désinscription n'est renvoyé qu'ici, une seule fois.
    const { inscription, jeton } = await creerInscription(id, { prenom, email });
    return NextResponse.json({ inscription, jetonDesinscription: jeton }, { status: 201 });
  } catch (err) {
    if (err instanceof DbError) {
      const statut = err.code === "introuvable" ? 404 : 409;
      return NextResponse.json({ erreur: err.message, code: err.code }, { status: statut });
    }
    throw err;
  }
}
