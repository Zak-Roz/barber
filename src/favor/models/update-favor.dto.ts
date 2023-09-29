import { IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { AdminsBarbersRules } from 'src/common/resources/admins-barbers';

export class UpdateFavorDto {
  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : null))
  @IsOptional()
  @Length(
    AdminsBarbersRules.favorNameMinLength,
    AdminsBarbersRules.favorNameMaxLength,
  )
  readonly name: string;

  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : null))
  @IsOptional()
  @Length(
    AdminsBarbersRules.favorDescriptionMinLength,
    AdminsBarbersRules.favorDescriptionMaxLength,
  )
  readonly description: string;

  @ApiProperty({ type: () => Number, required: false, default: 500 })
  @IsOptional()
  @Type(() => Number)
  readonly price: number;

  @ApiProperty({ type: () => Number, required: false, default: 120 })
  @IsOptional()
  @Type(() => Number)
  readonly duration: number;
}
