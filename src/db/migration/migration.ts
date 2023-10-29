import { PGDatabaseProvider } from '../../providers/postgresql.db.provider';
import { Umzug } from 'umzug';
import path = require('path');
import fs = require('fs');

const getRawSqlClient = async () => {
  const sequelize = await PGDatabaseProvider[0].useFactory();
  return {
    query: (sql: string, values?: unknown[]) =>
      sequelize.query(sql, { bind: values }),
  };
};
export const migrator = new Umzug({
  migrations: {
    glob: ['../src/db/scripts/*.sql', { cwd: __dirname }],
    resolve(params) {
      const downPath = path.join(
        path.dirname(params.path!),
        'down',
        path.basename(params.path!),
      );
      const upSQL = fs.readFileSync(params.path!).toString();
      let downSQL;
      try {
        downSQL = fs.readFileSync(downPath).toString();
      } catch (error) {}
      return {
        name: params.name,
        path: params.path,
        up: async () => (await params.context).query(upSQL),
        down: async () => (await params.context).query(downSQL || ''),
      };
    },
  },
  context: getRawSqlClient(),
  storage: {
    async executed({ context: client }) {
      const dbClient = await client;
      await dbClient.query(
        `
        CREATE SEQUENCE IF NOT EXISTS "SEQ_SCHEMA_VERSION_ID";

        CREATE TABLE IF NOT EXISTS "SCHEMA_VERSION" ( 
            "SCHEMA_VERSION_ID" bigint NOT NULL DEFAULT nextval('"SEQ_SCHEMA_VERSION_ID"'),
            "SCHEMA_VERSION_SCRIPT_NAME" VARCHAR(255) NOT NULL,
            "SCHEMA_VERSION_APPLIED" TIMESTAMP NOT NULL,
            CONSTRAINT "PK_SCHEMA_VERSION" PRIMARY KEY ("SCHEMA_VERSION_ID")
          );`,
      );
      const [results] = await dbClient.query(
        `SELECT "SCHEMA_VERSION_SCRIPT_NAME" FROM public."SCHEMA_VERSION"`,
      );
      return results.map((x) => x['SCHEMA_VERSION_SCRIPT_NAME']);
    },
    async logMigration({ name, context: client }) {
      (await client).query(
        `INSERT INTO public."SCHEMA_VERSION"("SCHEMA_VERSION_SCRIPT_NAME", "SCHEMA_VERSION_APPLIED") VALUES ($1,$2)`,
        [name, new Date()],
      );
    },
    async unlogMigration({ name, context: client }) {
      (await client).query(
        `DELETE FROM public."SCHEMA_VERSION" WHERE "SCHEMA_VERSION_SCRIPT_NAME" = $1`,
        [name],
      );
    },
  },
  logger: console,
  create: {
    folder: 'migrations',
  },
});

export type Migration = typeof migrator._types.migration;
