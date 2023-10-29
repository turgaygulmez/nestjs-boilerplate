import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import {
  ClientRequestDto,
  ClientResponseDto,
  Pagination,
  PaginationResponseDto,
} from '../dtos';
import { Client } from 'src/models';

@Injectable()
export class MapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Pagination,
        PaginationResponseDto,
        forMember(
          (destination) => destination.rows,
          mapFrom((source) => source.rows),
        ),
      );
      createMap(mapper, ClientRequestDto, Client);
      createMap(mapper, Client, ClientResponseDto);
    };
  }
}
