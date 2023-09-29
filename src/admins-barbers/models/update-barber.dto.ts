import {
  IsEmail,
  IsOptional,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  EMAIL_REGEX,
  FIRST_LAST_NAME_REGEX,
  UsersValidationRules,
} from 'src/common/resources/users';

export class UpdateBarberDto {
  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @Length(
    UsersValidationRules.firstNameMinLength,
    UsersValidationRules.firstNameMaxLength,
  )
  @Matches(FIRST_LAST_NAME_REGEX)
  readonly firstName: string;

  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @Length(
    UsersValidationRules.lastNameMinLength,
    UsersValidationRules.lastNameMaxLength,
  )
  @Matches(FIRST_LAST_NAME_REGEX)
  readonly lastName: string;

  @ApiProperty({ type: () => String, required: true })
  @IsOptional()
  @Type(() => String)
  @IsEmail()
  @MaxLength(UsersValidationRules.emailMaxLength)
  @Matches(EMAIL_REGEX)
  readonly email: string;
}
