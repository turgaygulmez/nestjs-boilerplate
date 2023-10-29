import { Injectable, Inject } from '@nestjs/common';
import { Client } from '../../models';
import { DB_PROVIDER } from '../../constants';
import { BaseService } from '../base/base.service';

@Injectable()
export class ClientService extends BaseService<Client> {
  constructor(
    @Inject(DB_PROVIDER.CLIENT)
    private repo: typeof Client,
  ) {
    super(repo);
  }
}
