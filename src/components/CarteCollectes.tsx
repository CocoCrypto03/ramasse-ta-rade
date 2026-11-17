"use client";

import dynamic from "next/dynamic";
import type { Collecte } from "@/lib/types";

const CarteCollectesInterne = dynamic(() => import("./CarteCollectesInterne"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] w-full items-center justify-center bg-sable-dark text-encre/60">
      Chargement de la carte…
    </div>
  ),
});

export default function CarteCollectes({
  collectes,
  pointSelectionne,
  onClicCarte,
  hauteurClasse,
}: {
  collectes: Collecte[];
  pointSelectionne?: { lat: number; lng: number } | null;
  onClicCarte?: (lat: number, lng: number) => void;
  hauteurClasse?: string;
}) {
  return (
    <CarteCollectesInterne
      collectes={collectes}
      pointSelectionne={pointSelectionne}
      onClicCarte={onClicCarte}
      hauteurClasse={hauteurClasse}
    />
  );
}
