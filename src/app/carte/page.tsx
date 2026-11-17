import { listerCollectes } from "@/lib/db";
import CarteCollectes from "@/components/CarteCollectes";

export const dynamic = "force-dynamic";

export default async function CartePage() {
  const collectes = await listerCollectes();

  return (
    <div>
      <div className="mx-auto max-w-5xl px-5 py-5">
        <h1 className="font-display text-2xl font-bold text-rade">La carte des collectes</h1>
        <p className="mt-1 text-sm text-encre/70">
          {collectes.length} collecte{collectes.length > 1 ? "s" : ""} entre Plouzané et Plougastel-Daoulas.
          Touchez un marqueur pour voir le détail.
        </p>
        <div className="mt-3 flex gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-white bg-bouee" /> à venir
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-white" style={{ background: "#6b7a73" }} /> terminée
          </span>
        </div>
      </div>
      <CarteCollectes collectes={collectes} />
    </div>
  );
}
