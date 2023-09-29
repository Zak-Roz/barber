import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { PaginationDto } from 'src/common/models/pagination.dto';

export class UsersDto {
  constructor(users: User[], pagination: PaginationDto) {
    this.data = users.map((user: User) => new UserDto(user));
    this.pagination = pagination;
  }

  @ApiProperty({ type: () => [UserDto] })
  readonly data: UserDto[];

  @ApiProperty({ type: () => PaginationDto, required: true })
  readonly pagination: PaginationDto;
}
