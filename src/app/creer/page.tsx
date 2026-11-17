import FormulaireCreation from "@/components/FormulaireCreation";

export default function CreerPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-display text-3xl font-extrabold text-rade">Créer une collecte</h1>
      <p className="mt-2 text-encre/75">
        Réservé aux ambassadeur·rices. Elle apparaîtra immédiatement sur la carte, à venir.
      </p>
      <div className="mt-6">
        <FormulaireCreation />
      </div>
    </div>
  );
}
