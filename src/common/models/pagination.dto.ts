import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly totalCount: number;
    @ApiProperty({ type: () => Number, required: true })
    readonly nextOffset: number;
    @ApiProperty({ type: () => Number, required: true })
    readonly nextPage: number;

    constructor(nextOffset: number, nextPage: number, totalCount: number) {
      this.nextOffset = nextOffset;
      this.nextPage = nextPage;
      this.totalCount = totalCount;
    }
}
