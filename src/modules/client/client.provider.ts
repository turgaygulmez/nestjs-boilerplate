import { Client } from '../../models';
import { DB_PROVIDER } from '../../constants';

export const ClientProvider = [
  {
    provide: DB_PROVIDER.CLIENT,
    useValue: Client,
  },
];
