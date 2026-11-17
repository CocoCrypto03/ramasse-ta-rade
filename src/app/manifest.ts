import type { MetadataRoute } from "next";

// Rend l'appli "installable" sur l'écran d'accueil (sans app native, cf. Won't).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ramasse ta rade",
    short_name: "Ramasse ta rade",
    description: "Les collectes de déchets de la rade de Brest, calées sur la marée basse.",
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#f4edd9",
    theme_color: "#0b3a4a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
