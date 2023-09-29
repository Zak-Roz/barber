import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base/base.dto';
import { WorkingTime } from '.';
import { UserDto } from 'src/users/models';

export class WorkingTimeDto extends BaseDto {
  constructor(data: WorkingTime) {
    super(data);
    this.userId = data.userId;
    this.weekday = data.weekday;
    this.startsAt = data.startsAt;
    this.endsAt = data.endsAt;
    this.user = data.user ? new UserDto(data.user) : undefined;
  }

  @ApiProperty({ type: () => Number, required: true })
  readonly userId: number;

  @ApiProperty({ type: () => Number, required: true })
  readonly weekday: number;

  @ApiProperty({ type: () => String, required: true })
  readonly startsAt: string;

  @ApiProperty({ type: () => String, required: true })
  readonly endsAt: string;

  @ApiProperty({ type: () => UserDto, required: false })
  readonly user?: UserDto;
}
