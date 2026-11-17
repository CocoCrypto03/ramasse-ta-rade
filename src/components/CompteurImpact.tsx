"use client";

import { useEffect, useState } from "react";
import type { Impact } from "@/lib/types";

function formatNombre(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

// Petites icônes SVG maison (pas d'image externe) illustrant chaque chiffre.
function IconeSac() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <path d="M11 11V9a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path
        d="M8 11h16l-1.4 16.2a2 2 0 0 1-2 1.8H11.4a2 2 0 0 1-2-1.8L8 11Z"
        fill="currentColor"
        fillOpacity={0.15}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeBenevoles() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <circle cx="12" cy="11" r="4" fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeWidth={2} />
      <circle cx="22" cy="13" r="3.2" fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeWidth={2} />
      <path
        d="M4 27c0-4.4 3.6-8 8-8s8 3.6 8 8"
        fill="currentColor"
        fillOpacity={0.15}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path d="M20 19.5c3.5.3 6 3.3 6 7.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function IconeCollectes() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <rect x="5" y="7" width="22" height="19" rx="3" fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeWidth={2} />
      <path d="M5 13h22" stroke="currentColor" strokeWidth={2} />
      <path d="M10 5v4M22 5v4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M11 19l3 3 7-7" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Nombre qui compte en douceur de 0 à sa valeur finale au chargement (sauf préférence de mouvement réduit). */
function NombreAnime({ valeur, suffixe = "" }: { valeur: number; suffixe?: string }) {
  const [affiche, setAffiche] = useState(0);

  useEffect(() => {
    const reduitPrefere = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duree = reduitPrefere ? 0 : 900;
    const depart = performance.now();
    let frame: number;

    function etape(maintenant: number) {
      const t = duree === 0 ? 1 : Math.min(1, (maintenant - depart) / duree);
      const progression = 1 - Math.pow(1 - t, 3); // ease-out doux
      setAffiche(Math.round(valeur * progression));
      if (t < 1) frame = requestAnimationFrame(etape);
    }
    frame = requestAnimationFrame(etape);
    return () => cancelAnimationFrame(frame);
  }, [valeur]);

  return (
    <span>
      {formatNombre(affiche)}
      {suffixe}
    </span>
  );
}

export default function CompteurImpact({ impact }: { impact: Impact }) {
  const items = [
    { valeur: impact.total_kg, suffixe: " kg", label: "de déchets ramassés", icone: <IconeSac /> },
    { valeur: impact.collectes_terminees, suffixe: "", label: "collectes terminées", icone: <IconeCollectes /> },
    { valeur: impact.participants, suffixe: "", label: "participants mobilisés", icone: <IconeBenevoles /> },
  ];

  return (
    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-3 border-t-4 border-bouee pt-3">
          <span className="mt-1 shrink-0 text-golfe">{item.icone}</span>
          <div>
            <dd className="font-display text-4xl font-extrabold text-rade sm:text-5xl">
              <NombreAnime valeur={item.valeur} suffixe={item.suffixe} />
            </dd>
            <dt className="mt-1 text-base text-encre/80">{item.label}</dt>
          </div>
        </div>
      ))}
    </dl>
  );
}
