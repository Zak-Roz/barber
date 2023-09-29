import { PaginationDto } from '../../models/pagination.dto';

export class PaginationHelper {
  static buildPagination(
    query: { limit: number; offset: number },
    count: number,
  ): PaginationDto {
    return new PaginationDto(
      query.offset + query.limit,
      (query.offset + query.limit) / query.limit + 1,
      count,
    );
  }
}
