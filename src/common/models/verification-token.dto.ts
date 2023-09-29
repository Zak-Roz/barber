import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerificationTokenDto {
  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  readonly token: string;
}
