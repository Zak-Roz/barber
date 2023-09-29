import {
  IsEmail,
  IsOptional,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  EMAIL_REGEX,
  FIRST_LAST_NAME_REGEX,
  NO_PASSWORD_SPACE_REGEX,
  UsersValidationRules,
} from 'src/common/resources/users';

export class UpdateUserDto {
  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @Length(
    UsersValidationRules.firstNameMinLength,
    UsersValidationRules.firstNameMaxLength,
  )
  @Matches(FIRST_LAST_NAME_REGEX)
  readonly firstName?: string;

  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @Length(
    UsersValidationRules.lastNameMinLength,
    UsersValidationRules.lastNameMaxLength,
  )
  @Matches(FIRST_LAST_NAME_REGEX)
  readonly lastName?: string;

  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  @Type(() => String)
  @IsEmail()
  @MaxLength(UsersValidationRules.emailMaxLength)
  @Matches(EMAIL_REGEX)
  readonly email?: string;

  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @Length(
    UsersValidationRules.passwordMinLength,
    UsersValidationRules.passwordMaxLength,
  )
  @IsStrongPassword(UsersValidationRules.passwordRequirements)
  @Matches(NO_PASSWORD_SPACE_REGEX)
  readonly password?: string;
}
