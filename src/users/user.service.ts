import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDto } from './models';
import { Transaction } from 'sequelize/types';
import { Repository } from 'sequelize-typescript';
import { BaseService } from 'src/common/base/base.service';
import { Provides } from 'src/common/resources/common/provides';
import { UsedUserPasswordsService } from './used-user-password.service';
import { PasswordHelper } from 'src/common/utils/helpers/password.helper';
import { ScopeOptions } from 'sequelize';
import { TranslatorService } from 'nestjs-translator';
import { UserRoles } from 'src/common/resources/users';
import { UpdateBarberDto, UpdateUserDto } from 'src/admins/models';

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

  async updateUser(
    body: UpdateBarberDto | UpdateUserDto,
    userId: number,
    role?: UserRoles,
  ): Promise<User> {
    const scopes: (string | ScopeOptions)[] = [];

    if (role) {
      scopes.push({ method: ['byRoles', role] });
    }

    const user = await this.getById(userId, scopes);

    if (body.email) {
      const userByEmail = await this.getUserByEmail(body.email);

      if (userByEmail && user.get('email') !== userByEmail.get('email')) {
        throw new BadRequestException({
          message: this.translator.translate('EMAIL_ALREADY_EXIST'),
          errorCode: 'EMAIL_ALREADY_EXIST',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    }

    await user.update(body);

    return user;
  }
}
