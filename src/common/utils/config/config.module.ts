import { Global, Module } from '@nestjs/common';
import { configProvider } from './config.provider';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [configProvider, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
