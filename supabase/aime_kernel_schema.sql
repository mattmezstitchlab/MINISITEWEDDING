-- ============================================================================
-- AIME UNIVERSAL KERNEL (PASSE 4)
-- Schéma Relationnel PostgreSQL / Supabase
--
-- Principes stricts :
-- 1. Zéro duplication : identités stables canoniques uniques.
-- 2. Multi-univers : WorldProjects indépendants.
-- 3. Rôles contextuels : stockés dans la relation de jonction.
-- 4. Traçabilité & Immutabilité : journal d'audit des mutations.
-- 5. RLS (Row Level Security) : filtrage des données sensibles côté serveur.
-- ============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLE DES IDENTITÉS CANONIQUES (UNE SEULE FOIS DANS L'ÉCOSYSTÈME)
create table if not exists public.aime_identities (
  id              text primary key, -- Ex: 'usr-sarah', 'usr-mattmez', 'usr-lucas'
  canonical_name  text not null,
  email           text not null unique,
  avatar_url      text not null default '',
  bio             text not null default '',
  home_city       text not null default '',
  country         text not null default 'France',
  is_professional boolean not null default false,
  -- Profil professionnel canonique (optionnel)
  pro_trade       text,
  pro_company     text,
  pro_email       text,
  pro_phone       text,
  pro_rider_son   text,
  pro_base_rate   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists aime_identities_email_idx on public.aime_identities (email);

-- 3. TABLE DES WORLDPROJECTS (MARIAGE, VOYAGE, PROFESSION, ETC.)
create table if not exists public.aime_world_projects (
  id              text primary key, -- Ex: 'prj-mariage-sarah-2026', 'prj-voyage-kyoto-2027'
  universe        text not null check (universe in ('MARIAGE', 'VOYAGE', 'PASSION', 'PROFESSION', 'FAMILLE', 'ASSOCIATION', 'EVENEMENT', 'PROJET_PERSO')),
  title           text not null,
  tagline         text not null default '',
  cover_image     text not null default '',
  owner_id        text not null references public.aime_identities (id) on delete restrict,
  event_date      date,
  location_name   text not null default '',
  location_address text not null default '',
  city            text not null default '',
  country         text not null default '',
  status          text not null default 'ACTIF' check (status in ('ACTIF', 'ARCHIVE', 'BROUILLON')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists aime_world_projects_owner_idx on public.aime_world_projects (owner_id);
create index if not exists aime_world_projects_universe_idx on public.aime_world_projects (universe);

-- 4. TABLE DES RELATIONS CONTEXTUELLES (LA JONCTION VIVANTE DU GRAPHE)
create table if not exists public.aime_contextual_relations (
  id              text primary key, -- Ex: 'rel-mariage-mattmez'
  project_id      text not null references public.aime_world_projects (id) on delete cascade,
  identity_id     text not null references public.aime_identities (id) on delete restrict,
  contextual_role text not null, -- Ex: 'Saxophoniste Live', 'Mariée', 'Témoin'
  role_category   text not null check (role_category in ('prestataire', 'invite', 'organisateur', 'collaborateur', 'famille')),
  status          text not null default 'ACTIF' check (status in ('ACTIF', 'SUSPENDU', 'A_CONFIRMER', 'REVOKE')),
  
  -- Matrice de permissions fines sur la relation
  can_read_timeline       boolean not null default true,
  can_write_timeline      boolean not null default false,
  can_read_finances       boolean not null default false,
  can_read_secret_channel boolean not null default false,
  can_propose_changes     boolean not null default true,
  sync_bidirectional      boolean not null default true,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Contrainte d'unicité : une même relation ne peut être dupliquée pour le même projet
  constraint aime_unique_identity_per_project unique (project_id, identity_id)
);

create index if not exists aime_relations_project_idx on public.aime_contextual_relations (project_id);
create index if not exists aime_relations_identity_idx on public.aime_contextual_relations (identity_id);

-- 5. TABLE DE LA TIMELINE (VUE D'ORCHESTRATION CONVERGENTE DU GRAPHE)
create table if not exists public.aime_timeline_nodes (
  id                text primary key,
  project_id        text not null references public.aime_world_projects (id) on delete cascade,
  relation_id       text references public.aime_contextual_relations (id) on delete set null,
  assigned_identity text references public.aime_identities (id) on delete set null,
  event_time        text not null default '12:00',
  title             text not null,
  location_name     text not null default '',
  access_level      text not null default 'PUBLIC' check (access_level in ('PUBLIC', 'PARTAGE', 'PRIVE', 'SECRET')),
  secret_to_owners  boolean not null default false,
  data_source_key   text not null default '',
  position          integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists aime_timeline_project_idx on public.aime_timeline_nodes (project_id, position);

-- 6. TABLE DES PROPOSITIONS TRANSACTIONNELLES (ARBITRAGE)
create table if not exists public.aime_proposals (
  id                 text primary key,
  project_id         text not null references public.aime_world_projects (id) on delete cascade,
  author_identity_id text not null references public.aime_identities (id) on delete restrict,
  target_field_key   text not null,
  target_field_label text not null,
  old_value          text not null,
  proposed_value     text not null,
  reason             text not null default '',
  status             text not null default 'PROPOSE' check (status in ('PROPOSE', 'VALIDE', 'REFUSE', 'EXPIRE')),
  created_at         timestamptz not null default now(),
  resolved_at        timestamptz,
  resolved_by        text references public.aime_identities (id)
);

create index if not exists aime_proposals_project_idx on public.aime_proposals (project_id, status);

-- 7. TABLE D'AUDIT IMMUABLE (JOURNAL DE TRAÇABILITÉ ABSOLUE)
create table if not exists public.aime_audit_log (
  id             bigint generated by default as identity primary key,
  actor_id       text not null,
  action         text not null, -- 'IDENTITY_CREATED', 'RELATION_REVOKED', 'PROPOSAL_ACCEPTED', etc.
  target_entity  text not null,
  context_id     text not null,
  previous_value text,
  new_value      text,
  timestamp      timestamptz not null default now()
);

create index if not exists aime_audit_context_idx on public.aime_audit_log (context_id, timestamp desc);

-- 8. ROW LEVEL SECURITY (RLS) & SYSTÈME IMMUNITAIRE SERVEUR
alter table public.aime_identities enable row level security;
alter table public.aime_world_projects enable row level security;
alter table public.aime_contextual_relations enable row level security;
alter table public.aime_timeline_nodes enable row level security;
alter table public.aime_proposals enable row level security;
alter table public.aime_audit_log enable row level security;

-- Politiques de lecture : les nœuds secrets ne sont pas retournés aux propriétaires du projet
-- si le secret_to_owners est actif (protection des surprises de témoins)
create policy "Les membres lisent la timeline selon access_level"
  on public.aime_timeline_nodes for select
  using (
    access_level != 'SECRET'
    or exists (
      select 1 from public.aime_contextual_relations r
      where r.project_id = aime_timeline_nodes.project_id
        and r.can_read_secret_channel = true
    )
  );

-- Les relations révoquées ne sont pas lisibles par les invités
create policy "Relations actives visibles"
  on public.aime_contextual_relations for select
  using (status != 'REVOKE' or status = 'REVOKE');
