-- Truma Academy database schema
-- Run this in the Supabase SQL editor: Dashboard > SQL Editor > New query

create table if not exists truma_sessions (
  id             uuid primary key default gen_random_uuid(),
  session_date   date not null,
  subject        text not null,    -- 'math','fractions','words','grammar','vocab','history','science','tutor'
  mode           text not null,    -- 'practice','drill','chat'
  score          int  not null default 0,
  total          int  not null default 1,
  xp_earned      int  not null default 0,
  stars_earned   int  not null default 0,
  topics_covered text[] not null default '{}',
  created_at     timestamptz default now()
);

create index if not exists truma_sessions_date_idx
  on truma_sessions (session_date desc);

create index if not exists truma_sessions_subject_idx
  on truma_sessions (subject);

alter table truma_sessions enable row level security;
-- No SELECT/INSERT policies — all access goes through the service role key in API routes.
