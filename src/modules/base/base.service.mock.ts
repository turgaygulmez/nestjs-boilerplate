import { Injectable } from '@nestjs/common';
/**
 * CRUD mock service to handle DB operations on memory
 */
@Injectable()
export class BaseServiceMock {
  private list = null;
  private primaryKey = null;

  constructor(primaryKey: string, list: any[]) {
    this.list = list;
    this.primaryKey = primaryKey;
  }

  async getAll() {
    return this.list;
  }

  async getById(id: number) {
    return this.list.find((x) => x[this.primaryKey] === id);
  }

  async create(data: any) {
    data[this.primaryKey] = null;

    this.list.push(data);

    return data;
  }

  async update(id: number | string, data: any) {
    let itemAffected = 0;

    this.list.forEach((x, index, arr) => {
      if (x[this.primaryKey] === id) {
        Object.keys(data)?.forEach((key) => {
          if (data[key]) {
            arr[index][key] = data[key];
          }
        });

        arr[index][this.primaryKey] = id;

        ++itemAffected;
      }
    });

    return itemAffected;
  }

  async deleteById(id: number | string) {
    const originalCount = this.list.length;
    this.list = this.list.filter((x) => x[this.primaryKey] !== id);
    return originalCount - this.list.length;
  }
}
