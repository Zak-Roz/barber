import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  readonly password: string;
}
