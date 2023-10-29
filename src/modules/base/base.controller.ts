import { Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { IBaseService } from '../../interfaces/IBaseService';
import { Model } from 'sequelize-typescript';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  Pagination,
  PaginationRequestDto,
  PaginationResponseDto,
} from '../../dtos';

/**
 * Base controller for CRUD operations
 * Inherit from this controller in case you need to have
 * basic CRUD operations. Extend it with any additional endpoint
 */
export class BaseController<T extends Model> {
  constructor(
    @InjectMapper() private autoMapper: Mapper,
    protected readonly service: IBaseService<T>,
  ) {}
  protected TSourceModel = null;
  protected TResponseModel = null;
  protected TRequestModel = null;

  @Get()
  @ApiResponse({ status: 200, description: 'Ok' })
  async getAll() {
    const items = await this.service.getAll();
    return this.autoMapper.mapArray(
      items,
      this.TSourceModel,
      this.TResponseModel,
    );
  }

  @Get('search')
  @ApiResponse({ status: 200, description: 'Ok' })
  async getPaginated(@Query() filter: PaginationRequestDto) {
    const items = await this.service.getPaginated(filter);

    return this.autoMapper.map(
      items,
      Pagination,
      PaginationResponseDto<typeof this.TResponseModel>,
    );
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Entity retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Entity does not exist' })
  async getById(@Param('id') id: number) {
    const item = await this.service.getById(id);
    return this.autoMapper.map(item, this.TSourceModel, this.TResponseModel);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() entity: typeof this.TRequestModel) {
    const data = this.autoMapper.map(
      entity,
      this.TRequestModel,
      this.TSourceModel,
    ) as T;

    const newEntity = await this.service.create(data?.dataValues);

    return this.autoMapper.map(
      newEntity,
      this.TSourceModel,
      this.TResponseModel,
    );
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Entity deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async deleteById(@Param('id') id: string | number) {
    return await this.service.deleteById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 200, description: 'Entity deleted successfully.' })
  async update(
    @Param('id') id: string | number,
    @Body() entity: typeof this.TRequestModel,
  ) {
    const data = this.autoMapper.map(
      entity,
      this.TRequestModel,
      this.TSourceModel,
    ) as T;

    const newEntity = await this.service.update(id, data?.dataValues);

    return this.autoMapper.map(
      newEntity,
      this.TSourceModel,
      this.TResponseModel,
    );
  }
}
