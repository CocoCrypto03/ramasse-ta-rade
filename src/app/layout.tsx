import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import LogoGoeland from "@/components/LogoGoeland";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["600", "700", "800"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ramasse ta rade",
  description:
    "Trouvez une collecte de déchets calée sur la marée basse, dans la rade de Brest. Rien ne traîne sur notre rade.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b3a4a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${bricolage.variable} ${publicSans.variable} flex min-h-screen flex-col antialiased`}>
        <header className="bg-rade text-sable">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoGoeland className="h-9 w-9 shrink-0" />
              <span className="font-display text-xl font-bold leading-none">Ramasse ta rade</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-semibold">
              <Link href="/carte" className="min-h-11 content-center hover:text-golfe-light">
                Carte
              </Link>
              <Link href="/creer" className="min-h-11 content-center hover:text-golfe-light">
                Ambassadeur
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-rade text-sable/80">
          <div className="mx-auto max-w-5xl px-5 py-6 text-sm">
            <p>Les Goélands — Jean, Cheun, Gaspard, Corentin · Projet M2 Gestion de projet</p>
            <p className="mt-1 text-sable/60">
              Données carte © OpenStreetMap ·{" "}
              <Link href="/confidentialite" className="underline hover:text-sable">
                Vos données personnelles
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
