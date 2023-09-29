import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Request,
  HttpCode,
  Inject,
  Put,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { TranslatorService } from 'nestjs-translator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/resources/common/role.decorator';
import { UserRoles } from 'src/common/resources/users';
import { Sequelize } from 'sequelize-typescript';
import { Provides } from 'src/common/resources/common/provides';
import { UserSessionDto } from 'src/sessions/models';
import { AdminDto, UpdateUserDto } from './models';
import { EntityByIdDto } from 'src/common/models/entity-by-id.dto';
import { User, UserDto } from 'src/users/models';
import { ValidationHelper } from 'src/common/utils/helpers/validation.helper';
import { PaginationParams } from 'src/common/base/pagination-params.dto';
import { UsersService } from 'src/users/user.service';
import { UsersDto } from 'src/users/models/users.dto';
import { PaginationHelper } from 'src/common/utils/helpers/pagination.helper';
import { ScopeOptions } from 'sequelize';
import { Transaction } from 'sequelize/types';

@ApiTags('admins')
@Controller('admins')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    @Inject(Provides.sequelize) private readonly dbConnection: Sequelize,
  ) {}

  @ApiOperation({ summary: "Get current admin's profile" })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => AdminDto })
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getMyProfile(
    @Request() req: Request & { user: UserSessionDto },
  ): Promise<AdminDto> {
    const admin = await this.usersService.getById(req.user.userId);

    return new AdminDto(admin);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => AdminDto })
  @HttpCode(HttpStatus.OK)
  @Put('/users/:id')
  async updateUserProfile(
    @Body() body: UpdateUserDto,
    @Param() params: EntityByIdDto,
  ): Promise<AdminDto> {
    ValidationHelper.emptyObjectFail(body, this.translator);

    return this.dbConnection.transaction(async (transaction: Transaction) => {
      const user = await this.usersService.getById(params.id);

      if (body.email) {
        const userByEmail = await this.usersService.getUserByEmail(
          body.email,
          [],
          transaction,
        );

        if (userByEmail && user.get('email') !== userByEmail.get('email')) {
          throw new BadRequestException({
            message: this.translator.translate('EMAIL_ALREADY_EXIST'),
            errorCode: 'EMAIL_ALREADY_EXIST',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }
      }

      await user.update(body);

      return new UserDto(user);
    });
  }

  @ApiOperation({ summary: 'Get list of users' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => UsersDto })
  @HttpCode(HttpStatus.OK)
  @Get('/users')
  async getUsers(@Query() query: PaginationParams): Promise<UsersDto> {
    let items: User[] = [];
    const scopes: (string | ScopeOptions)[] = [
      { method: ['byRoles', UserRoles.user] },
    ];

    const count = await this.usersService.getCount(scopes);

    if (count) {
      items = await this.usersService.getList([
        ...scopes,
        { method: ['pagination', query.limit, query.offset] },
      ]);
    }

    return new UsersDto(items, PaginationHelper.buildPagination(query, count));
  }
}
