import { ApiProperty } from '@nestjs/swagger';
import { EMAIL_REGEX, UsersValidationRules } from 'src/common/resources/users';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class ResendEmailVerificationDto {
  @ApiProperty({ type: () => String, required: true })
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(UsersValidationRules.emailMaxLength)
  @Matches(EMAIL_REGEX)
  readonly email: string;
}
