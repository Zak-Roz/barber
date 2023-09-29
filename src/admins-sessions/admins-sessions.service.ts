import {
  HttpStatus,
  Injectable,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionDto, UserSessionDto } from 'src/sessions/models';
import { DateTime } from 'luxon';
import { ObjectKeyComposer } from 'src/common/utils/helpers/object-key-composer.helper';
import { v4 as uuid } from 'uuid';
import { ConfigService } from 'src/common/utils/config/config.service';
import { LoggerService } from 'src/common/utils/logger/logger.service';
import { UserRoles } from 'src/common/resources/users';
import { UsersService } from 'src/users/user.service';
import { TranslatorService } from 'nestjs-translator';
import { MemcachedService } from 'src/common/utils/database/memcached.service';

@Injectable()
export class AdminsSessionsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly memcachedService: MemcachedService,
    private readonly configService: ConfigService,
    private readonly translator: TranslatorService,
    private readonly loggerService: LoggerService,
    private readonly usersService: UsersService,
  ) {}

  getSessionAppendix(userId: number): string {
    return ObjectKeyComposer.createKey('user_session', userId);
  }

  async destroySessions(userId: number): Promise<void> {
    const sessionKey = this.getSessionAppendix(userId);

    const token = await this.memcachedService.get(sessionKey);

    if (token) {
      await this.memcachedService.del(token);
    }

    await this.memcachedService.del(sessionKey);
  }

  async create(userId: number, sessionOptions?: any): Promise<SessionDto> {
    const uniqueKey = uuid();

    this.loggerService.log(`Creating session ${uniqueKey}`);

    const tokenParams: UserSessionDto = {
      userId,
      role: sessionOptions.role,
      sessionId: uniqueKey,
    };

    const lifeTime =
      sessionOptions.lifeTime || this.configService.get('JWT_EXPIRES_IN');

    const accessToken = this.jwtService.sign(
      { data: tokenParams },
      { secret: this.configService.get('JWT_SECRET') },
    );

    await this.destroySessions(userId);
    console.log(1);
    await Promise.all([
      this.memcachedService.set(
        this.getSessionAppendix(userId),
        accessToken,
        lifeTime,
      ),
      this.memcachedService.set(
        accessToken,
        JSON.stringify(tokenParams),
        lifeTime,
      ),
    ]);

    const refreshToken = this.jwtService.sign(
      {
        data: {
          ...tokenParams,
          tokenType: 'refresh',
          accessToken,
        },
      },
      { secret: this.configService.get('JWT_SECRET') },
    );

    return new SessionDto(
      accessToken,
      refreshToken,
      DateTime.utc().plus({ milliseconds: lifeTime }).valueOf(),
    );
  }

  async findSession(accessToken: string): Promise<UserSessionDto> {
    const session = await this.memcachedService.get(accessToken);

    if (!session) {
      return null;
    }

    return JSON.parse(session);
  }

  async refresh(refreshToken: string): Promise<SessionDto> {
    const sessionParams = this.verifyToken(refreshToken);

    await this.usersService.getById(sessionParams.data.userId, [
      { method: ['byRoles', [UserRoles.admin]] },
    ]);

    const sessionKey = this.getSessionAppendix(sessionParams.data.userId);

    const existAccessToken = await this.memcachedService.get(sessionKey);

    if (existAccessToken !== sessionParams.data.accessToken) {
      throw new UnprocessableEntityException({
        message: this.translator.translate('TOKEN_EXPIRED'),
        errorCode: 'TOKEN_EXPIRED',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    await this.memcachedService.del(sessionParams.data.accessToken);

    const paramsForNewSession = {
      role: sessionParams.data.role,
    };

    return this.create(sessionParams.data.userId, paramsForNewSession);
  }

  verifyToken(token: string, error = 'TOKEN_EXPIRED'): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnprocessableEntityException({
          message: this.translator.translate(error),
          errorCode: error,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnprocessableEntityException({
          message: this.translator.translate('TOKEN_INVALID'),
          errorCode: 'TOKEN_INVALID',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      } else {
        throw new NotImplementedException();
      }
    }
  }
}
