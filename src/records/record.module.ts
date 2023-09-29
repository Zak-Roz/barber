import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { guardProviders } from 'src/common/utils/guards/guard.provider';
import { RecordController } from './record.controller';
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
import { MailerModule } from 'src/mailer/mailer.module';
import { translatorInstance } from 'src/common/utils/translator/translator.provider';
import { MemcachedService } from 'src/common/utils/database/memcached.service';
import { CacheModuleInstance } from 'src/common/utils/database/memcache.provider';
import { UsedUserPasswordsService } from 'src/users/used-user-password.service';
import { UsersService } from 'src/users/user.service';
import { RecordsService } from './records.service';
import { WorkingTimesService } from 'src/working-times/working-times.service';
import { FavorsService } from 'src/favor/favors.service';

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
    RecordsService,
    FavorsService,
    WorkingTimesService,
    UsedUserPasswordsService,
    FilesService,
    S3Service,
    FileHelper,
    SessionsService,
    MemcachedService,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders,
  ],
  controllers: [RecordController],
})
export class RecordsModule {}
