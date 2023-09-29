import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TIME_SLOT_REGEX } from 'src/common/resources/admins-barbers';
import { IsOnlyDateByFormat } from 'src/common/resources/common/only-date-by-format.decorator';
import { DEFAULT_DATE_FORMAT } from 'src/common/resources/common/dataFormats';
import { IsDateNotEarlierThanDate } from 'src/common/resources/common/date-earlier-than-date.decorator';

export class CreateRecordDto {
  @ApiProperty({ type: () => Number, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly barberId: number;

  @ApiProperty({ type: () => Number, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly favorId: number;

  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  @IsOnlyDateByFormat(DEFAULT_DATE_FORMAT)
  @IsDateNotEarlierThanDate(null)
  readonly date: string;

  @ApiProperty({ type: () => String, required: true, default: '08:00:00' })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Matches(TIME_SLOT_REGEX)
  readonly startsAt: string;
}
