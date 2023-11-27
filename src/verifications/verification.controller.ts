import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Inject,
  Body,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { VerificationsService } from './verification.service';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmptyDto } from 'src/common/base/empty.dto';
import { UserSessionResponseDto } from 'src/sessions/models';
import { Public } from 'src/common/resources/common/public.decorator';
import { UsersService } from 'src/users/user.service';
import { Provides } from 'src/common/resources/common/provides';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import {
  TokenVerificationDto,
  ResendEmailVerificationDto,
  PasswordVerificationDto,
} from './models';
import { UserDto } from 'src/users/models';
import { SessionsService } from 'src/sessions/sessions.service';
import { VerificationTypes } from 'src/common/resources/verifications';
import { TranslatorService } from 'nestjs-translator';

@ApiTags('verifications')
@Controller('verifications')
export class VerificationsController {
  constructor(
    private readonly verificationsService: VerificationsService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly translator: TranslatorService,
    @Inject(Provides.sequelize) private readonly dbConnection: Sequelize,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Sends new email validation mail' })
  @ApiNoContentResponse({ type: () => EmptyDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('resend')
  async resendEmailVerification(
    @Body() body: ResendEmailVerificationDto,
  ): Promise<EmptyDto> {
    return this.dbConnection.transaction(async (transaction: Transaction) => {
      const user = await this.usersService.getUserByEmail(
        body.email,
        [],
        transaction,
      );

      if (!user) {
        throw new NotFoundException({
          message: this.translator.translate('USER_NOT_FOUND'),
          errorCode: 'USER_NOT_FOUND',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      if (user.get('isVerified')) {
        throw new UnauthorizedException({
          message: this.translator.translate('ALREADY_VERIFIED'),
          errorCode: 'ALREADY_VERIFIED',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }

      await this.verificationsService.resendEmailVerification(
        user,
        transaction,
      );

      return new EmptyDto();
    });
  }

  @Public()
  @ApiOperation({ summary: "Verifies user's email" })
  @ApiOkResponse({ type: () => UserSessionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('email')
  async verifyEmail(
    @Body() body: TokenVerificationDto,
  ): Promise<UserSessionResponseDto> {
    return this.dbConnection.transaction(async (transaction: Transaction) => {
      const { userId } = this.sessionsService.verifyToken(body.token);

      const user = await this.usersService.getById(userId, [], transaction);

      if (user.get('isVerified')) {
        throw new UnauthorizedException({
          message: this.translator.translate('ALREADY_VERIFIED'),
          errorCode: 'ALREADY_VERIFIED',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }

      const verificationToken = await this.verificationsService.validateToken(
        body.token,
        VerificationTypes.email,
        transaction,
      );

      await Promise.all([
        verificationToken.update({ isUsed: true }, { transaction }),
        user.update({ isVerified: true }, { transaction }),
      ]);

      const session = await this.sessionsService.create(user.get('id'), {
        role: user.get('role'),
      });

      return new UserSessionResponseDto(new UserDto(user), session);
    });
  }

  @Public()
  @ApiOperation({ summary: "Reset user's password" })
  @ApiNoContentResponse({ type: () => EmptyDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password')
  async resetPassword(
    @Body() body: ResendEmailVerificationDto,
  ): Promise<EmptyDto> {
    return this.dbConnection.transaction(async (transaction: Transaction) => {
      const user = await this.usersService.getUserByEmail(
        body.email,
        [],
        transaction,
      );

      if (!user) {
        throw new NotFoundException({
          message: this.translator.translate('USER_NOT_FOUND'),
          errorCode: 'USER_NOT_FOUND',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      if (!user.get('isVerified')) {
        throw new ForbiddenException({
          message: this.translator.translate('NOT_VERIFIED'),
          errorCode: 'NOT_VERIFIED',
          statusCode: HttpStatus.FORBIDDEN,
        });
      }

      await this.verificationsService.resetPassword(user, transaction);

      return new EmptyDto();
    });
  }

  @Public()
  @ApiOperation({ summary: "Set new user's password" })
  @ApiOkResponse({ type: () => EmptyDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password')
  async verifyPassword(
    @Body() body: PasswordVerificationDto,
  ): Promise<EmptyDto> {
    return this.dbConnection.transaction(async (transaction: Transaction) => {
      const verificationToken = await this.verificationsService.validateToken(
        body.token,
        VerificationTypes.resetPassword,
        transaction,
      );

      const user = await this.usersService.getById(
        verificationToken.get('userId'),
        [],
        transaction,
      );

      await this.usersService.checkUsedUserPasswords(
        user,
        body.password,
        transaction,
      );

      await Promise.all([
        user.update(
          { password: body.password, isVerified: true },
          { transaction },
        ),
        verificationToken.update({ isUsed: true }, { transaction }),
        this.sessionsService.destroySessions(user.get('id')),
      ]);

      return new EmptyDto();
    });
  }

  @Public()
  @ApiOperation({ summary: 'Check token' })
  @ApiOkResponse({ type: () => EmptyDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('check-token')
  async checkToken(@Body() body: TokenVerificationDto): Promise<EmptyDto> {
    await this.verificationsService.validateToken(body.token);

    return new EmptyDto();
  }
}
