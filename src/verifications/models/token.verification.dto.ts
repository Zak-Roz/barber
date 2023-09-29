import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class TokenVerificationDto {
  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  @Type(() => String)
  @IsJWT()
  token: string;
}
