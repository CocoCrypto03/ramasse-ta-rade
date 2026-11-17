// Accès aux données — UNIQUEMENT côté serveur (server actions / route
// handlers). Utilise Supabase si les variables d'environnement sont
// présentes, sinon un stockage en mémoire pré-rempli avec les données de
// démonstration (pratique pour développer sans base de données).
//
// Toute la logique métier (places restantes, doublon d'e-mail, statut
// terminé, code ambassadeur) est centralisée ici pour rester cohérente
// entre les deux modes.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Bilan,
  Collecte,
  Impact,
  Inscription,
  InscriptionPublique,
  NouveauBilan,
  NouvelleCollecte,
} from "./types";
import { COLLECTES_DEMO, INSCRIPTIONS_DEMO, BILANS_DEMO } from "./donnees-demo";

export class DbError extends Error {
  code: "introuvable" | "complet" | "terminee" | "doublon_email" | "deja_un_bilan";
  constructor(code: DbError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UTILISE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

let _client: SupabaseClient | null = null;
function client(): SupabaseClient {
  if (!_client) {
    _client = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Stockage en mémoire (mode démo, sans Supabase)
// ---------------------------------------------------------------------------

// Next.js peut exécuter les route handlers et les pages dans des bundles /
// isolats serveur distincts : une simple variable de module (ou même
// `globalThis`) n'est pas fiable pour partager un état entre eux. On
// persiste donc ce stockage de démonstration dans un petit fichier JSON
// local, qui lui est bien partagé par tout le processus (et survit aux
// rechargements). Ce n'est QUE le mode démo ; avec Supabase configuré, ce
// fichier n'est jamais utilisé.
interface Memoire {
  collectes: Collecte[];
  inscriptions: Inscription[];
  bilans: Bilan[];
  prochainId: number;
}

const CHEMIN_STOCKAGE_DEMO = path.join(process.env.VERCEL ? os.tmpdir() : process.cwd(), ".demo-store.json");

function memoireInitiale(): Memoire {
  return {
    collectes: COLLECTES_DEMO.map((c) => ({ ...c })),
    inscriptions: INSCRIPTIONS_DEMO.map((i) => ({ ...i })),
    bilans: BILANS_DEMO.map((b) => ({ ...b })),
    prochainId: 1000,
  };
}

function memoire(): Memoire {
  if (existsSync(CHEMIN_STOCKAGE_DEMO)) {
    try {
      return JSON.parse(readFileSync(CHEMIN_STOCKAGE_DEMO, "utf-8")) as Memoire;
    } catch {
      // Fichier corrompu ou vide : on repart des données de démonstration.
    }
  }
  const initiale = memoireInitiale();
  writeFileSync(CHEMIN_STOCKAGE_DEMO, JSON.stringify(initiale));
  return initiale;
}

function sauvegarder(m: Memoire): void {
  writeFileSync(CHEMIN_STOCKAGE_DEMO, JSON.stringify(m));
}

function nouvelId(m: Memoire, prefixe: string): string {
  m.prochainId += 1;
  return `${prefixe}${m.prochainId}`;
}

// ---------------------------------------------------------------------------
// Collectes
// ---------------------------------------------------------------------------

export async function listerCollectes(): Promise<Collecte[]> {
  if (UTILISE_SUPABASE) {
    const { data, error } = await client()
      .from("collectes")
      .select("*")
      .order("debut", { ascending: true });
    if (error) throw error;
    return data as Collecte[];
  }
  return [...memoire().collectes].sort((a, b) => a.debut.localeCompare(b.debut));
}

export async function obtenirCollecte(id: string): Promise<Collecte | null> {
  if (UTILISE_SUPABASE) {
    const { data, error } = await client().from("collectes").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as Collecte | null) ?? null;
  }
  return memoire().collectes.find((c) => c.id === id) ?? null;
}

export async function creerCollecte(nouvelle: NouvelleCollecte): Promise<Collecte> {
  if (UTILISE_SUPABASE) {
    const { data, error } = await client()
      .from("collectes")
      .insert({ ...nouvelle, statut: "a_venir" })
      .select("*")
      .single();
    if (error) throw error;
    return data as Collecte;
  }
  const m = memoire();
  const collecte: Collecte = {
    id: nouvelId(m, "c"),
    ...nouvelle,
    statut: "a_venir",
    created_at: new Date().toISOString(),
  };
  m.collectes.push(collecte);
  sauvegarder(m);
  return collecte;
}

// ---------------------------------------------------------------------------
// Inscriptions
// ---------------------------------------------------------------------------

export async function compterInscriptions(collecteId: string): Promise<number> {
  if (UTILISE_SUPABASE) {
    const { count, error } = await client()
      .from("inscriptions")
      .select("id", { count: "exact", head: true })
      .eq("collecte_id", collecteId);
    if (error) throw error;
    return count ?? 0;
  }
  return memoire().inscriptions.filter((i) => i.collecte_id === collecteId).length;
}

export async function listerInscriptionsPubliques(collecteId: string): Promise<InscriptionPublique[]> {
  if (UTILISE_SUPABASE) {
    const { data, error } = await client()
      .from("inscriptions")
      .select("prenom, created_at")
      .eq("collecte_id", collecteId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as InscriptionPublique[];
  }
  return memoire().inscriptions
    .filter((i) => i.collecte_id === collecteId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((i) => ({ prenom: i.prenom, created_at: i.created_at }));
}

/** Liste complète (avec e-mails) — réservée au serveur, après vérification du code ambassadeur par l'appelant. */
export async function listerInscriptionsCompletes(collecteId: string): Promise<Inscription[]> {
  if (UTILISE_SUPABASE) {
    const { data, error } = await client()
      .from("inscriptions")
      .select("*")
      .eq("collecte_id", collecteId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as Inscription[];
  }
  return memoire().inscriptions
    .filter((i) => i.collecte_id === collecteId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function creerInscription(
  collecteId: string,
  { prenom, email }: { prenom: string; email: string },
): Promise<Inscription> {
  const collecte = await obtenirCollecte(collecteId);
  if (!collecte) throw new DbError("introuvable", "Collecte introuvable.");
  if (collecte.statut === "terminee") {
    throw new DbError("terminee", "Cette collecte est déjà terminée.");
  }

  const emailNormalise = email.trim().toLowerCase();
  const nombreInscrits = await compterInscriptions(collecteId);
  if (nombreInscrits >= collecte.places) {
    throw new DbError("complet", "Cette collecte est complète.");
  }

  if (UTILISE_SUPABASE) {
    const { data, error } = await client()
      .from("inscriptions")
      .insert({ collecte_id: collecteId, prenom: prenom.trim(), email: emailNormalise })
      .select("*")
      .single();
    if (error) {
      // Violation de la contrainte unique(collecte_id, email)
      if ((error as { code?: string }).code === "23505") {
        throw new DbError("doublon_email", "Cet e-mail est déjà inscrit à cette collecte.");
      }
      throw error;
    }
    return data as Inscription;
  }

  const m = memoire();
  const dejaInscrit = m.inscriptions.some(
    (i) => i.collecte_id === collecteId && i.email.toLowerCase() === emailNormalise,
  );
  if (dejaInscrit) {
    throw new DbError("doublon_email", "Cet e-mail est déjà inscrit à cette collecte.");
  }

  const inscription: Inscription = {
    id: nouvelId(m, "i"),
    collecte_id: collecteId,
    prenom: prenom.trim(),
    email: emailNormalise,
    created_at: new Date().toISOString(),
  };
  m.inscriptions.push(inscription);
  sauvegarder(m);
  return inscription;
}

// ---------------------------------------------------------------------------
// Bilans
// ---------------------------------------------------------------------------

export async function obtenirBilan(collecteId: string): Promise<Bilan | null> {
  if (UTILISE_SUPABASE) {
    const { data, error } = await client().from("bilans").select("*").eq("collecte_id", collecteId).maybeSingle();
    if (error) throw error;
    return (data as Bilan | null) ?? null;
  }
  return memoire().bilans.find((b) => b.collecte_id === collecteId) ?? null;
}

export async function creerBilan(collecteId: string, bilan: NouveauBilan): Promise<Bilan> {
  const collecte = await obtenirCollecte(collecteId);
  if (!collecte) throw new DbError("introuvable", "Collecte introuvable.");

  const bilanExistant = await obtenirBilan(collecteId);
  if (bilanExistant) throw new DbError("deja_un_bilan", "Un bilan existe déjà pour cette collecte.");

  if (UTILISE_SUPABASE) {
    const { data, error } = await client()
      .from("bilans")
      .insert({ collecte_id: collecteId, ...bilan })
      .select("*")
      .single();
    if (error) throw error;
    await client().from("collectes").update({ statut: "terminee" }).eq("id", collecteId);
    return data as Bilan;
  }

  const m = memoire();
  const collecteM = m.collectes.find((c) => c.id === collecteId);
  if (!collecteM) throw new DbError("introuvable", "Collecte introuvable.");

  const nouveauBilan: Bilan = {
    id: nouvelId(m, "b"),
    collecte_id: collecteId,
    kg: bilan.kg,
    sacs: bilan.sacs,
    participants: bilan.participants,
    created_at: new Date().toISOString(),
  };
  m.bilans.push(nouveauBilan);
  collecteM.statut = "terminee";
  sauvegarder(m);
  return nouveauBilan;
}

// ---------------------------------------------------------------------------
// Compteur d'impact (US-06)
// ---------------------------------------------------------------------------

export async function obtenirImpact(): Promise<Impact> {
  if (UTILISE_SUPABASE) {
    const [{ data: bilans, error: e1 }, { count, error: e2 }] = await Promise.all([
      client().from("bilans").select("kg, participants"),
      client().from("collectes").select("id", { count: "exact", head: true }).eq("statut", "terminee"),
    ]);
    if (e1) throw e1;
    if (e2) throw e2;
    const totalKg = (bilans ?? []).reduce((acc: number, b: { kg: number | null }) => acc + (b.kg ?? 0), 0);
    const participants = (bilans ?? []).reduce(
      (acc: number, b: { participants: number | null }) => acc + (b.participants ?? 0),
      0,
    );
    return { total_kg: totalKg, collectes_terminees: count ?? 0, participants };
  }

  const totalKg = memoire().bilans.reduce((acc, b) => acc + (b.kg ?? 0), 0);
  const participants = memoire().bilans.reduce((acc, b) => acc + (b.participants ?? 0), 0);
  const collectesTerminees = memoire().collectes.filter((c) => c.statut === "terminee").length;
  return { total_kg: totalKg, collectes_terminees: collectesTerminees, participants };
}

export function modeStockage(): "supabase" | "memoire" {
  return UTILISE_SUPABASE ? "supabase" : "memoire";
}
