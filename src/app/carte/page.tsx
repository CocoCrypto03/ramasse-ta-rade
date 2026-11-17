import { compterInscriptions, listerCollectes } from "@/lib/db";
import CarteCollectes from "@/components/CarteCollectes";
import CarteCollecteListe from "@/components/CarteCollecteListe";

export const dynamic = "force-dynamic";

export default async function CartePage() {
  const collectes = await listerCollectes();

  // À venir d'abord (triées par date la plus proche), puis terminées (les
  // plus récentes d'abord) — accessible en liste sous la carte, utile pour
  // les personnes qui préfèrent lire une liste plutôt qu'une carte.
  const aVenir = [...collectes]
    .filter((c) => c.statut === "a_venir")
    .sort((a, b) => a.debut.localeCompare(b.debut));
  const terminees = [...collectes]
    .filter((c) => c.statut === "terminee")
    .sort((a, b) => b.debut.localeCompare(a.debut));
  const collectesTriees = [...aVenir, ...terminees];

  const placesParId = new Map<string, number>();
  await Promise.all(
    aVenir.map(async (c) => {
      const n = await compterInscriptions(c.id);
      placesParId.set(c.id, Math.max(0, c.places - n));
    }),
  );

  return (
    <div>
      <div className="mx-auto max-w-5xl px-5 py-5">
        <h1 className="font-display text-2xl font-bold text-rade">La carte des collectes</h1>
        <p className="mt-1 text-sm text-encre/70">
          {collectes.length} collecte{collectes.length > 1 ? "s" : ""} entre Plouzané et Plougastel-Daoulas.
          Touchez un marqueur, ou choisissez dans la liste ci-dessous.
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

      <div className="mx-auto max-w-5xl px-5 py-8">
        <h2 className="font-display text-xl font-bold text-rade">Toutes les collectes</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {collectesTriees.map((c) => (
            <CarteCollecteListe key={c.id} collecte={c} placesRestantes={placesParId.get(c.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
