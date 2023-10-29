import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { ClientResponseDto, ClientRequestDto } from '../../dtos';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ROUTE } from '../../constants';
import { Client } from '../../models';
import { ClientService } from './client.service';
import { AllowCache } from '../../decorators/allowCache';

@Controller(ROUTE.CLIENTS)
@AllowCache()
@ApiTags(ROUTE.CLIENTS)
export class ClientController extends BaseController<Client> {
  constructor(
    @InjectMapper() private mapper: Mapper,
    private readonly clientService: ClientService,
  ) {
    super(mapper, clientService);
    super.TSourceModel = Client;
    super.TResponseModel = ClientResponseDto;
    super.TRequestModel = ClientRequestDto;
  }
}
