-- Lezoro'a: amigos, trocas de itens e XP dos desafios.
-- Rode uma vez no Supabase (SQL Editor > New query > Run), depois do schema.sql.

-- Perfil público: nome, código de amigo e XP. Qualquer pessoa logada lê (ranking e busca por código);
-- ninguém escreve direto, só pelas funções abaixo, para o XP não ser editado na mão.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  code text not null unique,
  xp int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "perfis visíveis para quem está logado" on public.profiles
  for select to authenticated using (true);

create or replace function public.ensure_profile(p_name text) returns public.profiles
language plpgsql security definer set search_path = public as $$
declare r profiles; c text; n text := coalesce(nullif(left(trim(p_name), 40), ''), 'Amigo');
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into r from profiles where id = auth.uid();
  if found then return r; end if;
  loop
    c := (select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 32)::int, 1), '') from generate_series(1, 6));
    begin
      insert into profiles (id, name, code) values (auth.uid(), n, c) on conflict (id) do nothing returning * into r;
      if r.id is null then select * into r from profiles where id = auth.uid(); end if;
      return r;
    exception when unique_violation then
      -- código repetido: sorteia outro
    end;
  end loop;
end $$;

-- Amizade: uma linha por par (a < b), criada na hora por código ou QR.
create table if not exists public.friendships (
  a uuid not null references public.profiles (id) on delete cascade,
  b uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (a, b),
  check (a < b)
);
alter table public.friendships enable row level security;
create policy "ver as próprias amizades" on public.friendships
  for select using (auth.uid() in (a, b));
create policy "desfazer amizade" on public.friendships
  for delete using (auth.uid() in (a, b));

create or replace function public.add_friend(p_code text) returns public.profiles
language plpgsql security definer set search_path = public as $$
declare f profiles;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into f from profiles where code = upper(trim(p_code));
  if not found then raise exception 'codigo nao encontrado'; end if;
  if f.id = auth.uid() then raise exception 'proprio codigo'; end if;
  insert into friendships (a, b) values (least(auth.uid(), f.id), greatest(auth.uid(), f.id)) on conflict do nothing;
  return f;
end $$;

-- Trocas: quem propõe já tirou o item do inventário (fica "em garantia" aqui).
-- Quem recebe aceita ou recusa; depois quem propôs resgata o item pedido (aceita) ou o próprio item de volta.
create table if not exists public.trades (
  id bigint generated always as identity primary key,
  from_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  to_id uuid not null references public.profiles (id) on delete cascade,
  give text not null check (char_length(give) <= 30),
  want text check (char_length(want) <= 30),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  claimed boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.trades enable row level security;
create policy "ver as próprias trocas" on public.trades
  for select using (auth.uid() in (from_id, to_id));
create policy "propor troca para amigo" on public.trades
  for insert with check (
    from_id = auth.uid() and status = 'pending' and not claimed
    and exists (select 1 from public.friendships where a = least(from_id, to_id) and b = greatest(from_id, to_id))
  );

create or replace function public.trade_step(p_id bigint, p_action text) returns public.trades
language plpgsql security definer set search_path = public as $$
declare r trades;
begin
  if p_action in ('accept', 'decline') then
    update trades set status = case p_action when 'accept' then 'accepted' else 'declined' end
      where id = p_id and to_id = auth.uid() and status = 'pending' returning * into r;
  elsif p_action = 'cancel' then
    update trades set status = 'cancelled' where id = p_id and from_id = auth.uid() and status = 'pending' returning * into r;
  elsif p_action = 'claim' then
    update trades set claimed = true where id = p_id and from_id = auth.uid() and status <> 'pending' and not claimed returning * into r;
  end if;
  return r;
end $$;

-- XP dos desafios: no máximo 50 por partida e uma vez só por pessoa em cada partida.
create table if not exists public.xp_awards (
  user_id uuid not null references public.profiles (id) on delete cascade,
  room text not null,
  amount int not null,
  created_at timestamptz not null default now(),
  primary key (user_id, room)
);
alter table public.xp_awards enable row level security;

create or replace function public.award_xp(p_room text, p_amount int) returns int
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if p_amount not between 1 and 50 then raise exception 'xp invalido'; end if;
  insert into xp_awards (user_id, room, amount) values (auth.uid(), left(p_room, 40), p_amount) on conflict do nothing;
  if found then update profiles set xp = xp + p_amount where id = auth.uid(); end if;
  return (select xp from profiles where id = auth.uid());
end $$;
