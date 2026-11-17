// Aperçu affiché quand on partage le lien d'une collecte (WhatsApp, SMS,
// réseaux). Répond au risque R2 : un lien partagé doit donner envie.
import { ImageResponse } from "next/og";
import { obtenirCollecte } from "@/lib/db";
import { infoMareeCollecte } from "@/lib/marees";
import { formatDateLongueFr, formatHeureFr } from "@/lib/temps";

export const alt = "Collecte Ramasse ta rade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collecte = await obtenirCollecte(id);
  const titre = collecte?.titre ?? "Collecte de déchets en rade de Brest";
  const lieu = collecte ? `${collecte.lieu}, ${collecte.commune}` : "Rade de Brest";
  const date = collecte ? formatDateLongueFr(collecte.debut) : "";
  const quand = collecte ? `${date.charAt(0).toUpperCase()}${date.slice(1)} · ${formatHeureFr(collecte.debut)}` : "";
  const bm = collecte ? infoMareeCollecte(collecte.debut).basseMerLaPlusProche : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#0b3a4a",
          color: "#f4edd9",
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700, color: "#2fa3bf" }}>Ramasse ta rade</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>{titre}</div>
          <div style={{ fontSize: 36, marginTop: 20 }}>{lieu}</div>
          <div style={{ fontSize: 36, marginTop: 8 }}>{quand}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {bm && (
            <div
              style={{
                display: "flex",
                padding: "14px 28px",
                borderRadius: 999,
                background: "#ff5a1f",
                color: "white",
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {`Basse mer ${bm.heure.slice(11, 16).replace(":", "h")}`}
            </div>
          )}
          <div style={{ fontSize: 30, opacity: 0.8 }}>Inscription en 30 s, sans compte</div>
        </div>
      </div>
    ),
    size,
  );
}
