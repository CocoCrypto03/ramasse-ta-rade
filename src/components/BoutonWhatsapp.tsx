"use client";

export default function BoutonWhatsapp({
  titre,
  lieu,
  dateTexte,
}: {
  titre: string;
  lieu: string;
  dateTexte: string;
}) {
  function ouvrirWhatsapp() {
    const texte = `${titre} — ${lieu}, le ${dateTexte}. On y va ? ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texte)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={ouvrirWhatsapp}
      className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-algue px-5 font-semibold text-algue transition-colors hover:bg-algue-light"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.86.5 3.6 1.4 5.1L2 22l5.1-1.4c1.47.87 3.2 1.37 5 1.37h.01c5.52 0 10-4.48 10-10 0-5.52-4.48-10-10.07-10zm0 18.2c-1.6 0-3.1-.43-4.4-1.2l-.3-.18-3.3.9.9-3.2-.2-.33A8.17 8.17 0 0 1 3.84 12c0-4.53 3.68-8.2 8.2-8.2 4.53 0 8.2 3.68 8.2 8.2 0 4.53-3.67 8.2-8.2 8.2zm4.5-6.1c-.25-.12-1.47-.72-1.7-.8-.22-.08-.4-.12-.56.12-.17.25-.65.8-.8.97-.14.17-.3.18-.55.06-1.5-.73-2.5-1.3-3.5-2.95-.26-.45.26-.42.75-1.4.08-.17.04-.3-.03-.43-.08-.12-.6-1.45-.82-1.98-.22-.52-.44-.45-.6-.46h-.52c-.17 0-.45.06-.68.3-.24.26-.9.9-.9 2.2 0 1.3.93 2.56 1.06 2.74.13.17 1.8 2.76 4.38 3.76 2.17.83 2.6.67 3.08.63.47-.05 1.5-.6 1.72-1.2.21-.6.21-1.1.14-1.2-.06-.1-.24-.17-.5-.3z" />
      </svg>
      Partager sur WhatsApp
    </button>
  );
}
