import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base/base.dto';
import { FileDto } from 'src/files/models';
import { User } from '.';
import { WorkingTimeDto } from 'src/working-times/models';

export class UserDto extends BaseDto {
  constructor(data: User) {
    super(data);
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.isVerified = data.isVerified;
    this.role = data.role;
    this.avatarId = data.avatarId || undefined;
    this.avatar = data.avatar ? new FileDto(data.avatar) : undefined;
    this.workingTime = data.workingTime?.length
      ? data.workingTime.map((item) => new WorkingTimeDto(item))
      : undefined;
  }

  @ApiProperty({ type: () => String, required: false })
  readonly firstName: string;

  @ApiProperty({ type: () => String, required: true })
  readonly lastName: string;

  @ApiProperty({ type: () => String, required: true })
  readonly email: string;

  @ApiProperty({ type: () => Boolean, required: true })
  readonly isVerified: boolean;

  @ApiProperty({ type: () => Number, required: true })
  readonly role: number;

  @ApiProperty({ type: () => Number, required: true })
  readonly avatarId?: number;

  @ApiProperty({ type: () => FileDto || undefined, required: false })
  readonly avatar?: FileDto;

  @ApiProperty({
    type: () => WorkingTimeDto || undefined,
    required: false,
    isArray: true,
  })
  readonly workingTime?: WorkingTimeDto[];
}
