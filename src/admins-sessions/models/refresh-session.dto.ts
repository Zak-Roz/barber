import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshSessionDto {
  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  readonly refreshToken: string;
}
