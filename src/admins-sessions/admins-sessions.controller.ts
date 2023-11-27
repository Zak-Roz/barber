import {
  Post,
  Body,
  Controller,
  Delete,
  Request,
  Put,
  UnprocessableEntityException,
  HttpStatus,
  HttpCode,
  Inject,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  SessionDto,
  RefreshSessionDto,
  UserSessionDto,
  UserSessionResponseDto,
  LoginUserDto,
} from 'src/sessions/models';
import { Public } from 'src/common/resources/common/public.decorator';
import { PasswordHelper } from 'src/common/utils/helpers/password.helper';
import { UserRoles } from 'src/common/resources/users';
import { UsersService } from 'src/users/user.service';
import { UserDto } from 'src/users/models';
import { Transaction } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';
import { Provides } from 'src/common/resources/common/provides';
import { EmptyDto } from 'src/common/base/empty.dto';
import { ScopeOptions } from 'sequelize';
import { TranslatorService } from 'nestjs-translator';
import { AdminsSessionsService } from './admins-sessions.service';

@ApiTags('admin-sessions')
@Controller('admin-sessions')
export class AdminsSessionsController {
  constructor(
    private readonly sessionsService: AdminsSessionsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    @Inject(Provides.sequelize) private readonly dbConnection: Sequelize,
  ) {}

  @Public()
  @ApiCreatedResponse({ type: () => UserSessionResponseDto })
  @ApiOperation({ summary: 'Start session' })
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async create(@Body() body: LoginUserDto): Promise<UserSessionResponseDto> {
    const scopes: readonly (string | ScopeOptions)[] = [
      { method: ['byRoles', [UserRoles.admin]] },
      'withAvatar',
    ];

    const user = await this.usersService.getUserByEmail(body.email, scopes);

    if (
      !user ||
      !PasswordHelper.compare(
        `${body.password}${user.get('salt')}`,
        user.get('password'),
      )
    ) {
      throw new UnprocessableEntityException({
        message: this.translator.translate('WRONG_CREDENTIALS'),
        errorCode: 'WRONG_CREDENTIALS',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const session = await this.sessionsService.create(user.get('id'), {
      role: user.get('role'),
    });

    return new UserSessionResponseDto(new UserDto(user), session);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Destroy session' })
  @ApiNoContentResponse({ type: () => EmptyDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('')
  async logout(
    @Request() req: Request & { user: UserSessionDto },
  ): Promise<EmptyDto> {
    await this.sessionsService.destroySessions(req.user.userId);

    return new EmptyDto();
  }

  @Public()
  @ApiOperation({ summary: 'Refresh session' })
  @ApiOkResponse({ type: () => SessionDto })
  @HttpCode(HttpStatus.OK)
  @Put('')
  async refresh(@Body() body: RefreshSessionDto): Promise<SessionDto> {
    return this.sessionsService.refresh(body.refreshToken);
  }
}
