import { NextResponse } from "next/server";
import { obtenirCollecte, supprimerInscriptionParJeton } from "@/lib/db";

// RGPD — droit à l'effacement. Le jeton arrive dans le corps de la requête
// (et non dans l'URL) pour ne jamais apparaître dans les journaux serveur.
export async function POST(requete: Request) {
  const corps = await requete.json().catch(() => null);
  const jeton = typeof corps?.jeton === "string" ? corps.jeton.trim() : "";

  if (!jeton) {
    return NextResponse.json({ erreur: "Lien de désinscription invalide." }, { status: 400 });
  }

  const collecteId = await supprimerInscriptionParJeton(jeton);
  if (!collecteId) {
    return NextResponse.json(
      { erreur: "Ce lien n'est plus valide : l'inscription a déjà été supprimée." },
      { status: 404 },
    );
  }

  const collecte = await obtenirCollecte(collecteId);
  return NextResponse.json({ collecte: collecte ? { id: collecte.id, titre: collecte.titre } : null });
}
