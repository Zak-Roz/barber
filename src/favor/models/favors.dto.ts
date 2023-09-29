import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/models/pagination.dto';
import { Favor } from './favor.entity';
import { FavorDto } from './favor.dto';

export class FavorsDto {
  constructor(items: Favor[], pagination: PaginationDto) {
    this.data = items.map((item: Favor) => new FavorDto(item));
    this.pagination = pagination;
  }

  @ApiProperty({ type: () => [FavorDto] })
  readonly data: FavorDto[];

  @ApiProperty({ type: () => PaginationDto, required: true })
  readonly pagination: PaginationDto;
}
