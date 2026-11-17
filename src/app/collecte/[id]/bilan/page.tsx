import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenirCollecte } from "@/lib/db";
import FormulaireBilan from "@/components/FormulaireBilan";

export const dynamic = "force-dynamic";

export default async function BilanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collecte = await obtenirCollecte(id);
  if (!collecte) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <Link href={`/collecte/${id}`} className="text-sm font-semibold text-golfe">
        ← Retour à la collecte
      </Link>
      <h1 className="font-display mt-2 text-3xl font-extrabold text-rade">Bilan — {collecte.titre}</h1>
      <p className="mt-2 text-encre/75">Réservé aux ambassadeur·rices. La collecte passera au statut « terminée ».</p>
      {collecte.statut === "terminee" ? (
        <p className="mt-6 rounded-lg bg-sable-dark/60 p-4 text-sm text-encre/80">
          Un bilan a déjà été enregistré pour cette collecte.
        </p>
      ) : (
        <div className="mt-6">
          <FormulaireBilan collecteId={id} />
        </div>
      )}
    </div>
  );
}
