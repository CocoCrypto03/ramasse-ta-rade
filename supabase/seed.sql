-- Ramasse ta rade — jeu de données de démonstration
-- Généré à partir de src/lib/donnees-demo.ts (mêmes données que le mode mémoire).
-- À exécuter après supabase/schema.sql.

insert into collectes (id, titre, lieu, commune, lat, lng, debut, duree_min, places, organisateur, materiel, statut, created_at) values
  ('c17ada8f-3bfc-4eec-8d81-00fe5d95bede', 'Grand nettoyage de la plage du Moulin Blanc', 'Plage du Moulin Blanc', 'Brest', 48.3966071, -4.4331847, '2026-11-21T06:00:00.000Z', 150, 20, 'Kelig Ar Floc''h', 'Gants et sacs fournis, bottes conseillées', 'a_venir', '2026-09-15T10:00:00.000Z'),
  ('936a6a20-8171-493a-b351-8d2475dae5e3', 'Collecte à Sainte-Anne-du-Portzic', 'Plage de Sainte-Anne-du-Portzic', 'Plouzané', 48.361632, -4.5537712, '2026-11-22T07:00:00.000Z', 120, 15, 'Enora Le Bris', 'Gants, sacs, une pince si vous en avez', 'a_venir', '2026-09-16T10:00:00.000Z'),
  ('d05dcc71-e1f5-4572-b9fb-e2265fc05b9b', 'Ramassage au Dellec', 'Le Dellec', 'Plouzané', 48.3529708, -4.5718008, '2026-11-23T08:00:00.000Z', 120, 25, 'Kelig Ar Floc''h', 'Gants et bottes, sacs fournis', 'a_venir', '2026-09-17T10:00:00.000Z'),
  ('cdefe23e-613e-49fe-83ad-4506d9c9e799', 'Collecte à l''Auberlac''h', 'L''Auberlac''h', 'Plougastel-Daoulas', 48.3382523, -4.4144926, '2026-11-24T09:00:00.000Z', 90, 12, 'Yann Quéméner', 'Gants, sac personnel si possible', 'a_venir', '2026-09-18T10:00:00.000Z'),
  ('6d7d7691-707e-4acb-a82b-332fd4845754', 'Nettoyage du port de commerce', 'Port de commerce (Le Polder)', 'Brest', 48.385355, -4.4766421, '2026-12-18T14:30:00.000Z', 120, 18, 'Kelig Ar Floc''h', 'Gants, chasuble si vous en avez', 'a_venir', '2026-09-19T10:00:00.000Z'),
  ('80ce484f-1ba5-4945-825d-670aa6e8955d', 'Collecte du Passage', 'Le Passage', 'Le Relecq-Kerhuon', 48.3960965, -4.3816047, '2026-10-10T07:30:00.000Z', 120, 20, 'Kelig Ar Floc''h', 'Gants et sacs fournis', 'terminee', '2026-09-01T10:00:00.000Z'),
  ('0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Grand nettoyage de la plage du Minou', 'Plage du Minou', 'Plouzané', 48.3394703, -4.6157574, '2026-11-07T09:00:00.000Z', 150, 20, 'Enora Le Bris', 'Gants, sacs, bottes conseillées', 'terminee', '2026-09-10T10:00:00.000Z');

insert into inscriptions (id, collecte_id, prenom, email, created_at) values
  ('314fa64b-78aa-4d06-abdb-4cf692808d3c', 'c17ada8f-3bfc-4eec-8d81-00fe5d95bede', 'Kaïna', 'kaina.etudiante@example.fr', '2026-09-20T08:00:00.000Z'),
  ('a4a625db-8620-4a1c-957e-4e0f27d13116', 'c17ada8f-3bfc-4eec-8d81-00fe5d95bede', 'Loïc', 'loic.m@example.fr', '2026-09-20T09:00:00.000Z'),
  ('c089fa59-390c-4732-ab39-3b198b09a853', 'c17ada8f-3bfc-4eec-8d81-00fe5d95bede', 'Maëlys', 'maelys.k@example.fr', '2026-09-21T10:00:00.000Z'),
  ('67c23f1f-4105-46fd-ada1-a2b4d109ec5e', 'c17ada8f-3bfc-4eec-8d81-00fe5d95bede', 'Tangi', 'tangi.b@example.fr', '2026-09-21T11:00:00.000Z'),
  ('cbb43cbc-d69a-4e39-b30a-ded113dd0dac', 'c17ada8f-3bfc-4eec-8d81-00fe5d95bede', 'Anaïs', 'anais.d@example.fr', '2026-09-22T12:00:00.000Z'),
  ('b2cae676-cee6-4fee-9c5c-1fd35bd6a608', 'c17ada8f-3bfc-4eec-8d81-00fe5d95bede', 'Youenn', 'youenn.l@example.fr', '2026-09-22T13:00:00.000Z'),
  ('cc314beb-6408-49e1-b87c-1b24a49e32aa', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Camille', 'camille.r@example.fr', '2026-09-23T08:00:00.000Z'),
  ('3c11178c-3b02-4a51-94f1-94501e8ef25d', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Erwan', 'erwan.g@example.fr', '2026-09-23T09:00:00.000Z'),
  ('7e7c493f-56b3-4fb5-9e5d-c2cbe6b6dde7', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Gwenn', 'gwenn.p@example.fr', '2026-09-23T10:00:00.000Z'),
  ('2130d1a1-fddd-4fb5-9757-73a9fb2c5313', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Soazig', 'soazig.h@example.fr', '2026-09-23T11:00:00.000Z'),
  ('d41ab773-3301-46e1-9178-976b7ccd20a2', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Ewen', 'ewen.t@example.fr', '2026-09-24T08:00:00.000Z'),
  ('63cf0e04-7d00-416d-bec1-3e0a2e2881f5', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Perrine', 'perrine.v@example.fr', '2026-09-24T09:00:00.000Z'),
  ('8eef8a13-6d9c-41fa-809a-dffa919606ec', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Mathéo', 'matheo.n@example.fr', '2026-09-24T10:00:00.000Z'),
  ('7b179d86-0e00-4ab9-a1f8-c69010a8219c', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Lou', 'lou.f@example.fr', '2026-09-24T11:00:00.000Z'),
  ('3754a7fa-4ff6-46aa-b6bc-ce5fc0cc986a', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Ronan', 'ronan.c@example.fr', '2026-09-25T08:00:00.000Z'),
  ('cc03be3a-f64d-4873-b611-0d0739318650', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Awen', 'awen.s@example.fr', '2026-09-25T09:00:00.000Z'),
  ('3854e65e-2991-47b0-8d26-3654dbfce78b', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Lilou', 'lilou.j@example.fr', '2026-09-25T10:00:00.000Z'),
  ('3b690953-151c-4851-8b3e-a4e85c4fdf7a', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Jade', 'jade.m@example.fr', '2026-09-25T11:00:00.000Z'),
  ('f202abb5-b86d-4976-b32d-e1526b12a3b3', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Noa', 'noa.d@example.fr', '2026-09-26T08:00:00.000Z'),
  ('ca4807d7-e431-4e73-9cee-33e7ca49ac7b', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Ambre', 'ambre.q@example.fr', '2026-09-26T09:00:00.000Z'),
  ('5b9e110a-1433-41a7-b427-656ac928eacf', '936a6a20-8171-493a-b351-8d2475dae5e3', 'Gurvan', 'gurvan.a@example.fr', '2026-09-26T10:00:00.000Z'),
  ('1b9160b4-ccc4-4287-819c-160052f136c1', 'd05dcc71-e1f5-4572-b9fb-e2265fc05b9b', 'Ilan', 'ilan.r@example.fr', '2026-09-27T08:00:00.000Z'),
  ('3fdeb5b1-2c22-4f15-89f1-625eecd4a4a6', 'd05dcc71-e1f5-4572-b9fb-e2265fc05b9b', 'Nolwenn', 'nolwenn.b@example.fr', '2026-09-27T09:00:00.000Z'),
  ('d2f335af-eab4-4631-8677-b64dbc6d88d2', 'd05dcc71-e1f5-4572-b9fb-e2265fc05b9b', 'Corentin', 'corentin.g@example.fr', '2026-09-27T10:00:00.000Z'),
  ('ec758189-8064-4b14-90ba-09dae2ff88eb', '6d7d7691-707e-4acb-a82b-332fd4845754', 'Jean', 'jean.po@example.fr', '2026-09-28T08:00:00.000Z'),
  ('f56188c1-8d8b-47da-9044-8913b3c23486', '6d7d7691-707e-4acb-a82b-332fd4845754', 'Gaspard', 'gaspard.l@example.fr', '2026-09-28T09:00:00.000Z'),
  ('d05e0b74-667d-4523-ae57-b0033aeac9ae', '80ce484f-1ba5-4945-825d-670aa6e8955d', 'Gwenn', 'gwenn.a@example.fr', '2026-10-01T08:00:00.000Z'),
  ('33dbfd66-8a5a-450f-89fe-245aec16ed8a', '80ce484f-1ba5-4945-825d-670aa6e8955d', 'Loïc', 'loic.p@example.fr', '2026-10-01T09:00:00.000Z'),
  ('ff625c2e-a2d3-4f77-be5e-399c2750460f', '80ce484f-1ba5-4945-825d-670aa6e8955d', 'Maëlys', 'maelys.r@example.fr', '2026-10-02T08:00:00.000Z'),
  ('93cbabeb-a079-4d54-88e0-b9c5d22e68f7', '80ce484f-1ba5-4945-825d-670aa6e8955d', 'Tangi', 'tangi.v@example.fr', '2026-10-02T09:00:00.000Z'),
  ('c543d083-19ff-4e58-bd76-8e740bb8806c', '80ce484f-1ba5-4945-825d-670aa6e8955d', 'Anaïs', 'anais.k@example.fr', '2026-10-03T08:00:00.000Z'),
  ('9ee26832-4e2c-4007-bf33-36cb25917c9f', '80ce484f-1ba5-4945-825d-670aa6e8955d', 'Youenn', 'youenn.d@example.fr', '2026-10-03T09:00:00.000Z'),
  ('3e20427b-1090-48d9-ac5a-15161fc0063d', '80ce484f-1ba5-4945-825d-670aa6e8955d', 'Camille', 'camille.b@example.fr', '2026-10-04T08:00:00.000Z'),
  ('904719c6-5730-451d-b720-aa1f5d151154', '80ce484f-1ba5-4945-825d-670aa6e8955d', 'Erwan', 'erwan.m@example.fr', '2026-10-04T09:00:00.000Z'),
  ('dc49bc08-8595-4400-864e-709e988a91d3', '80ce484f-1ba5-4945-825d-670aa6e8955d', 'Kaïna', 'kaina.s@example.fr', '2026-10-05T08:00:00.000Z'),
  ('5cbd1926-0835-44a8-9851-f75080b596d0', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Kelig', 'kelig.a@example.fr', '2026-10-20T08:00:00.000Z'),
  ('06f909fa-98b1-4cec-be98-202d9bd668cf', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Soazig', 'soazig.l@example.fr', '2026-10-20T09:00:00.000Z'),
  ('553b1c5a-e042-4938-a7ae-c62fc7c2cb04', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Ewen', 'ewen.r@example.fr', '2026-10-21T08:00:00.000Z'),
  ('03b5e06f-3e6f-4146-82a2-609f58f18756', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Perrine', 'perrine.k@example.fr', '2026-10-21T09:00:00.000Z'),
  ('610124ff-f758-4011-8415-2250f23c946f', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Mathéo', 'matheo.b@example.fr', '2026-10-22T08:00:00.000Z'),
  ('f3699a39-f928-444c-b022-9c65b31e9554', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Lou', 'lou.v@example.fr', '2026-10-22T09:00:00.000Z'),
  ('2387fcf2-29dd-45af-a07b-3d778c4c9d95', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Ronan', 'ronan.d@example.fr', '2026-10-23T08:00:00.000Z'),
  ('a0d83f9f-6081-417b-b884-e3b7e85fcde9', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Awen', 'awen.m@example.fr', '2026-10-23T09:00:00.000Z'),
  ('24b58fd5-2e5b-4fc6-8c3f-579893fc0934', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Lilou', 'lilou.c@example.fr', '2026-10-24T08:00:00.000Z'),
  ('85e76d09-23b2-4339-a0df-36817e9d769a', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Jade', 'jade.s@example.fr', '2026-10-24T09:00:00.000Z'),
  ('a7a49be0-0fd0-4afd-a2b0-3b204b002d84', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Noa', 'noa.j@example.fr', '2026-10-25T08:00:00.000Z'),
  ('ff4b1889-94d7-4f12-9171-2a1e73d6cf17', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Ambre', 'ambre.n@example.fr', '2026-10-25T09:00:00.000Z'),
  ('033ba5ee-3357-43f1-90d2-6361189e731a', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Gurvan', 'gurvan.t@example.fr', '2026-10-26T08:00:00.000Z'),
  ('67f75051-1b93-4733-8956-b08f4f53b3a7', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 'Ilan', 'ilan.f@example.fr', '2026-10-26T09:00:00.000Z');

insert into bilans (id, collecte_id, kg, sacs, participants, created_at) values
  ('352a9c09-2f85-4f5a-8a90-a829245f628c', '80ce484f-1ba5-4945-825d-670aa6e8955d', 12, 3, 9, '2026-10-10T11:00:00.000Z'),
  ('b9cfa793-2c82-4e9b-a9d2-763d2d7f1563', '0aa09105-7fdf-4f42-b9d1-c777bfaddac6', 31, 7, 14, '2026-11-07T13:00:00.000Z');

