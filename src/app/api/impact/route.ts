import { NextResponse } from "next/server";
import { obtenirImpact } from "@/lib/db";

// US-06 — compteur d'impact global.
export async function GET() {
  const impact = await obtenirImpact();
  return NextResponse.json(impact);
}
