drop trigger if exists "set_updated_at" on "public"."practices";

drop policy "Practices: owner access" on "public"."practices";

revoke delete on table "public"."practices" from "anon";

revoke insert on table "public"."practices" from "anon";

revoke references on table "public"."practices" from "anon";

revoke select on table "public"."practices" from "anon";

revoke trigger on table "public"."practices" from "anon";

revoke truncate on table "public"."practices" from "anon";

revoke update on table "public"."practices" from "anon";

revoke delete on table "public"."practices" from "authenticated";

revoke insert on table "public"."practices" from "authenticated";

revoke references on table "public"."practices" from "authenticated";

revoke select on table "public"."practices" from "authenticated";

revoke trigger on table "public"."practices" from "authenticated";

revoke truncate on table "public"."practices" from "authenticated";

revoke update on table "public"."practices" from "authenticated";

revoke delete on table "public"."practices" from "service_role";

revoke insert on table "public"."practices" from "service_role";

revoke references on table "public"."practices" from "service_role";

revoke select on table "public"."practices" from "service_role";

revoke trigger on table "public"."practices" from "service_role";

revoke truncate on table "public"."practices" from "service_role";

revoke update on table "public"."practices" from "service_role";

alter table "public"."practices" drop constraint "practices_created_by_fkey";

alter table "public"."practices" drop constraint "practices_exercise_id_fkey";

alter table "public"."practices" drop constraint "practices_profile_id_fkey";

alter table "public"."practices" drop constraint "practices_song_id_fkey";

alter table "public"."exercises" drop constraint "exercises_section_id_fkey";

alter table "public"."sections" drop constraint "sections_book_id_fkey";

alter table "public"."songs" drop constraint "songs_artist_id_fkey";

alter table "public"."practices" drop constraint "practices_pkey";

drop index if exists "public"."practices_pkey";

drop table "public"."practices";

create table "public"."session_items" (
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "id" uuid not null,
    "tempo" integer,
    "song_id" uuid,
    "exercise_id" uuid,
    "session_id" uuid,
    "notes" text
);


alter table "public"."session_items" enable row level security;

create table "public"."sessions" (
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "duration" integer,
    "id" uuid not null
);


alter table "public"."sessions" enable row level security;

create table "public"."setlist_items" (
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "id" uuid not null,
    "setlist_id" uuid not null default gen_random_uuid(),
    "type" text not null,
    "song_id" uuid,
    "position" smallint not null,
    "exercise_id" uuid,
    "tempo" integer not null
);


alter table "public"."setlist_items" enable row level security;

create table "public"."setlists" (
    "name" text,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "id" uuid not null
);


alter table "public"."setlists" enable row level security;

alter table "public"."artists" alter column "id" drop default;

alter table "public"."artists" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."books" alter column "id" drop default;

alter table "public"."books" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."exercises" add column "goal_tempo" integer;

alter table "public"."exercises" alter column "id" drop default;

alter table "public"."exercises" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."exercises" alter column "section_id" set data type uuid using "section_id"::uuid;

alter table "public"."sections" alter column "book_id" set default gen_random_uuid();

alter table "public"."sections" alter column "book_id" set not null;

alter table "public"."sections" alter column "book_id" set data type uuid using "book_id"::uuid;

alter table "public"."sections" alter column "id" drop default;

alter table "public"."sections" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."songs" add column "goal_tempo" integer;

alter table "public"."songs" alter column "artist_id" set default gen_random_uuid();

alter table "public"."songs" alter column "artist_id" set data type uuid using "artist_id"::uuid;

alter table "public"."songs" alter column "id" drop default;

alter table "public"."songs" alter column "id" set data type uuid using "id"::uuid;

drop sequence if exists "public"."artists_id_seq";

drop sequence if exists "public"."books_id_seq";

drop sequence if exists "public"."exercises_id_seq";

drop sequence if exists "public"."practices_id_seq";

drop sequence if exists "public"."sections_id_seq";

drop sequence if exists "public"."songs_id_seq";

CREATE UNIQUE INDEX artists_id2_key ON public.artists USING btree (id);

CREATE UNIQUE INDEX books_id2_key ON public.books USING btree (id);

CREATE UNIQUE INDEX exercises_id2_key ON public.exercises USING btree (id);

CREATE UNIQUE INDEX sections_id2_key ON public.sections USING btree (id);

CREATE UNIQUE INDEX session_items_pkey ON public.session_items USING btree (id);

CREATE UNIQUE INDEX sessions_id2_key ON public.sessions USING btree (id);

CREATE UNIQUE INDEX sessions_pkey ON public.sessions USING btree (id);

CREATE UNIQUE INDEX setlist_items_pkey ON public.setlist_items USING btree (id);

CREATE UNIQUE INDEX setlists_pkey ON public.setlists USING btree (id);

alter table "public"."session_items" add constraint "session_items_pkey" PRIMARY KEY using index "session_items_pkey";

alter table "public"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";

alter table "public"."setlist_items" add constraint "setlist_items_pkey" PRIMARY KEY using index "setlist_items_pkey";

alter table "public"."setlists" add constraint "setlists_pkey" PRIMARY KEY using index "setlists_pkey";

alter table "public"."artists" add constraint "artists_id2_key" UNIQUE using index "artists_id2_key";

alter table "public"."books" add constraint "books_id2_key" UNIQUE using index "books_id2_key";

alter table "public"."exercises" add constraint "exercises_id2_key" UNIQUE using index "exercises_id2_key";

alter table "public"."sections" add constraint "sections_id2_key" UNIQUE using index "sections_id2_key";

alter table "public"."session_items" add constraint "session_items_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."session_items" validate constraint "session_items_created_by_fkey";

alter table "public"."session_items" add constraint "session_items_exercise_id_fkey" FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."session_items" validate constraint "session_items_exercise_id_fkey";

alter table "public"."session_items" add constraint "session_items_session_id_fkey" FOREIGN KEY (session_id) REFERENCES sessions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."session_items" validate constraint "session_items_session_id_fkey";

alter table "public"."session_items" add constraint "session_items_song_id_fkey" FOREIGN KEY (song_id) REFERENCES songs(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."session_items" validate constraint "session_items_song_id_fkey";

alter table "public"."sessions" add constraint "sessions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_created_by_fkey";

alter table "public"."sessions" add constraint "sessions_id2_key" UNIQUE using index "sessions_id2_key";

alter table "public"."setlist_items" add constraint "setlist_items_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."setlist_items" validate constraint "setlist_items_created_by_fkey";

alter table "public"."setlist_items" add constraint "setlist_items_exercise_id_fkey" FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."setlist_items" validate constraint "setlist_items_exercise_id_fkey";

alter table "public"."setlist_items" add constraint "setlist_items_setlist_id_fkey" FOREIGN KEY (setlist_id) REFERENCES setlists(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."setlist_items" validate constraint "setlist_items_setlist_id_fkey";

alter table "public"."setlist_items" add constraint "setlist_items_song_id_fkey" FOREIGN KEY (song_id) REFERENCES songs(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."setlist_items" validate constraint "setlist_items_song_id_fkey";

alter table "public"."setlists" add constraint "setlists_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."setlists" validate constraint "setlists_created_by_fkey";

alter table "public"."exercises" add constraint "exercises_section_id_fkey" FOREIGN KEY (section_id) REFERENCES sections(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."exercises" validate constraint "exercises_section_id_fkey";

alter table "public"."sections" add constraint "sections_book_id_fkey" FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE not valid;

alter table "public"."sections" validate constraint "sections_book_id_fkey";

alter table "public"."songs" add constraint "songs_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) not valid;

alter table "public"."songs" validate constraint "songs_artist_id_fkey";

grant delete on table "public"."session_items" to "anon";

grant insert on table "public"."session_items" to "anon";

grant references on table "public"."session_items" to "anon";

grant select on table "public"."session_items" to "anon";

grant trigger on table "public"."session_items" to "anon";

grant truncate on table "public"."session_items" to "anon";

grant update on table "public"."session_items" to "anon";

grant delete on table "public"."session_items" to "authenticated";

grant insert on table "public"."session_items" to "authenticated";

grant references on table "public"."session_items" to "authenticated";

grant select on table "public"."session_items" to "authenticated";

grant trigger on table "public"."session_items" to "authenticated";

grant truncate on table "public"."session_items" to "authenticated";

grant update on table "public"."session_items" to "authenticated";

grant delete on table "public"."session_items" to "service_role";

grant insert on table "public"."session_items" to "service_role";

grant references on table "public"."session_items" to "service_role";

grant select on table "public"."session_items" to "service_role";

grant trigger on table "public"."session_items" to "service_role";

grant truncate on table "public"."session_items" to "service_role";

grant update on table "public"."session_items" to "service_role";

grant delete on table "public"."sessions" to "anon";

grant insert on table "public"."sessions" to "anon";

grant references on table "public"."sessions" to "anon";

grant select on table "public"."sessions" to "anon";

grant trigger on table "public"."sessions" to "anon";

grant truncate on table "public"."sessions" to "anon";

grant update on table "public"."sessions" to "anon";

grant delete on table "public"."sessions" to "authenticated";

grant insert on table "public"."sessions" to "authenticated";

grant references on table "public"."sessions" to "authenticated";

grant select on table "public"."sessions" to "authenticated";

grant trigger on table "public"."sessions" to "authenticated";

grant truncate on table "public"."sessions" to "authenticated";

grant update on table "public"."sessions" to "authenticated";

grant delete on table "public"."sessions" to "service_role";

grant insert on table "public"."sessions" to "service_role";

grant references on table "public"."sessions" to "service_role";

grant select on table "public"."sessions" to "service_role";

grant trigger on table "public"."sessions" to "service_role";

grant truncate on table "public"."sessions" to "service_role";

grant update on table "public"."sessions" to "service_role";

grant delete on table "public"."setlist_items" to "anon";

grant insert on table "public"."setlist_items" to "anon";

grant references on table "public"."setlist_items" to "anon";

grant select on table "public"."setlist_items" to "anon";

grant trigger on table "public"."setlist_items" to "anon";

grant truncate on table "public"."setlist_items" to "anon";

grant update on table "public"."setlist_items" to "anon";

grant delete on table "public"."setlist_items" to "authenticated";

grant insert on table "public"."setlist_items" to "authenticated";

grant references on table "public"."setlist_items" to "authenticated";

grant select on table "public"."setlist_items" to "authenticated";

grant trigger on table "public"."setlist_items" to "authenticated";

grant truncate on table "public"."setlist_items" to "authenticated";

grant update on table "public"."setlist_items" to "authenticated";

grant delete on table "public"."setlist_items" to "service_role";

grant insert on table "public"."setlist_items" to "service_role";

grant references on table "public"."setlist_items" to "service_role";

grant select on table "public"."setlist_items" to "service_role";

grant trigger on table "public"."setlist_items" to "service_role";

grant truncate on table "public"."setlist_items" to "service_role";

grant update on table "public"."setlist_items" to "service_role";

grant delete on table "public"."setlists" to "anon";

grant insert on table "public"."setlists" to "anon";

grant references on table "public"."setlists" to "anon";

grant select on table "public"."setlists" to "anon";

grant trigger on table "public"."setlists" to "anon";

grant truncate on table "public"."setlists" to "anon";

grant update on table "public"."setlists" to "anon";

grant delete on table "public"."setlists" to "authenticated";

grant insert on table "public"."setlists" to "authenticated";

grant references on table "public"."setlists" to "authenticated";

grant select on table "public"."setlists" to "authenticated";

grant trigger on table "public"."setlists" to "authenticated";

grant truncate on table "public"."setlists" to "authenticated";

grant update on table "public"."setlists" to "authenticated";

grant delete on table "public"."setlists" to "service_role";

grant insert on table "public"."setlists" to "service_role";

grant references on table "public"."setlists" to "service_role";

grant select on table "public"."setlists" to "service_role";

grant trigger on table "public"."setlists" to "service_role";

grant truncate on table "public"."setlists" to "service_role";

grant update on table "public"."setlists" to "service_role";

create policy "Owner Access"
on "public"."session_items"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by))
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Owner Access"
on "public"."sessions"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = created_by))
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Owner Access"
on "public"."setlist_items"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = created_by))
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Owner Access"
on "public"."setlists"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = created_by))
with check ((( SELECT auth.uid() AS uid) = created_by));



