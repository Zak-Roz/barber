import { Model, Transaction } from 'sequelize/types';
import { Repository } from 'sequelize-typescript';
import { ScopeOptions } from 'sequelize';

export class BaseService<T extends Model> {
  protected readonly model: Repository<T>;

  constructor(model: Repository<T>) {
    this.model = model;
  }

  getList(
    scopes: (string | ScopeOptions)[] = [],
    transaction?: Transaction,
  ): Promise<T[]> {
    return this.model.scope(scopes).findAll({ transaction });
  }

  getCount(
    scopes: (string | ScopeOptions)[] = [],
    transaction?: Transaction,
  ): Promise<number> {
    return this.model.scope(scopes).count({ transaction });
  }

  getOne(
    scopes: (string | ScopeOptions)[] = [],
    transaction?: Transaction,
  ): Promise<T> {
    return this.model.scope(scopes).findOne({ transaction });
  }
}
