import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  AdminsBarbersRules,
  TIME_SLOT_REGEX,
  WeekDays,
} from 'src/common/resources/admins-barbers';

export class UpdateWorkingTimeDto {
  @ApiProperty({ type: () => Number, required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @IsEnum(WeekDays)
  readonly weekday: number;

  @ApiProperty({ type: () => String, required: true, default: '08:00:00' })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Matches(TIME_SLOT_REGEX)
  readonly startsAt: string;

  @ApiProperty({ type: () => String, required: true, default: '09:00:00' })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Matches(TIME_SLOT_REGEX)
  readonly endsAt: string;
}

export class UpdateWorkingTimesDto {
  @ApiProperty({ type: () => [UpdateWorkingTimeDto], required: true })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(AdminsBarbersRules.maxWeekDays)
  @ValidateNested()
  @Type(() => UpdateWorkingTimeDto)
  workingTimes: UpdateWorkingTimeDto[];
}
