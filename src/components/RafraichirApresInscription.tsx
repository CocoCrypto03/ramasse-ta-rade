"use client";

import { useRouter } from "next/navigation";
import FormulaireInscription from "./FormulaireInscription";

export default function RafraichirApresInscription({
  collecteId,
  placesRestantes,
  terminee,
}: {
  collecteId: string;
  placesRestantes: number;
  terminee: boolean;
}) {
  const router = useRouter();

  return (
    <FormulaireInscription
      collecteId={collecteId}
      placesRestantes={placesRestantes}
      terminee={terminee}
      onInscrit={() => {
        // Rafraîchit les données serveur (places restantes, liste des inscrit·es).
        setTimeout(() => router.refresh(), 1200);
      }}
    />
  );
}
