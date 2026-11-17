// Séparateur en forme de vague entre deux sections — motif maritime plutôt
// qu'une simple ligne droite.

export default function VagueDivider({ className = "fill-sable" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      className={`block h-10 w-full ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 30C180 60 360 0 540 20C720 40 900 60 1080 35C1260 10 1350 25 1440 30V60H0V30Z" />
    </svg>
  );
}
