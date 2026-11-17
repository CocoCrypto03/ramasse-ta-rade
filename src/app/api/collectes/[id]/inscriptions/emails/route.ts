import { NextResponse } from "next/server";
import { listerInscriptionsCompletes } from "@/lib/db";
import { codeAmbassadeurValide } from "@/lib/ambassadeur";

// US-09 — les e-mails ne sont renvoyés qu'après vérification du code
// ambassadeur, et seulement via cette route (jamais dans le rendu public).
export async function POST(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const corps = await requete.json().catch(() => null);

  if (!codeAmbassadeurValide(corps?.code)) {
    return NextResponse.json({ erreur: "Code ambassadeur invalide." }, { status: 403 });
  }

  const inscrits = await listerInscriptionsCompletes(id);
  return NextResponse.json({ inscrits });
}
