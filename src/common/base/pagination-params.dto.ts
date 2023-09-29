import { Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationParams {
  @ApiProperty({ type: () => Number, required: true, default: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly limit: number = 100;

  @ApiProperty({ type: () => Number, required: true, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly offset: number = 0;
}
