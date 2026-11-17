#!/bin/sh
# Déploie en production sur Vercel depuis une copie sans .git : sur un compte
# Vercel gratuit, un déploiement portant des métadonnées Git est bloqué si
# l'auteur du commit n'est pas membre de l'équipe Vercel.
set -e
cd "$(dirname "$0")/.."
D=$(mktemp -d)
rsync -a --exclude .git --exclude node_modules --exclude .next --exclude .demo-store.json ./ "$D/"
(cd "$D" && npx vercel@latest deploy --prod --yes)
rm -rf "$D"
