import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './models';
import { Transaction } from 'sequelize/types';
import { Repository } from 'sequelize-typescript';
import { BaseService } from 'src/common/base/base.service';
import { Provides } from 'src/common/resources/common/provides';
import { UsedUserPasswordsService } from './used-user-password.service';
import { PasswordHelper } from 'src/common/utils/helpers/password.helper';
import { ScopeOptions } from 'sequelize';
import { TranslatorService } from 'nestjs-translator';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @Inject(Provides.user) protected readonly model: Repository<User>,
    private readonly translator: TranslatorService,
    private readonly usedUserPasswordsService: UsedUserPasswordsService,
  ) {
    super(model);
  }

  getUserByEmail(
    email: string,
    scopes: readonly (string | ScopeOptions)[] = [],
    transaction?: Transaction,
  ): Promise<User> {
    return this.model
      .scope([...scopes, { method: ['byEmail', email] }])
      .findOne({ transaction });
  }

  create(
    body: { [key: string]: number | string },
    transaction?: Transaction,
  ): Promise<User> {
    return this.model.create({ ...body }, { transaction });
  }

  async getById(
    userId: number,
    scopes: (string | ScopeOptions)[] = [],
    transaction?: Transaction,
  ): Promise<User> {
    const user = await this.model
      .scope(scopes || [])
      .findByPk(userId, { transaction });

    if (!user) {
      throw new NotFoundException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return user;
  }

  async checkUsedUserPasswords(
    user: User,
    password: string,
    transaction?: Transaction,
  ): Promise<void> {
    const newHashedPassword = PasswordHelper.hash(password + user.get('salt'));

    const usedPassword = await this.usedUserPasswordsService.getOne(
      [
        { method: ['byUser', user.get('id')] },
        { method: ['byPassword', newHashedPassword] },
      ],
      transaction,
    );

    if (usedPassword) {
      throw new BadRequestException({
        message: this.translator.translate('PASSWORD_WAS_USED_PREVIOUSLY'),
        errorCode: 'PASSWORD_WAS_USED_PREVIOUSLY',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
