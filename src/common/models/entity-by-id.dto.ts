import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class EntityByIdDto {
  @ApiProperty({ type: () => Number, required: true })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  readonly id: number;
}
