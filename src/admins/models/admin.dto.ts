import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base/base.dto';
import { User } from 'src/users/models';

export class AdminDto extends BaseDto {
  constructor(data: User) {
    super(data);
    this.email = data.email;
    this.isVerified = data.isVerified;
    this.role = data.role;
  }

  @ApiProperty({ type: () => String, required: true })
  readonly email: string;

  @ApiProperty({ type: () => Boolean, required: true })
  readonly isVerified: boolean;

  @ApiProperty({ type: () => Number, required: true })
  readonly role: number;
}
