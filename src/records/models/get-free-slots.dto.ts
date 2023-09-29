import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOnlyDateByFormat } from 'src/common/resources/common/only-date-by-format.decorator';
import { IsDateNotEarlierThanDate } from 'src/common/resources/common/date-earlier-than-date.decorator';
import { DEFAULT_DATE_FORMAT } from 'src/common/resources/common/dataFormats';

export class GetFreeSlotsDto {
  @ApiProperty({ type: () => Number, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly barberId: number;

  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  @IsOnlyDateByFormat(DEFAULT_DATE_FORMAT)
  @IsDateNotEarlierThanDate(null)
  readonly date: string;
}
