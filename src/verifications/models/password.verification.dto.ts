import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsStrongPassword, Length, Matches } from 'class-validator';
import { TokenVerificationDto } from './token.verification.dto';
import {
  NO_PASSWORD_SPACE_REGEX,
  UsersValidationRules,
} from 'src/common/resources/users';

export class PasswordVerificationDto extends TokenVerificationDto {
  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  @Type(() => String)
  @Length(
    UsersValidationRules.passwordMinLength,
    UsersValidationRules.passwordMaxLength,
  )
  @IsStrongPassword(UsersValidationRules.passwordRequirements)
  @Matches(NO_PASSWORD_SPACE_REGEX)
  readonly password: string;
}
