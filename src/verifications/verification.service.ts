import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { Provides } from 'src/common/resources/common/provides';
import { Repository } from 'sequelize-typescript';
import { Verification } from './models';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import {
  VerificationRules,
  VerificationTypes,
} from 'src/common/resources/verifications';
import { ConfigService } from 'src/common/utils/config/config.service';
import { Transaction } from 'sequelize/types';
import { DateTime } from 'luxon';
import { User } from 'src/users/models';
import { SessionsService } from 'src/sessions/sessions.service';
import { ScopeOptions } from 'sequelize';
import { TranslatorService } from 'nestjs-translator';

@Injectable()
export class VerificationsService extends BaseService<Verification> {
  constructor(
    @Inject(Provides.verification)
    protected readonly model: Repository<Verification>,
    private readonly mailerService: MailerService,
    private readonly translator: TranslatorService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionsService: SessionsService,
  ) {
    super(model);
  }

  generateEmailVerificationToken(userId: number, email: string): string {
    return this.jwtService.sign(
      { userId, email },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EMAIL_EXPIRES_IN'),
      },
    );
  }

  async createEmailVerification(
    user: User,
    transaction: Transaction = null,
  ): Promise<void> {
    const token = this.generateEmailVerificationToken(
      user.get('id'),
      user.get('email'),
    );

    await this.deleteUnusedTokens(
      user.get('id'),
      VerificationTypes.email,
      transaction,
    );

    await this.model.create(
      {
        userId: user.get('id'),
        type: VerificationTypes.email,
        token,
      },
      { transaction },
    );

    await this.mailerService.sendVerificationEmail(token, user.get('email'));
  }

  async createResetPassword(
    user: User,
    transaction: Transaction = null,
  ): Promise<void> {
    const token = this.generateEmailVerificationToken(
      user.get('id'),
      user.get('email'),
    );

    await this.deleteUnusedTokens(
      user.get('id'),
      VerificationTypes.resetPassword,
      transaction,
    );

    await this.model.create(
      {
        userId: user.get('id'),
        type: VerificationTypes.resetPassword,
        token,
      },
      { transaction },
    );

    await this.mailerService.sendResetPasswordEmail(user, token);
  }

  deleteUnusedTokens(
    userId: number,
    verificationType: VerificationTypes,
    transaction: Transaction = null,
  ): Promise<number> {
    return this.model
      .scope([
        { method: ['byType', verificationType] },
        { method: ['byUser', userId] },
        { method: ['byIsUsed', false] },
      ])
      .destroy({ transaction });
  }

  async resend(
    user: User,
    instance: Verification,
    transaction: Transaction = null,
  ): Promise<string> {
    this.checkResendTime(instance, 'PASSWORD_RESET_TOKEN_CALL_DOWN');

    if (instance.get('attempt') >= VerificationRules.maxAttempts) {
      throw new BadRequestException({
        message: this.translator.translate('EMAIL_TOKEN_LIMIT'),
        errorCode: 'EMAIL_TOKEN_LIMIT',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const newToken = this.generateEmailVerificationToken(
      user.get('id'),
      user.get('email'),
    );

    await instance.update(
      {
        token: newToken,
        attempt: instance.get('attempt') + 1,
      },
      { transaction },
    );

    return newToken;
  }

  checkResendTime(
    instance: Verification,
    errorMessage = 'EMAIL_TOKEN_CALL_DOWN',
  ): void {
    const now = DateTime.now();
    const lastUpdatedAt = DateTime.fromJSDate(instance.get('updatedAt'));
    const { seconds: diffUpdatedAtInSeconds } = now
      .diff(lastUpdatedAt, 'seconds')
      .toObject();

    if (diffUpdatedAtInSeconds < VerificationRules.resendTime) {
      throw new BadRequestException({
        message: this.translator.translate(errorMessage),
        errorCode: errorMessage,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async validateToken(
    token: string,
    verificationType?: VerificationTypes,
    transaction: Transaction = null,
  ): Promise<Verification> {
    const { userId } = this.sessionsService.verifyToken(token);

    const scopes: (string | ScopeOptions)[] = [
      { method: ['byToken', token] },
      { method: ['byUser', userId] },
    ];

    if (verificationType) {
      scopes.push({ method: ['byType', verificationType] });
    }

    const verificationToken = await this.getOne(scopes, transaction);

    if (!verificationToken || verificationToken.isUsed) {
      throw new UnprocessableEntityException({
        message: this.translator.translate('TOKEN_INVALID'),
        errorCode: 'TOKEN_INVALID',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    return verificationToken;
  }

  isTokenExpired(instance: Verification): boolean {
    const now = DateTime.now();
    const createdAt = DateTime.fromJSDate(instance.get('createdAt'));
    const { seconds: diffCreatedAtInSeconds } = now
      .diff(createdAt, 'seconds')
      .toObject();

    return diffCreatedAtInSeconds >= VerificationRules.resendDay;
  }

  async resetPassword(
    user: User,
    transaction: Transaction = null,
  ): Promise<void> {
    const verificationToken = await this.getOne(
      [
        { method: ['byType', VerificationTypes.resetPassword] },
        { method: ['byUser', user.get('id')] },
        { method: ['byIsUsed', false] },
      ],
      transaction,
    );

    if (!verificationToken || this.isTokenExpired(verificationToken)) {
      await this.createResetPassword(user, transaction);
      return;
    }

    const newToken = await this.resend(user, verificationToken, transaction);

    await this.mailerService.sendResetPasswordEmail(user, newToken);
  }

  async resendEmailVerification(
    user: User,
    transaction: Transaction = null,
  ): Promise<void> {
    const existingEmailVerification = await this.getOne(
      [{ method: ['byUser', user.get('id')] }, { method: ['byIsUsed', false] }],
      transaction,
    );

    if (!existingEmailVerification) {
      throw new NotFoundException({
        message: this.translator.translate('EMAIL_TOKEN_NOT_FOUND'),
        errorCode: 'EMAIL_TOKEN_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const isTokenExpired = this.isTokenExpired(existingEmailVerification);

    if (isTokenExpired) {
      await this.createEmailVerification(user, transaction);
      return;
    }

    const newToken = await this.resend(
      user,
      existingEmailVerification,
      transaction,
    );

    await this.mailerService.sendVerificationEmail(newToken, user.get('email'));
  }
}
