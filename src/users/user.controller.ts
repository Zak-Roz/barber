import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  HttpStatus,
  Request,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './models/create-user.dto';
import { TranslatorService } from 'nestjs-translator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserDto } from './models/user.dto';
import { UsersService } from './user.service';
import { Roles } from 'src/common/resources/common/role.decorator';
import { UserRoles } from 'src/common/resources/users';
import { Public } from 'src/common/resources/common/public.decorator';
import { VerificationsService } from 'src/verifications/verification.service';
import { Sequelize } from 'sequelize-typescript';
import { Provides } from 'src/common/resources/common/provides';
import { UserSessionDto } from 'src/sessions/models';
import { Transaction } from 'sequelize/types';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly verificationsService: VerificationsService,
    @Inject(Provides.sequelize) private readonly dbConnection: Sequelize,
  ) {}

  @ApiOperation({ summary: "Get current user's profile" })
  @ApiBearerAuth()
  @Roles(UserRoles.user)
  @ApiOkResponse({ type: () => UserDto })
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getMyProfile(
    @Request() req: Request & { user: UserSessionDto },
  ): Promise<UserDto> {
    const user = await this.usersService.getById(req.user.userId);

    return new UserDto(user);
  }

  @Public()
  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({ type: () => UserDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async create(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.dbConnection.transaction(async (transaction: Transaction) => {
      let user = await this.usersService.getUserByEmail(
        body.email,
        [],
        transaction,
      );

      if (user) {
        throw new BadRequestException({
          message: this.translator.translate('EMAIL_ALREADY_EXIST'),
          errorCode: 'EMAIL_ALREADY_EXIST',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      user = await this.usersService.create({ ...body });

      await this.verificationsService.createEmailVerification(
        user,
        transaction,
      );

      return new UserDto(user);
    });
  }
}
