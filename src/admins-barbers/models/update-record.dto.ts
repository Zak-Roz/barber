import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TIME_SLOT_REGEX } from 'src/common/resources/admins-barbers';
import { IsOnlyDateByFormat } from 'src/common/resources/common/only-date-by-format.decorator';
import { IsDateNotEarlierThanDate } from 'src/common/resources/common/date-earlier-than-date.decorator';
import { DEFAULT_DATE_FORMAT } from 'src/common/resources/common/dataFormats';

export class UpdateRecordDto {
  @ApiProperty({ type: () => Number, required: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly barberId: number;

  @ApiProperty({ type: () => Number, required: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly favorId: number;

  @ApiProperty({ type: () => String, required: true })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @IsOnlyDateByFormat(DEFAULT_DATE_FORMAT)
  @IsDateNotEarlierThanDate(null)
  readonly date: string;

  @ApiProperty({ type: () => String, required: true, default: '08:00:00' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  @Matches(TIME_SLOT_REGEX)
  readonly startsAt: string;

  // @ApiProperty({ type: () => String, required: true, default: '17:00:00' })
  // @IsOptional()
  // @IsString()
  // @Type(() => String)
  // @Matches(TIME_SLOT_REGEX)
  // readonly endsAt: string;
}
