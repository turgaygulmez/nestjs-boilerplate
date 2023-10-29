import { AutoMap } from '@automapper/classes';

export class PaginationResponseDto<T> {
  @AutoMap()
  public rows: T[];
  @AutoMap()
  public count: number;
  @AutoMap()
  public pageSize: number;
  @AutoMap()
  public totalPage: number;
  @AutoMap()
  public currentPage: number;
}
