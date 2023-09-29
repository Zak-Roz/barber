import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BaseService } from 'src/common/base/base.service';
import { Provides } from 'src/common/resources/common/provides';
import { TranslatorService } from 'nestjs-translator';
import { WorkingTime } from './models';
import { Transaction } from 'sequelize/types';
import { UpdateWorkingTimesDto } from 'src/admins-barbers/models';

@Injectable()
export class WorkingTimesService extends BaseService<WorkingTime> {
  constructor(
    @Inject(Provides.workingTime)
    protected readonly model: Repository<WorkingTime>,
    private readonly translator: TranslatorService,
  ) {
    super(model);
  }

  async updateBarberWorkTime(
    body: UpdateWorkingTimesDto,
    userId: number,
    transaction?: Transaction,
  ): Promise<WorkingTime[]> {
    await this.model
      .scope({ method: ['byUser', userId] })
      .destroy({ transaction });

    return this.model.bulkCreate(
      body.workingTimes.map((item) => ({ ...item, userId })),
      { transaction },
    );
  }
}
