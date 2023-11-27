import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { TranslatorService } from 'nestjs-translator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import { Provides } from 'src/common/resources/common/provides';
import { UsersService } from 'src/users/user.service';
import { Roles } from 'src/common/resources/common/role.decorator';
import { UserRoles } from 'src/common/resources/users';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './models';
import { UserSessionDto } from 'src/sessions/models';
import { RecordDto } from './models/record.dto';
import { GetFreeSlotsDto } from './models/get-free-slots.dto';
import { FavorsService } from 'src/favor/favors.service';
import { DateTime } from 'luxon';
import { FULL_TIME_FORMAT } from 'src/common/resources/common/dataFormats';
import { PaginationParams } from 'src/common/base/pagination-params.dto';
import { UsersDto } from 'src/users/models/users.dto';
import { PaginationHelper } from 'src/common/utils/helpers/pagination.helper';
import { User } from 'src/users/models';
import { ScopeOptions } from 'sequelize';
import {
  DEFAULT_CACHE_TTL,
  ONE_HOUR_CACHE_TTL,
} from 'src/common/resources/common/cache';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('records')
@Controller('records')
export class RecordController {
  constructor(
    private readonly usersService: UsersService,
    private readonly favorsService: FavorsService,
    private readonly recordsService: RecordsService,
    private readonly translator: TranslatorService,
    @Inject(Provides.sequelize) private readonly dbConnection: Sequelize,
  ) {}

  @ApiOperation({ summary: 'Create record' })
  @ApiBearerAuth()
  @Roles(UserRoles.user)
  @ApiCreatedResponse({ type: () => RecordDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async create(
    @Body() body: CreateRecordDto,
    @Request() req: Request & { user: UserSessionDto },
  ): Promise<RecordDto> {
    const [favor] = await Promise.all([
      this.favorsService.getById(body.favorId),
      this.usersService.getById(body.barberId, [
        { method: ['byRoles', [UserRoles.barber]] },
      ]),
    ]);

    const endsAt = DateTime.fromFormat(body.startsAt, FULL_TIME_FORMAT)
      .plus({ minutes: favor.get('duration') })
      .toFormat(FULL_TIME_FORMAT);

    const payload = { ...body, endsAt };

    await this.recordsService.validateBeforeCreate(payload);

    const record = await this.recordsService.create(payload, req.user.userId);

    return new RecordDto(record);
  }

  @ApiOperation({ summary: 'Get all barbers' })
  @ApiBearerAuth()
  @Roles(UserRoles.user)
  @ApiOkResponse({ type: () => UsersDto })
  @HttpCode(HttpStatus.OK)
  @CacheTTL(ONE_HOUR_CACHE_TTL)
  @UseInterceptors(CacheInterceptor)
  @Get('barbers')
  async getBarbers(@Query() query: PaginationParams): Promise<UsersDto> {
    let items: User[] = [];
    const scopes: (string | ScopeOptions)[] = [
      { method: ['byRoles', UserRoles.barber] },
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

  @ApiOperation({ summary: 'Get free time slots' })
  @ApiBearerAuth()
  @Roles(UserRoles.user)
  @ApiOkResponse({ type: () => [String] })
  @HttpCode(HttpStatus.OK)
  @CacheTTL(DEFAULT_CACHE_TTL)
  @UseInterceptors(CacheInterceptor)
  @Get('free-slots')
  async getTimeSlots(@Query() query: GetFreeSlotsDto) {
    const record = await this.recordsService.getAvailableSlots(
      query.date,
      query.barberId,
    );

    return record;
  }
}
