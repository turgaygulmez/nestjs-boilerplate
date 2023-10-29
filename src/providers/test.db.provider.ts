import { Sequelize } from 'sequelize-typescript';
import { PGDB_PROVIDER_ROOT } from '../constants/db';
import { Client } from '../models';

export const DatabaseProvider = [
  {
    provide: PGDB_PROVIDER_ROOT,
    useFactory: async () => {
      const sequelize = new Sequelize('sqlite::memory:', {
        models: [Client],
      });

      await sequelize.sync();
      return sequelize;
    },
  },
];
