ALTER TABLE
    "public"."profiles" DROP COLUMN "hash";

ALTER TABLE
    "public"."profiles" DROP COLUMN "salt";

ALTER TABLE
    "public"."profiles" DROP COLUMN "username";

ALTER TABLE
    "public"."profiles"
ADD
    COLUMN "avatar_url" text;

ALTER TABLE
    "public"."profiles"
ADD
    COLUMN "full_name" text;
