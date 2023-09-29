import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { UsersService } from 'src/users/user.service';
import { AdminsSessionsController } from './admins-sessions.controller';
import { AdminsSessionsService } from './admins-sessions.service';
import { guardProviders } from 'src/common/utils/guards/guard.provider';
import { ConfigModule } from 'src/common/utils/config/config.module';
import { jwtModuleInstance } from 'src/common/utils/jwt/jwt.module';
import { sequelizeProvider } from 'src/common/utils/database/database.module';
import { modelProviders } from './model.provider';
import { LoggerModule } from 'src/common/utils/logger/logger.module';
import { entities } from 'src/common/utils/database/database-entity.provider';
import { VerificationsService } from 'src/verifications/verification.service';
import { MailerService } from 'src/mailer/mailer.service';
import { NodemailerService } from 'src/mailer/nodemailer.service';
import { UsedUserPasswordsService } from 'src/users/used-user-password.service';
import { FileHelper } from 'src/common/utils/helpers/file.helper';
import { translatorInstance } from 'src/common/utils/translator/translator.provider';
import { MemcachedService } from 'src/common/utils/database/memcached.service';
import { CacheModuleInstance } from 'src/common/utils/database/memcache.provider';
import { SessionsService } from 'src/sessions/sessions.service';

@Module({
  imports: [
    CacheModuleInstance,
    ConfigModule,
    jwtModuleInstance,
    LoggerModule,
    translatorInstance,
  ],
  controllers: [AdminsSessionsController],
  providers: [
    AdminsSessionsService,
    UsersService,
    MemcachedService,
    UsedUserPasswordsService,
    MailerService,
    NodemailerService,
    SessionsService,
    VerificationsService,
    FileHelper,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders,
  ],
})
export class AdminsSessionsModule {}
