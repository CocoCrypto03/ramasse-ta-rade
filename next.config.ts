import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serveur autonome minimal pour l'image Docker (sans effet sur Vercel).
  output: "standalone",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
