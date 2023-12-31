-- CLIENT table

CREATE SEQUENCE IF NOT EXISTS "SEQ_CLIENT_ID";

CREATE TABLE IF NOT EXISTS public."CLIENT"
(
  "CLIENT_ID" bigint NOT NULL DEFAULT nextval('"SEQ_CLIENT_ID"'),
  "CLIENT_NAME" character varying(1000) COLLATE pg_catalog."default" NOT NULL,
  CONSTRAINT "PK_CLIENT" PRIMARY KEY ("CLIENT_ID")
);