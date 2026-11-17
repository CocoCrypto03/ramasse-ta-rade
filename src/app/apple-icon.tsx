// Icône "écran d'accueil" iPhone (iOS ne prend pas le SVG) : le logo
// app/icon.svg posé sur le bleu de la rade, généré en PNG au build.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"), "base64");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b3a4a" }}>
        <img src={`data:image/svg+xml;base64,${svg}`} width={150} height={150} alt="" />
      </div>
    ),
    size,
  );
}
