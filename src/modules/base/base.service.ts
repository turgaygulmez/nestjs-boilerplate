import { Model, ModelCtor } from 'sequelize-typescript';
import {
  Attributes,
  FindOptions,
  WhereOptions,
  BulkCreateOptions,
} from 'sequelize/types/model';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { IBaseService } from '../../interfaces/IBaseService';
import { Pagination, PaginationRequestDto } from '../../dtos';
import { GenericException } from '../../exceptions/genericException';
import { ERRORS } from '../../constants';

/**
 * Base Service to handle basic CRUD operation on DB
 * Extend your service with any additional business logic
 */
export class BaseService<T extends Model> implements IBaseService<T> {
  constructor(private readonly repository: ModelCtor<T>) {}

  private getPrimaryKey() {
    return this.repository.primaryKeyAttribute;
  }

  async getAll(param: FindOptions = {}): Promise<T[]> {
    return await this.repository.findAll(param);
  }

  async getPaginated(
    pagination: PaginationRequestDto,
    param: FindOptions = {},
  ): Promise<Pagination<T>> {
    const { take, page } = pagination || {};

    if (!take || !page) {
      throw new GenericException(ERRORS.MISSING_PAGINATION_PARAM);
    }

    param.offset = (pagination?.page - 1) * pagination?.take;
    param.limit = pagination.take;

    const countedData = await this.repository.findAndCountAll(param);

    const response = new Pagination<T>();

    response.rows = countedData.rows;
    response.count = countedData.count;
    response.pageSize = parseInt(param?.limit?.toString());
    response.totalPage = Math.ceil(countedData.count / param?.limit);
    response.currentPage = param?.offset / param.limit + 1;

    return response;
  }

  async getById(id: string | number, param: FindOptions = {}): Promise<T> {
    param = {
      ...param,
      where: {
        ...(param?.where || {}),
        [this.getPrimaryKey()]: id,
      },
    };

    return await this.repository.findOne(param);
  }

  async getSingle(param: FindOptions = {}): Promise<T> {
    return await this.repository.findOne(param);
  }

  async isExist(id: string | number): Promise<boolean> {
    return !!(await this.getById(id, {}));
  }

  async create(model: T): Promise<T> {
    if (model[this.getPrimaryKey()]) {
      delete model[this.getPrimaryKey()];
    }

    return await this.repository.create(model as any);
  }

  async createBulk(
    model: MakeNullishOptional<T>[],
    settings: BulkCreateOptions<Attributes<T>> = {},
  ): Promise<boolean> {
    try {
      if (model?.length) {
        model.forEach((entity) => {
          if (entity[this.getPrimaryKey()]) {
            delete entity[this.getPrimaryKey()];
          }
        });
      }

      await this.repository.bulkCreate(model, { validate: true, ...settings });
      return true;
    } catch (ex) {
      console.log('Error on create bulk', ex?.message);
      throw ex;
    }
  }

  async update(id: string | number, model: T): Promise<number[]> {
    if (!(await this.isExist(id))) {
      throw new GenericException(ERRORS.MISSING_ID);
    }

    const whereOptions: WhereOptions = {
      [this.getPrimaryKey()]: id,
    };

    delete model[this.getPrimaryKey()];

    return await this.repository.update(model, { where: whereOptions });
  }

  async deleteById(id: string | number): Promise<number> {
    if (!(await this.isExist(id))) {
      throw new GenericException(ERRORS.MISSING_ID);
    }

    const whereOptions: WhereOptions = {
      [this.getPrimaryKey()]: id,
    };

    return await this.repository.destroy({ where: whereOptions });
  }

  async deleteAll(): Promise<number> {
    return await this.repository.destroy({
      where: {},
      truncate: true,
    });
  }
}
