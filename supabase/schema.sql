-- InsPlace 커뮤니티 스키마
-- Supabase SQL Editor에서 실행하세요

-- 1. 프로필 테이블
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  nickname text not null default '',
  avatar_url text,
  points integer not null default 0,
  post_count integer not null default 0,
  comment_count integer not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "프로필 공개 읽기" on profiles for select using (true);
create policy "본인 프로필 수정" on profiles for update using (auth.uid() = id);

-- 새 유저 가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nickname, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. 게시글 테이블
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  category text not null default 'free' check (category in ('free', 'review', 'info', 'question')),
  like_count integer not null default 0,
  comment_count integer not null default 0,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table posts enable row level security;
create policy "게시글 공개 읽기" on posts for select using (true);
create policy "로그인 유저 글작성" on posts for insert with check (auth.uid() = author_id);
create policy "본인 글 수정" on posts for update using (auth.uid() = author_id);
create policy "본인 글 삭제" on posts for delete using (auth.uid() = author_id);

create index idx_posts_created on posts(created_at desc);
create index idx_posts_category on posts(category);

-- 3. 댓글 테이블
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table comments enable row level security;
create policy "댓글 공개 읽기" on comments for select using (true);
create policy "로그인 유저 댓글작성" on comments for insert with check (auth.uid() = author_id);
create policy "본인 댓글 삭제" on comments for delete using (auth.uid() = author_id);

create index idx_comments_post on comments(post_id, created_at);

-- 4. 좋아요 테이블
create table if not exists likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

alter table likes enable row level security;
create policy "좋아요 읽기" on likes for select using (true);
create policy "좋아요 추가" on likes for insert with check (auth.uid() = user_id);
create policy "좋아요 취소" on likes for delete using (auth.uid() = user_id);

-- 5. 리뷰 (별점) 테이블
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  target_type text not null check (target_type in ('ad', 'venue')),
  target_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  content text not null default '',
  created_at timestamptz not null default now(),
  unique(author_id, target_type, target_id)
);

alter table reviews enable row level security;
create policy "리뷰 공개 읽기" on reviews for select using (true);
create policy "로그인 유저 리뷰작성" on reviews for insert with check (auth.uid() = author_id);
create policy "본인 리뷰 수정" on reviews for update using (auth.uid() = author_id);
create policy "본인 리뷰 삭제" on reviews for delete using (auth.uid() = author_id);

create index idx_reviews_target on reviews(target_type, target_id);

-- 6. 포인트 업데이트 트리거 (게시글 작성 시 +10, 댓글 +5, 리뷰 +15)
create or replace function update_points_on_post()
returns trigger as $$
begin
  update profiles set
    points = points + 10,
    post_count = post_count + 1
  where id = new.author_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_post_created
  after insert on posts
  for each row execute procedure update_points_on_post();

create or replace function update_points_on_comment()
returns trigger as $$
begin
  update profiles set
    points = points + 5,
    comment_count = comment_count + 1
  where id = new.author_id;
  -- 게시글 댓글 수 업데이트
  update posts set comment_count = comment_count + 1 where id = new.post_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_comment_created
  after insert on comments
  for each row execute procedure update_points_on_comment();

create or replace function update_points_on_review()
returns trigger as $$
begin
  update profiles set
    points = points + 15,
    review_count = review_count + 1
  where id = new.author_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_review_created
  after insert on reviews
  for each row execute procedure update_points_on_review();
