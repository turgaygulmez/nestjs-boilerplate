import { FindOptions } from 'sequelize';
import { PaginationRequestDto, Pagination } from '../dtos';

export interface IBaseService<T> {
  getAll(param?: FindOptions): Promise<T[]>;
  getById(id: string | number): Promise<T>;
  create(entity: T): Promise<T>;
  update(id: string | number, model: T): Promise<number[]>;
  deleteById(id: string | number): Promise<number>;
  deleteAll(): Promise<number>;
  getPaginated(
    pagination?: PaginationRequestDto,
    param?: FindOptions,
  ): Promise<Pagination<T>>;
}
