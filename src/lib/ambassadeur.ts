// Vérification du code ambassadeur. Toujours côté serveur : ce module ne
// doit jamais être importé depuis un composant client.

// Le code de production n'est que dans la variable d'environnement Vercel ;
// GOELAND29 ne vaut qu'en développement local.
export function codeAmbassadeurAttendu(): string | null {
  const code = process.env.AMBASSADEUR_CODE?.trim();
  if (code) return code;
  return process.env.NODE_ENV === "production" ? null : "GOELAND29";
}

export function codeAmbassadeurValide(code: string | null | undefined): boolean {
  const attendu = codeAmbassadeurAttendu();
  if (!code || !attendu) return false;
  return code.trim() === attendu;
}
