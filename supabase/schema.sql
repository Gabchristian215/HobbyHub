-- HobbyHub database schema. Run this in the Supabase SQL editor on a new project.

create table public.posts (
  id bigint generated always as identity primary key,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  content text,
  image_url text,
  upvotes integer not null default 0 check (upvotes >= 0),
  author_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts(id) on delete cascade,
  content text not null check (char_length(btrim(content)) > 0),
  author_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index comments_post_id_idx on public.comments(post_id);
create index posts_created_at_idx on public.posts(created_at desc);
create index posts_upvotes_idx on public.posts(upvotes desc);

-- No login in this app: anyone with the public key can read and write.
alter table public.posts enable row level security;
alter table public.comments enable row level security;

create policy "Public read posts" on public.posts for select to anon, authenticated using (true);
create policy "Public insert posts" on public.posts for insert to anon, authenticated with check (true);
create policy "Public update posts" on public.posts for update to anon, authenticated using (true) with check (true);
create policy "Public delete posts" on public.posts for delete to anon, authenticated using (true);

create policy "Public read comments" on public.comments for select to anon, authenticated using (true);
create policy "Public insert comments" on public.comments for insert to anon, authenticated with check (true);
create policy "Public update comments" on public.comments for update to anon, authenticated using (true) with check (true);
create policy "Public delete comments" on public.comments for delete to anon, authenticated using (true);

-- Atomic upvote so simultaneous clicks are never lost.
create or replace function public.increment_post_upvotes(target_post_id bigint)
returns setof public.posts
language sql
security invoker
set search_path = ''
as $$
  update public.posts
     set upvotes = upvotes + 1
   where id = target_post_id
  returning *;
$$;

grant execute on function public.increment_post_upvotes(bigint) to anon, authenticated;
