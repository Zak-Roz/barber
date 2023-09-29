import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpStatus,
  HttpCode,
  Inject,
  Put,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { TranslatorService } from 'nestjs-translator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/resources/common/role.decorator';
import { UserRoles } from 'src/common/resources/users';
import { Sequelize } from 'sequelize-typescript';
import { Provides } from 'src/common/resources/common/provides';
import { Transaction } from 'sequelize/types';
import {
  CreateBarberDto,
  CreateFavorDto,
  UpdateBarberDto,
  UpdateFavorDto,
  UpdateRecordDto,
  UpdateWorkingTimesDto,
} from './models';
import { User, UserDto } from 'src/users/models';
import { UsersService } from 'src/users/user.service';
import { EntityByIdDto } from 'src/common/models/entity-by-id.dto';
import { ValidationHelper } from 'src/common/utils/helpers/validation.helper';
import { PaginationParams } from 'src/common/base/pagination-params.dto';
import { PaginationHelper } from 'src/common/utils/helpers/pagination.helper';
import { FavorsService } from 'src/favor/favors.service';
import { Favor, FavorDto, FavorsDto } from 'src/favor/models';
import { WorkingTimesService } from 'src/working-times/working-times.service';
import { WorkingTimesDto } from 'src/working-times/models/working-times.dto';
import { UsersDto } from 'src/users/models/users.dto';
import { ScopeOptions } from 'sequelize';
import { Record, RecordDto, RecordsDto } from 'src/records/models';
import { RecordsService } from 'src/records/records.service';
import { DateTime } from 'luxon';
import { FULL_TIME_FORMAT } from 'src/common/resources/common/dataFormats';
import { EmptyDto } from 'src/common/base/empty.dto';

@ApiTags('admins-barbers')
@Controller('admins-barbers')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly recordsService: RecordsService,
    private readonly favorsService: FavorsService,
    private readonly workingTimesService: WorkingTimesService,
    @Inject(Provides.sequelize) private readonly dbConnection: Sequelize,
  ) {}

  @ApiOperation({ summary: 'Create barber' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiCreatedResponse({ type: () => UserDto })
  @HttpCode(HttpStatus.CREATED)
  @Get('barbers')
  async barbers(@Query() query: PaginationParams): Promise<UsersDto> {
    let items: User[] = [];
    const scopes: (string | ScopeOptions)[] = [
      { method: ['byRoles', UserRoles.barber] },
    ];

    const count = await this.usersService.getCount(scopes);

    if (count) {
      items = await this.usersService.getList([
        ...scopes,
        'withWorkingTime',
        { method: ['subQuery', false] },
        { method: ['pagination', query.limit, query.offset] },
      ]);
    }

    return new UsersDto(items, PaginationHelper.buildPagination(query, count));
  }

  @ApiOperation({ summary: 'Create barber' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiCreatedResponse({ type: () => UserDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('create-barber')
  async create(@Body() body: CreateBarberDto): Promise<UserDto> {
    let user = await this.usersService.getUserByEmail(body.email);

    if (user) {
      throw new BadRequestException({
        message: this.translator.translate('EMAIL_ALREADY_EXIST'),
        errorCode: 'EMAIL_ALREADY_EXIST',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    user = await this.usersService.create({
      ...body,
      role: UserRoles.barber,
    });

    return new UserDto(user);
  }

  @ApiOperation({ summary: 'Create barber' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => UserDto })
  @HttpCode(HttpStatus.OK)
  @Put('update-barber/:id')
  async updateBarber(
    @Param() params: EntityByIdDto,
    @Body() body: UpdateBarberDto,
  ): Promise<UserDto> {
    return this.dbConnection.transaction(async (transaction: Transaction) => {
      const user = await this.usersService.getById(
        params.id,
        [{ method: ['byRoles', [UserRoles.barber]] }],
        transaction,
      );

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

  @ApiOperation({ summary: 'Update barber working time' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => WorkingTimesDto })
  @HttpCode(HttpStatus.OK)
  @Put('working-time/barber/:id')
  async updateBarberWorkingTime(
    @Body() body: UpdateWorkingTimesDto,
    @Param() params: EntityByIdDto,
  ): Promise<WorkingTimesDto> {
    ValidationHelper.emptyObjectFail(body, this.translator);

    return this.dbConnection.transaction(async (transaction: Transaction) => {
      const user = await this.usersService.getById(
        params.id,
        [{ method: ['byRoles', [UserRoles.barber]] }],
        transaction,
      );

      const workingTimes = await this.workingTimesService.updateBarberWorkTime(
        body,
        user.get('id'),
        transaction,
      );

      return new WorkingTimesDto(workingTimes);
    });
  }

  @ApiOperation({ summary: 'Add favor' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => FavorDto })
  @HttpCode(HttpStatus.OK)
  @Post('favor')
  async addFavor(@Body() body: CreateFavorDto): Promise<FavorDto> {
    const favor = await this.favorsService.create(body);

    return new FavorDto(favor);
  }

  @ApiOperation({ summary: 'get list of favors' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => FavorsDto })
  @HttpCode(HttpStatus.OK)
  @Get('favor')
  async getListFavor(@Query() query: PaginationParams): Promise<FavorsDto> {
    let items: Favor[] = [];

    const count = await this.favorsService.getCount();

    if (count) {
      items = await this.favorsService.getList([
        { method: ['pagination', query.limit, query.offset] },
      ]);
    }

    return new FavorsDto(items, PaginationHelper.buildPagination(query, count));
  }

  @ApiOperation({ summary: 'Update favor' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => FavorDto })
  @HttpCode(HttpStatus.OK)
  @Put('favor/:id')
  async updateFavor(
    @Param() params: EntityByIdDto,
    @Body() body: UpdateFavorDto,
  ): Promise<FavorDto> {
    ValidationHelper.emptyObjectFail(body, this.translator);

    const favor = await this.favorsService.getById(params.id);

    await favor.update(body);

    return new FavorDto(favor);
  }

  @ApiOperation({ summary: 'Get records' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => RecordsDto })
  @HttpCode(HttpStatus.OK)
  @Get('records')
  async recordsList(@Query() query: PaginationParams): Promise<RecordsDto> {
    let items: Record[] = [];
    const scopes: (string | ScopeOptions)[] = ['notCanceled'];

    const count = await this.recordsService.getCount(scopes);

    if (count) {
      items = await this.recordsService.getList([
        ...scopes,
        'withFavor',
        'withBarber',
        'withClient',
        { method: ['subQuery', false] },
        { method: ['pagination', query.limit, query.offset] },
      ]);
    }

    return new RecordsDto(
      items,
      PaginationHelper.buildPagination(query, count),
    );
  }

  @ApiOperation({ summary: 'Get records' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => RecordDto })
  @HttpCode(HttpStatus.OK)
  @Put('records/:id')
  async updateRecord(
    @Param() params: EntityByIdDto,
    @Body() body: UpdateRecordDto,
  ): Promise<RecordDto> {
    const [record, favor] = await Promise.all([
      this.recordsService.getById(params.id, ['notCanceled']),
      this.favorsService.getById(body.favorId),
      this.usersService.getById(body.barberId, [
        { method: ['byRoles', [UserRoles.barber]] },
      ]),
    ]);

    const endsAt = DateTime.fromFormat(body.startsAt, FULL_TIME_FORMAT)
      .plus({ minutes: favor.get('duration') })
      .toFormat(FULL_TIME_FORMAT);

    const payload = { ...body, endsAt };

    await this.recordsService.validateBeforeCreate(payload, params.id);

    await record.update(payload);

    return new RecordDto(record);
  }

  @ApiOperation({ summary: 'Cancel record' })
  @ApiBearerAuth()
  @Roles(UserRoles.admin)
  @ApiOkResponse({ type: () => EmptyDto })
  @HttpCode(HttpStatus.OK)
  @Put('cancel-record/:id')
  async cancelRecord(@Param() params: EntityByIdDto): Promise<EmptyDto> {
    const record = await this.recordsService.getById(params.id, [
      'notCanceled',
    ]);

    await record.update({ isCanceled: true });

    return new EmptyDto();
  }
}
