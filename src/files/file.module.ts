import { Module } from '@nestjs/common';
import { FilesController } from './file.controller';
import { FilesService } from './file.service';
import { translatorInstance } from 'src/common/utils/translator/translator.provider';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { FileHelper } from 'src/common/utils/helpers/file.helper';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { LoggerService } from 'src/common/utils/logger/logger.service';
import { sequelizeProvider } from 'src/common/utils/database/database.module';
import { entities } from 'src/common/utils/database/database-entity.provider';
import { jwtModuleInstance } from 'src/common/utils/jwt/jwt.module';
import { modelProviders } from './models.provider';
import { guardProviders } from 'src/common/utils/guards/guard.provider';
import { SessionsService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/user.service';
import { UsedUserPasswordsService } from 'src/users/used-user-password.service';
import { MemcachedService } from 'src/common/utils/database/memcached.service';
import { CacheModuleInstance } from 'src/common/utils/database/memcache.provider';

@Module({
  imports: [
    CacheModuleInstance,
    translatorInstance,
    ConfigModule,
    jwtModuleInstance,
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    SessionsService,
    UsersService,
    MemcachedService,
    UsedUserPasswordsService,
    S3Service,
    FileHelper,
    JwtStrategy,
    LoggerService,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders,
  ],
})
export class FileModule {}
