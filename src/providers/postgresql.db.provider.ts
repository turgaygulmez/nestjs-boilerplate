import { Sequelize } from 'sequelize-typescript';
import { PGDB_PROVIDER_ROOT } from '../constants/db';
import { Client } from '../models/index';

export const PGDatabaseProvider = [
  {
    provide: PGDB_PROVIDER_ROOT,
    useFactory: async () => {
      const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
          logging: false,
          host: process.env.DB_URL,
          port: +process.env.DB_PORT || 5432,
          dialect: 'postgres',
          models: [Client],
        },
      );

      return sequelize;
    },
  },
];
