import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { guardProviders } from 'src/common/utils/guards/guard.provider';
import { ConfigModule } from 'src/common/utils/config/config.module';
import { jwtModuleInstance } from 'src/common/utils/jwt/jwt.module';
import { SessionsService } from 'src/sessions/sessions.service';
import { LoggerModule } from 'src/common/utils/logger/logger.module';
import { entities } from 'src/common/utils/database/database-entity.provider';
import { VerificationsService } from './verification.service';
import { VerificationsController } from './verification.controller';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from 'src/users/user.service';
import { NodemailerService } from 'src/mailer/nodemailer.service';
import { UsedUserPasswordsService } from 'src/users/used-user-password.service';
import { FileHelper } from 'src/common/utils/helpers/file.helper';
import { translatorInstance } from 'src/common/utils/translator/translator.provider';
import { modelProviders } from './models.provider';
import { sequelizeProvider } from 'src/common/utils/database/database.module';
import { MemcachedService } from 'src/common/utils/database/memcached.service';
import { CacheModuleInstance } from 'src/common/utils/database/memcache.provider';

@Module({
  imports: [
    CacheModuleInstance,
    ConfigModule,
    jwtModuleInstance,
    LoggerModule,
    translatorInstance,
  ],
  providers: [
    VerificationsService,
    UsedUserPasswordsService,
    MemcachedService,
    SessionsService,
    FileHelper,
    UsersService,
    MailerService,
    NodemailerService,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders,
  ],
  controllers: [VerificationsController],
})
export class VerificationsModule {}
