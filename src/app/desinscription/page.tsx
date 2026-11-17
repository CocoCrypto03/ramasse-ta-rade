import type { Metadata } from "next";
import ConfirmationDesinscription from "@/components/ConfirmationDesinscription";

export const metadata: Metadata = {
  title: "Se désinscrire — Ramasse ta rade",
  robots: { index: false },
};

export default function DesinscriptionPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-display text-3xl font-extrabold text-rade">Se désinscrire</h1>
      <div className="mt-4">
        <ConfirmationDesinscription />
      </div>
    </div>
  );
}
