import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientProvider } from './client.provider';
import { ClientController } from './client.controller';

@Module({
  imports: [],
  controllers: [ClientController],
  providers: [ClientService, ...ClientProvider],
  exports: [ClientService],
})
export class ClientModule {}
