import { Module } from '@nestjs/common';
import { translatorInstance } from 'src/common/utils/translator/translator.provider';
import { MailerService } from './mailer.service';
import { ConfigModule } from 'src/common/utils/config/config.module';
import { LoggerModule } from 'src/common/utils/logger/logger.module';
import { NodemailerService } from './nodemailer.service';
import { CacheModuleInstance } from 'src/common/utils/database/memcache.provider';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    translatorInstance,
    CacheModuleInstance,
  ],
  providers: [MailerService, NodemailerService],
  exports: [MailerService, NodemailerService],
})
export class MailerModule {}
