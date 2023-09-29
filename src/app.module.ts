import { Module } from '@nestjs/common';
import { ConfigModule } from './common/utils/config/config.module';
import { UsersModule } from './users/user.module';
import { FileModule } from './files/file.module';
import { SessionsModule } from './sessions/sessions.module';
import { guardProviders } from 'src/common/utils/guards/guard.provider';
import { VerificationsModule } from './verifications/verification.module';
import { translatorInstance } from './common/utils/translator/translator.provider';
import { jwtModuleInstance } from './common/utils/jwt/jwt.module';
import { AdminsModule } from './admins/admin.module';
import { AdminBarbersModule } from './admins-barbers/admin-barber.module';
import { AdminsSessionsModule } from './admins-sessions/admins-sessions.module';
import { FavorsModule } from './favor/favor.module';
import { WorkingTimesModule } from './working-times/working-time.module';
import { RecordsModule } from './records/record.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    FileModule,
    AdminsModule,
    AdminsSessionsModule,
    AdminBarbersModule,
    FavorsModule,
    WorkingTimesModule,
    RecordsModule,
    VerificationsModule,
    ConfigModule,
    translatorInstance,
    jwtModuleInstance,
  ],
  providers: [...guardProviders],
})
export class AppModule {}
