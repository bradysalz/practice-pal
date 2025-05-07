-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Profiles table (1:1 with auth.users)
create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text not null,
    hash text,
    salt text,
    created_at timestamp with time zone default timezone('utc', now()) not null,
    updated_at timestamp with time zone default timezone('utc', now()) not null
);

-- Artists
create table if not exists artists (
    id serial primary key,
    name text not null,
    created_by uuid not null references profiles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc', now()) not null,
    updated_at timestamp with time zone default timezone('utc', now()) not null
);

-- Songs
create table if not exists songs (
    id serial primary key,
    artist_id integer references artists(id) on delete set null,
    name text not null,
    created_by uuid not null references profiles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc', now()) not null,
    updated_at timestamp with time zone default timezone('utc', now()) not null
);

-- Books
create table if not exists books (
    id serial primary key,
    name text not null,
    created_by uuid not null references profiles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc', now()) not null,
    updated_at timestamp with time zone default timezone('utc', now()) not null
);

-- Sections
create table if not exists sections (
    id serial primary key,
    book_id integer references books(id) on delete set null,
    section text not null,
    created_by uuid not null references profiles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc', now()) not null,
    updated_at timestamp with time zone default timezone('utc', now()) not null
);

-- Exercises
create table if not exists exercises (
    id serial primary key,
    section_id integer references sections(id) on delete set null,
    name text,
    exercise integer,
    filepath text,
    created_by uuid not null references profiles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc', now()) not null,
    updated_at timestamp with time zone default timezone('utc', now()) not null
);

-- Practices
create table if not exists practices (
    id serial primary key,
    profile_id uuid not null references profiles(id) on delete cascade,
    exercise_id integer references exercises(id) on delete set null,
    song_id integer references songs(id) on delete set null,
    done_at date not null,
    tempo integer,
    note text,
    created_by uuid not null references profiles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc', now()) not null,
    updated_at timestamp with time zone default timezone('utc', now()) not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table artists enable row level security;
alter table songs enable row level security;
alter table books enable row level security;
alter table sections enable row level security;
alter table exercises enable row level security;
alter table practices enable row level security;

-- Policies

-- Profiles: only access your own
create policy "Profiles: self-access only"
    on profiles for all
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Generic ownership-based policy template
create policy "Artists: owner access"
    on artists for all
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

create policy "Songs: owner access"
    on songs for all
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

create policy "Books: owner access"
    on books for all
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

create policy "Sections: owner access"
    on sections for all
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

create policy "Exercises: owner access"
    on exercises for all
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

create policy "Practices: owner access"
    on practices for all
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

-- Triggers

-- Create a reusable trigger function
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$ language plpgsql;

do $$
declare
    tbl text;
    tbls text[] := array[
        'profiles',
        'artists',
        'songs',
        'books',
        'sections',
        'exercises',
        'practices'
    ];
begin
    foreach tbl in array tbls loop
        execute format(
            'drop trigger if exists set_updated_at on %I; create trigger set_updated_at before update on %I for each row execute function set_updated_at();',
            tbl, tbl
        );
    end loop;
end $$;
