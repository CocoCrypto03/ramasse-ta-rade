// Vérification du code ambassadeur. Toujours côté serveur : ce module ne
// doit jamais être importé depuis un composant client.

export function codeAmbassadeurAttendu(): string {
  return process.env.AMBASSADEUR_CODE?.trim() || "GOELAND29";
}

export function codeAmbassadeurValide(code: string | null | undefined): boolean {
  if (!code) return false;
  return code.trim() === codeAmbassadeurAttendu();
}
