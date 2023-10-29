import { AutoMap } from '@automapper/classes';

export class ClientRequestDto {
  @AutoMap()
  public name: string;
}
