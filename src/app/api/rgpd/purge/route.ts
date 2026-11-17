import { NextResponse } from "next/server";
import { purgerInscriptionsPerimees } from "@/lib/db";

// RGPD — limitation de la conservation. Appelée chaque jour par la tâche
// planifiée Vercel (vercel.json), qui envoie « Authorization: Bearer
// <CRON_SECRET> ». Sans CRON_SECRET configuré, la route refuse tout appel.
export async function GET(requete: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || requete.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ erreur: "Non autorisé." }, { status: 401 });
  }

  const supprimees = await purgerInscriptionsPerimees();
  return NextResponse.json({ supprimees });
}
