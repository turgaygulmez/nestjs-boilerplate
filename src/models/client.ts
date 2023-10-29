import { AutoMap } from '@automapper/classes';
import { Table, Model, Column, DataType } from 'sequelize-typescript';
import { DB_TABLE } from '../constants';

@Table({
  timestamps: false,
  tableName: DB_TABLE.CLIENT,
})
export class Client extends Model {
  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true,
    field: `${DB_TABLE.CLIENT}_ID`,
  })
  id!: number;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: `${DB_TABLE.CLIENT}_NAME`,
  })
  name!: string;
}
