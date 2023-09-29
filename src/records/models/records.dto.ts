import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/models/pagination.dto';
import { RecordDto } from './record.dto';
import { Record } from './record.entity';

export class RecordsDto {
  constructor(items: Record[], pagination: PaginationDto) {
    this.data = items.map((item: Record) => new RecordDto(item));
    this.pagination = pagination;
  }

  @ApiProperty({ type: () => [RecordDto] })
  readonly data: RecordDto[];

  @ApiProperty({ type: () => PaginationDto, required: true })
  readonly pagination: PaginationDto;
}
