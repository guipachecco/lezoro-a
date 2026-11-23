-- Lezoro'a: rode uma vez no Supabase (SQL Editor > New query > Run).
-- Cada usuário tem uma linha com o próprio progresso; RLS garante que ninguém lê ou altera o de outra pessoa.

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "ler o próprio progresso" on public.progress
  for select using (auth.uid() = user_id);

create policy "criar o próprio progresso" on public.progress
  for insert with check (auth.uid() = user_id);

create policy "atualizar o próprio progresso" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
