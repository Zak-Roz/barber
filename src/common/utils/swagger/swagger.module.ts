import { Module } from '@nestjs/common';
import { FileModule } from 'src/files/file.module';
import { SessionsModule } from 'src/sessions/sessions.module';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [UsersModule, SessionsModule, FileModule],
})
export class SwaggerAppModule {}
