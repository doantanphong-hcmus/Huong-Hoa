create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 120),
  role text not null default 'Thành viên',
  generation smallint not null check (generation between 1 and 20),
  birth_year smallint,
  death_year smallint,
  southern_rank text,
  father_id uuid,
  mother_id uuid,
  spouse_id uuid,
  unique (id, owner_id),
  foreign key (father_id, owner_id) references public.family_members(id, owner_id),
  foreign key (mother_id, owner_id) references public.family_members(id, owner_id),
  foreign key (spouse_id, owner_id) references public.family_members(id, owner_id),
  check (death_year is null or birth_year is null or death_year >= birth_year),
  check (father_id is distinct from id and mother_id is distinct from id and spouse_id is distinct from id)
);

create index family_members_owner_generation_idx on public.family_members(owner_id, generation);

create table public.deceased_profiles (
  member_id uuid primary key,
  owner_id uuid not null default auth.uid(),
  lunar_day smallint check (lunar_day between 1 and 30),
  lunar_month smallint check (lunar_month between 1 and 12),
  default_worship_time time not null default '10:00',
  notes text not null default '',
  foreign key (member_id, owner_id) references public.family_members(id, owner_id) on delete cascade
);

create table public.favorite_foods (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null,
  owner_id uuid not null default auth.uid(),
  name text not null check (length(trim(name)) between 1 and 100),
  foreign key (member_id, owner_id) references public.family_members(id, owner_id) on delete cascade,
  unique (member_id, name)
);

create index favorite_foods_owner_member_idx on public.favorite_foods(owner_id, member_id);

alter table public.family_members enable row level security;
alter table public.deceased_profiles enable row level security;
alter table public.favorite_foods enable row level security;

revoke all on public.family_members, public.deceased_profiles, public.favorite_foods from anon, authenticated;
grant select on public.family_members, public.deceased_profiles, public.favorite_foods to authenticated;

create policy family_members_select on public.family_members for select to authenticated using ((select auth.uid()) = owner_id);
create policy deceased_profiles_select on public.deceased_profiles for select to authenticated using ((select auth.uid()) = owner_id);
create policy favorite_foods_select on public.favorite_foods for select to authenticated using ((select auth.uid()) = owner_id);

create or replace function public.seed_mvp_family()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner uuid := auth.uid();
  ancestor uuid := gen_random_uuid();
  sen uuid := gen_random_uuid();
  hai uuid := gen_random_uuid();
  mai uuid := gen_random_uuid();
  ba uuid := gen_random_uuid();
  tu uuid := gen_random_uuid();
  lien uuid := gen_random_uuid();
  khang uuid := gen_random_uuid();
  phong uuid := gen_random_uuid();
  huong uuid := gen_random_uuid();
  bao uuid := gen_random_uuid();
begin
  if owner is null then raise exception 'Authentication required'; end if;
  perform pg_advisory_xact_lock(hashtextextended(owner::text, 0));
  if exists (select 1 from public.family_members where owner_id = owner) then return; end if;

  insert into public.family_members (id, owner_id, name, role, generation, birth_year, death_year, southern_rank, father_id, mother_id) values
    (ancestor, owner, 'Đoàn Văn An', 'Thủy tổ', 1, 1918, 1996, null, null, null),
    (sen, owner, 'Nguyễn Thị Sen', 'Thủy tổ', 1, 1922, 2004, null, null, null),
    (hai, owner, 'Đoàn Văn Hải', 'Trưởng nam', 2, 1945, 2019, 'Hai', ancestor, sen),
    (mai, owner, 'Lê Thị Mai', 'Hôn phối', 2, 1948, null, null, null, null),
    (ba, owner, 'Đoàn Thị Ba', 'Trưởng nữ', 2, 1950, null, 'Ba', ancestor, sen),
    (tu, owner, 'Đoàn Văn Tư', 'Thứ nam', 2, 1954, null, 'Tư', ancestor, sen),
    (lien, owner, 'Phạm Thị Liên', 'Hôn phối', 2, 1956, null, null, null, null),
    (khang, owner, 'Đoàn Minh Khang', 'Con trưởng', 3, 1974, null, 'Hai', hai, mai),
    (phong, owner, 'Đoàn Tấn Phong', 'Thành viên', 4, 1998, null, null, khang, null),
    (huong, owner, 'Đoàn Thu Hương', 'Thành viên', 4, 2001, null, null, khang, null),
    (bao, owner, 'Đoàn Gia Bảo', 'Thành viên', 3, 2005, null, null, tu, lien);

  update public.family_members set spouse_id = case id
    when ancestor then sen when sen then ancestor
    when hai then mai when mai then hai
    when tu then lien when lien then tu
    else null end
  where owner_id = owner and id in (ancestor, sen, hai, mai, tu, lien);

  insert into public.deceased_profiles (member_id, owner_id, lunar_day, lunar_month, default_worship_time) values
    (ancestor, owner, null, null, '10:00'),
    (sen, owner, 26, 9, '10:00'),
    (hai, owner, null, null, '10:00');

  insert into public.favorite_foods (member_id, owner_id, name) values
    (ancestor, owner, 'Bánh tét'),
    (sen, owner, 'Chè trôi nước'),
    (hai, owner, 'Canh khổ qua');
end;
$$;

create or replace function public.save_family_member(
  p_id uuid, p_name text, p_role text, p_generation smallint,
  p_birth_year smallint, p_death_year smallint, p_southern_rank text,
  p_father_id uuid, p_mother_id uuid, p_spouse_id uuid,
  p_lunar_day smallint, p_lunar_month smallint, p_worship_time time,
  p_favorite_foods text[]
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner uuid := auth.uid();
  saved_id uuid := coalesce(p_id, gen_random_uuid());
  food text;
begin
  if owner is null then raise exception 'Authentication required'; end if;
  if nullif(trim(p_name), '') is null or length(trim(p_name)) > 120 then raise exception 'Invalid name'; end if;
  if p_generation not between 1 and 20 then raise exception 'Invalid generation'; end if;
  if p_death_year is null and (p_lunar_day is not null or p_lunar_month is not null) then
    raise exception 'Memorial date requires a deceased member';
  end if;
  if p_id is not null and not exists (select 1 from public.family_members where id = p_id and owner_id = owner) then
    raise exception 'Member not found';
  end if;
  if p_father_id = saved_id or p_mother_id = saved_id or p_spouse_id = saved_id then raise exception 'Self relationship is invalid'; end if;

  insert into public.family_members (id, owner_id, name, role, generation, birth_year, death_year, southern_rank, father_id, mother_id, spouse_id)
  values (saved_id, owner, trim(p_name), coalesce(nullif(trim(p_role), ''), 'Thành viên'), p_generation,
    p_birth_year, p_death_year, nullif(trim(p_southern_rank), ''), p_father_id, p_mother_id, p_spouse_id)
  on conflict (id) do update set
    name = excluded.name, role = excluded.role, generation = excluded.generation,
    birth_year = excluded.birth_year, death_year = excluded.death_year,
    southern_rank = excluded.southern_rank, father_id = excluded.father_id,
    mother_id = excluded.mother_id, spouse_id = excluded.spouse_id;

  update public.family_members set spouse_id = null where owner_id = owner and spouse_id = saved_id and id is distinct from p_spouse_id;
  if p_spouse_id is not null then
    update public.family_members set spouse_id = null where owner_id = owner and spouse_id = p_spouse_id and id <> saved_id;
    update public.family_members set spouse_id = saved_id where owner_id = owner and id = p_spouse_id;
  end if;

  if p_death_year is null then
    delete from public.deceased_profiles where member_id = saved_id and owner_id = owner;
  else
    insert into public.deceased_profiles (member_id, owner_id, lunar_day, lunar_month, default_worship_time)
    values (saved_id, owner, p_lunar_day, p_lunar_month, coalesce(p_worship_time, '10:00'))
    on conflict (member_id) do update set lunar_day = excluded.lunar_day,
      lunar_month = excluded.lunar_month, default_worship_time = excluded.default_worship_time;
  end if;

  delete from public.favorite_foods where member_id = saved_id and owner_id = owner;
  foreach food in array coalesce(p_favorite_foods, array[]::text[]) loop
    if length(trim(food)) between 1 and 100 then
      insert into public.favorite_foods (member_id, owner_id, name) values (saved_id, owner, trim(food)) on conflict do nothing;
    end if;
  end loop;
  return saved_id;
end;
$$;

revoke all on function public.seed_mvp_family() from public;
revoke all on function public.save_family_member(uuid,text,text,smallint,smallint,smallint,text,uuid,uuid,uuid,smallint,smallint,time,text[]) from public;
grant execute on function public.seed_mvp_family() to authenticated;
grant execute on function public.save_family_member(uuid,text,text,smallint,smallint,smallint,text,uuid,uuid,uuid,smallint,smallint,time,text[]) to authenticated;
