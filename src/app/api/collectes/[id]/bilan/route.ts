import { NextResponse } from "next/server";
import { creerBilan, DbError } from "@/lib/db";
import { codeAmbassadeurValide } from "@/lib/ambassadeur";

// US-05 — bilan d'une collecte (code ambassadeur requis). Fait passer la
// collecte au statut "terminée" et alimente le compteur d'impact (US-06).
export async function POST(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const corps = await requete.json().catch(() => null);

  if (!codeAmbassadeurValide(corps?.code)) {
    return NextResponse.json({ erreur: "Code ambassadeur invalide." }, { status: 403 });
  }

  const kg = corps.kg === "" || corps.kg === undefined || corps.kg === null ? null : Number(corps.kg);
  const sacs = corps.sacs === "" || corps.sacs === undefined || corps.sacs === null ? null : Number(corps.sacs);
  const participants = Number(corps.participants);

  if ((kg === null && sacs === null) || !Number.isFinite(participants) || participants < 0) {
    return NextResponse.json(
      { erreur: "Merci d'indiquer au moins les kg ou le nombre de sacs, et le nombre de participants." },
      { status: 400 },
    );
  }

  try {
    const bilan = await creerBilan(id, { kg, sacs, participants });
    return NextResponse.json({ bilan }, { status: 201 });
  } catch (err) {
    if (err instanceof DbError) {
      const statut = err.code === "introuvable" ? 404 : 409;
      return NextResponse.json({ erreur: err.message, code: err.code }, { status: statut });
    }
    throw err;
  }
}
