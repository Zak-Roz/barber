import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { AdminsBarbersRules } from 'src/common/resources/admins-barbers';

export class CreateFavorDto {
  @ApiProperty({ type: () => String, required: true })
  @Type(() => String)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : null))
  @IsNotEmpty()
  @Length(
    AdminsBarbersRules.favorNameMinLength,
    AdminsBarbersRules.favorNameMaxLength,
  )
  readonly name: string;

  @ApiProperty({ type: () => String, required: true })
  @Type(() => String)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : null))
  @IsNotEmpty()
  @Length(
    AdminsBarbersRules.favorDescriptionMinLength,
    AdminsBarbersRules.favorDescriptionMaxLength,
  )
  readonly description: string;

  @ApiProperty({ type: () => Number, required: true, default: 500 })
  @IsNotEmpty()
  @Type(() => Number)
  readonly price: number;

  @ApiProperty({ type: () => Number, required: true, default: 120 })
  @IsNotEmpty()
  @Type(() => Number)
  readonly duration: number;
}
