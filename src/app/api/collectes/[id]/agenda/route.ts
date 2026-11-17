import { obtenirCollecte } from "@/lib/db";
import { infoMareeCollecte } from "@/lib/marees";

// "Ajouter à mon agenda" : fichier .ics standard (iPhone, Android, Outlook).
// ponytail: remplace US-15 (rappel e-mail) — le rappel vient de l'agenda du
// bénévole, sans service d'envoi ni donnée personnelle en plus.

const versIcs = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const echapper = (t: string) => t.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");

export async function GET(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collecte = await obtenirCollecte(id);
  if (!collecte) return new Response("Collecte introuvable", { status: 404 });

  const fin = new Date(new Date(collecte.debut).getTime() + collecte.duree_min * 60_000).toISOString();
  const lien = new URL(`/collecte/${id}`, requete.url).toString();
  const bm = infoMareeCollecte(collecte.debut).basseMerLaPlusProche;
  const description = [
    bm ? `Basse mer à ${bm.heure.slice(11, 16).replace(":", "h")}.` : "",
    collecte.materiel ? `À apporter : ${collecte.materiel}.` : "",
    "Vérifiez les horaires officiels sur maree.shom.fr.",
    lien,
  ]
    .filter(Boolean)
    .join("\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ramasse ta rade//FR",
    "BEGIN:VEVENT",
    `UID:${id}@ramasse-ta-rade`,
    `DTSTAMP:${versIcs(new Date().toISOString())}`,
    `DTSTART:${versIcs(collecte.debut)}`,
    `DTEND:${versIcs(fin)}`,
    `SUMMARY:${echapper(collecte.titre)}`,
    `LOCATION:${echapper(`${collecte.lieu}, ${collecte.commune}`)}`,
    `GEO:${collecte.lat};${collecte.lng}`,
    `DESCRIPTION:${echapper(description)}`,
    `URL:${lien}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Collecte demain : pensez à vos gants !",
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="collecte-ramasse-ta-rade.ics"',
    },
  });
}
