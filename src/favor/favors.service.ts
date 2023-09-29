import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BaseService } from 'src/common/base/base.service';
import { Provides } from 'src/common/resources/common/provides';
import { CreateFavorDto, Favor } from './models';
import { Transaction } from 'sequelize/types';
import { TranslatorService } from 'nestjs-translator';

@Injectable()
export class FavorsService extends BaseService<Favor> {
  constructor(
    @Inject(Provides.favor)
    protected readonly model: Repository<Favor>,
    private readonly translator: TranslatorService,
  ) {
    super(model);
  }

  create(body: CreateFavorDto, transaction?: Transaction): Promise<Favor> {
    return this.model.create({ ...body }, { transaction });
  }

  async getById(
    id: number,
    scopes = [],
    transaction?: Transaction,
  ): Promise<Favor> {
    const favor = await this.getOne(
      [...scopes, { method: ['byId', id] }],
      transaction,
    );

    if (!favor) {
      throw new NotFoundException({
        message: this.translator.translate('ENTITY_NOT_FOUND', {
          replace: { entityName: 'Favor' },
        }),
        errorCode: 'ENTITY_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return favor;
  }
}
