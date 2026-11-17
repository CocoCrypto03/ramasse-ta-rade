-- Ramasse ta rade — migration RGPD (consentement + désinscription)
--
-- À exécuter une fois dans l'éditeur SQL d'un projet Supabase déjà
-- initialisé avec une version antérieure de schema.sql. Sans effet si les
-- colonnes existent déjà.
--
-- Les inscriptions existantes gardent consentement_at et jeton_hash à NULL :
-- elles n'ont pas de lien de désinscription et seront supprimées par la
-- purge automatique (30 jours après leur collecte).

alter table inscriptions add column if not exists consentement_at timestamptz;
alter table inscriptions add column if not exists jeton_hash text unique;
