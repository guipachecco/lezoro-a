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

-- Lembretes: um registro por aparelho que ligou o lembrete diário.
create table if not exists public.push_subscriptions (
  endpoint text primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  p256dh text not null,
  auth text not null,
  remind_at text not null check (remind_at ~ '^[0-2][0-9]:[0-5][0-9]$'),
  tz text not null default 'America/Sao_Paulo',
  last_sent date,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

create policy "ver os próprios lembretes" on public.push_subscriptions
  for select using (auth.uid() = user_id);
create policy "criar os próprios lembretes" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy "mudar os próprios lembretes" on public.push_subscriptions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "apagar os próprios lembretes" on public.push_subscriptions
  for delete using (auth.uid() = user_id);

-- Chama a função "lembretes" a cada 15 minutos.
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.schedule('lezoroa-lembretes', '*/15 * * * *', $$
  select net.http_post(
    url := 'https://nebovfscwlfjraozbggh.supabase.co/functions/v1/lembretes',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  )
$$);
