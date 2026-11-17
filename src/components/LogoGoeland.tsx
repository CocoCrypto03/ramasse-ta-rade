// Logo : un goéland stylisé portant un sac de collecte dans le bec.
// SVG inline simple, deux couleurs, pour rester net à toute taille.

export default function LogoGoeland({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      role="img"
      aria-label="Logo Ramasse ta rade : un goéland tenant un sac de collecte"
    >
      {/* corps */}
      <path
        d="M32 10c6 0 9 5 9 10 0 3-1 5-2.5 7 5 1.5 9 5 11.5 9.5-6-2-10-2-13-1 1.5 2 2 4.5 1.5 7-2-4-5-6.5-9-7.5-4 1-7 3.5-9 7.5-.5-2.5 0-5 1.5-7-3-1-7-1-13 1 2.5-4.5 6.5-8 11.5-9.5C21 25 20 23 20 20c0-5 3-10 9-10 1 0 2 .3 3 .7-.3-.2-.7-.5-.7-.7H32z"
        fill="currentColor"
        className="text-rade"
      />
      {/* aile repliée */}
      <path
        d="M30 24c-3 2-6 3-9 3 3 3 7 4 10.5 3.5C30.5 28.5 30 26 30 24z"
        fill="currentColor"
        className="text-golfe"
      />
      {/* oeil */}
      <circle cx="29" cy="16" r="1.4" fill="currentColor" className="text-sable" />
      {/* bec */}
      <path d="M22 18.5c-3 .3-5.5 1.6-7 3.5 2.6-.4 5.3-.2 7.8.8-.4-1.5-.5-3-.8-4.3z" fill="currentColor" className="text-bouee" />
      {/* sac de collecte tenu dans le bec */}
      <path
        d="M11 24.5c-1.8.4-3.2 1.9-3.2 3.9 0 2.3 2 4.1 4.4 4.1h2.6c2.4 0 4.4-1.8 4.4-4.1 0-2-1.4-3.5-3.2-3.9l-.4-2h-4.2l-.4 2z"
        fill="currentColor"
        className="text-algue"
      />
      <path d="M12.3 22.5h3.4l.3 1.4h-4l.3-1.4z" fill="currentColor" className="text-rade" />
    </svg>
  );
}
