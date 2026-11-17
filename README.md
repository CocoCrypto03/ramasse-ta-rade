# Ramasse ta rade

MVP d'une application web mobile-first pour organiser des collectes de
déchets sur la rade de Brest (de Plouzané à Plougastel-Daoulas), calées sur
la marée basse. Projet M2 Gestion de projet — équipe **Les Goélands**
(Jean, Cheun, Gaspard, Corentin).

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000. Sans configuration, l'application utilise un
stockage **en mémoire** pré-rempli avec des données de démonstration (7
collectes réelles sur le littoral de la rade) : rien à installer pour
tester. Cet état est persisté dans un fichier `.demo-store.json` à la
racine (ignoré par git) ; supprimez-le pour repartir des données de départ.

## Variables d'environnement

Copier `.env.example` en `.env.local` :

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
AMBASSADEUR_CODE=GOELAND29
```

- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` : si renseignées, l'application
  bascule automatiquement sur Supabase (voir `src/lib/db.ts`). Sinon, mode
  mémoire de démonstration.
- `AMBASSADEUR_CODE` : code requis pour créer une collecte et saisir un
  bilan. Par défaut en développement : `GOELAND29`.

Toutes les clés Supabase utilisées sont **côté serveur uniquement** (clé
service role) : le client du navigateur n'a jamais d'accès direct à la base.

## Initialiser Supabase

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet, exécuter dans l'ordre :
   - `supabase/schema.sql` (tables + RLS activée sans aucune policy
     publique — tout passe par le serveur avec la clé service role).
   - `supabase/seed.sql` (les mêmes données de démonstration que le mode
     mémoire).
3. Renseigner `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans
   `.env.local` (Project Settings → API).

## Horaires de marée (US-12)

`data/marees.json` est généré une fois par `scripts/marees.mjs`, qui
interroge l'API Open-Meteo Marine et détecte les pleines/basses mers.
L'application ne fait **aucun appel réseau à l'exécution** : elle lit ce
fichier local. Pour le régénérer :

```bash
node scripts/marees.mjs
```

Limite connue : l'API Open-Meteo Marine ne fournit des prévisions fiables
que sur un horizon d'environ 10 jours. Au-delà, l'application affiche
« donnée de marée indisponible pour cette date » et renvoie vers
maree.shom.fr — voir le champ `note_couverture` du fichier généré.

## Qualité

```bash
npm run build
npm run lint
```

## Déployer

Projet Next.js standard (App Router) : déployable sur Vercel ou toute
plateforme Node. Penser à renseigner les variables d'environnement
ci-dessus sur la plateforme cible, et à avoir exécuté `schema.sql` puis
`seed.sql` sur le projet Supabase de production avant la mise en ligne.
