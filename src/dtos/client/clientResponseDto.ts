import { AutoMap } from '@automapper/classes';

export class ClientResponseDto {
  @AutoMap()
  public id: number;
  @AutoMap()
  public name: string;
}
