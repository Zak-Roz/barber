import { UserDto } from 'src/users/models';
import { SessionDto } from './session.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserSessionResponseDto {
  constructor(user: UserDto, session?: SessionDto | undefined) {
    this.user = user;
    this.session = session || undefined;
  }

  @ApiProperty({ type: () => UserDto, required: true })
  readonly user: UserDto;

  @ApiProperty({ type: () => SessionDto, required: false })
  readonly session?: SessionDto;
}
