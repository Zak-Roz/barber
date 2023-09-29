import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { guardProviders } from 'src/common/utils/guards/guard.provider';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { ConfigModule } from 'src/common/utils/config/config.module';
import { jwtModuleInstance } from 'src/common/utils/jwt/jwt.module';
import { sequelizeProvider } from 'src/common/utils/database/database.module';
import { modelProviders } from './models.provider';
import { SessionsService } from 'src/sessions/sessions.service';
import { LoggerModule } from 'src/common/utils/logger/logger.module';
import { entities } from 'src/common/utils/database/database-entity.provider';
import { FilesService } from 'src/files/file.service';
import { S3Service } from 'src/files/s3.service';
import { FileHelper } from 'src/common/utils/helpers/file.helper';
import { VerificationsService } from 'src/verifications/verification.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { UsedUserPasswordsService } from './used-user-password.service';
import { translatorInstance } from 'src/common/utils/translator/translator.provider';
import { MemcachedService } from 'src/common/utils/database/memcached.service';
import { CacheModuleInstance } from 'src/common/utils/database/memcache.provider';

@Module({
  imports: [
    CacheModuleInstance,
    ConfigModule,
    jwtModuleInstance,
    LoggerModule,
    MailerModule,
    translatorInstance,
  ],
  providers: [
    UsersService,
    UsedUserPasswordsService,
    FilesService,
    S3Service,
    FileHelper,
    SessionsService,
    MemcachedService,
    JwtStrategy,
    VerificationsService,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders,
  ],
  controllers: [UserController],
})
export class UsersModule {}
