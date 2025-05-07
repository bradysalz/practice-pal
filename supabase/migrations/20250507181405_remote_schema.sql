revoke delete on table "public"."Profiles" from "anon";

revoke insert on table "public"."Profiles" from "anon";

revoke references on table "public"."Profiles" from "anon";

revoke select on table "public"."Profiles" from "anon";

revoke trigger on table "public"."Profiles" from "anon";

revoke truncate on table "public"."Profiles" from "anon";

revoke update on table "public"."Profiles" from "anon";

revoke delete on table "public"."Profiles" from "authenticated";

revoke insert on table "public"."Profiles" from "authenticated";

revoke references on table "public"."Profiles" from "authenticated";

revoke select on table "public"."Profiles" from "authenticated";

revoke trigger on table "public"."Profiles" from "authenticated";

revoke truncate on table "public"."Profiles" from "authenticated";

revoke update on table "public"."Profiles" from "authenticated";

revoke delete on table "public"."Profiles" from "service_role";

revoke insert on table "public"."Profiles" from "service_role";

revoke references on table "public"."Profiles" from "service_role";

revoke select on table "public"."Profiles" from "service_role";

revoke trigger on table "public"."Profiles" from "service_role";

revoke truncate on table "public"."Profiles" from "service_role";

revoke update on table "public"."Profiles" from "service_role";

revoke delete on table "public"."Section" from "anon";

revoke insert on table "public"."Section" from "anon";

revoke references on table "public"."Section" from "anon";

revoke select on table "public"."Section" from "anon";

revoke trigger on table "public"."Section" from "anon";

revoke truncate on table "public"."Section" from "anon";

revoke update on table "public"."Section" from "anon";

revoke delete on table "public"."Section" from "authenticated";

revoke insert on table "public"."Section" from "authenticated";

revoke references on table "public"."Section" from "authenticated";

revoke select on table "public"."Section" from "authenticated";

revoke trigger on table "public"."Section" from "authenticated";

revoke truncate on table "public"."Section" from "authenticated";

revoke update on table "public"."Section" from "authenticated";

revoke delete on table "public"."Section" from "service_role";

revoke insert on table "public"."Section" from "service_role";

revoke references on table "public"."Section" from "service_role";

revoke select on table "public"."Section" from "service_role";

revoke trigger on table "public"."Section" from "service_role";

revoke truncate on table "public"."Section" from "service_role";

revoke update on table "public"."Section" from "service_role";

alter table "public"."Profiles" drop constraint "Profiles_id_fkey";

alter table "public"."Profiles" drop constraint "Profiles_pkey";

alter table "public"."Section" drop constraint "Section_pkey";

drop index if exists "public"."Profiles_pkey";

drop index if exists "public"."Section_pkey";

drop table "public"."Profiles";

drop table "public"."Section";


