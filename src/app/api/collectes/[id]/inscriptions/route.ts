import { NextResponse } from "next/server";
import { creerInscription, DbError, listerInscriptionsPubliques } from "@/lib/db";

// Liste publique : prénoms seulement, jamais les e-mails (RGPD, US-09).
export async function GET(_requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inscrits = await listerInscriptionsPubliques(id);
  return NextResponse.json({ inscrits });
}

// US-03 — inscription prénom + e-mail.
export async function POST(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const corps = await requete.json().catch(() => null);

  const prenom = typeof corps?.prenom === "string" ? corps.prenom.trim() : "";
  const email = typeof corps?.email === "string" ? corps.email.trim() : "";

  if (!prenom || !email || !email.includes("@")) {
    return NextResponse.json({ erreur: "Merci d'indiquer un prénom et un e-mail valide." }, { status: 400 });
  }

  try {
    const inscription = await creerInscription(id, { prenom, email });
    return NextResponse.json({ inscription }, { status: 201 });
  } catch (err) {
    if (err instanceof DbError) {
      const statut = err.code === "introuvable" ? 404 : 409;
      return NextResponse.json({ erreur: err.message, code: err.code }, { status: statut });
    }
    throw err;
  }
}
