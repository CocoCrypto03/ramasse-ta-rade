import type { Impact } from "@/lib/types";

function formatNombre(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

export default function CompteurImpact({ impact }: { impact: Impact }) {
  const items: { valeur: string; label: string }[] = [
    { valeur: `${formatNombre(impact.total_kg)} kg`, label: "de déchets ramassés" },
    { valeur: formatNombre(impact.collectes_terminees), label: "collectes terminées" },
    { valeur: formatNombre(impact.participants), label: "participants mobilisés" },
  ];

  return (
    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="border-t-4 border-bouee pt-3">
          <dd className="font-display text-4xl font-extrabold text-rade sm:text-5xl">{item.valeur}</dd>
          <dt className="mt-1 text-base text-encre/80">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}
