-- Ramasse ta rade — schéma Supabase
--
-- RLS activée sur les 3 tables, SANS AUCUNE policy publique : tous les
-- accès passent par le serveur Next.js avec la clé service role
-- (SUPABASE_SERVICE_ROLE_KEY), qui contourne RLS. Le client du navigateur
-- n'a donc jamais accès direct à la base (clé anonyme non utilisée dans ce
-- projet) — c'est la garantie RGPD pour les e-mails des inscriptions.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- collectes
-- ---------------------------------------------------------------------------

create table if not exists collectes (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  lieu text not null,
  commune text not null,
  lat double precision not null,
  lng double precision not null,
  debut timestamptz not null,
  duree_min integer not null check (duree_min > 0),
  places integer not null check (places > 0),
  organisateur text not null,
  materiel text not null default '',
  statut text not null default 'a_venir' check (statut in ('a_venir', 'terminee')),
  created_at timestamptz not null default now()
);

alter table collectes enable row level security;
-- Aucune policy : table inaccessible sauf via la clé service role (serveur).

-- ---------------------------------------------------------------------------
-- inscriptions
-- ---------------------------------------------------------------------------

create table if not exists inscriptions (
  id uuid primary key default gen_random_uuid(),
  collecte_id uuid not null references collectes (id) on delete cascade,
  prenom text not null,
  email text not null,
  created_at timestamptz not null default now(),
  -- RGPD : date du consentement recueilli à l'inscription, et empreinte
  -- SHA-256 du jeton de désinscription (le jeton lui-même n'est jamais stocké).
  consentement_at timestamptz,
  jeton_hash text unique,
  unique (collecte_id, email)
);

create index if not exists inscriptions_collecte_id_idx on inscriptions (collecte_id);

alter table inscriptions enable row level security;
-- Aucune policy : les e-mails ne sont JAMAIS exposés côté client (RGPD).
-- Le serveur lit via la clé service role, filtre les e-mails pour l'affichage
-- public, et ne les renvoie qu'après vérification du code ambassadeur.

-- ---------------------------------------------------------------------------
-- bilans
-- ---------------------------------------------------------------------------

create table if not exists bilans (
  id uuid primary key default gen_random_uuid(),
  collecte_id uuid not null unique references collectes (id) on delete cascade,
  kg numeric,
  sacs integer,
  participants integer not null check (participants >= 0),
  created_at timestamptz not null default now()
);

alter table bilans enable row level security;
-- Aucune policy : écriture uniquement via le serveur (code ambassadeur).
