import { Inject, Injectable } from '@nestjs/common';
import { UsedUserPassword } from './models';
import { Repository } from 'sequelize-typescript';
import { BaseService } from 'src/common/base/base.service';
import { Provides } from 'src/common/resources/common/provides';

@Injectable()
export class UsedUserPasswordsService extends BaseService<UsedUserPassword> {
  constructor(
    @Inject(Provides.usedUserPassword)
    protected readonly model: Repository<UsedUserPassword>,
  ) {
    super(model);
  }
}
