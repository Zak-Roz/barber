import {
  Controller,
  HttpStatus,
  HttpCode,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/resources/common/role.decorator';
import { UserRoles } from 'src/common/resources/users';
import { Favor } from './models';
import { FavorsService } from './favors.service';
import { PaginationParams } from 'src/common/base/pagination-params.dto';
import { PaginationHelper } from 'src/common/utils/helpers/pagination.helper';
import { FavorsDto } from './models/favors.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { DEFAULT_CACHE_TTL } from 'src/common/resources/common/cache';

@ApiTags('favor')
@Controller('favor')
export class FavorController {
  constructor(private readonly favorsService: FavorsService) {}

  @ApiOperation({ summary: 'Get list of favors' })
  @ApiBearerAuth()
  @Roles(UserRoles.user)
  @ApiOkResponse({ type: () => FavorsDto })
  @HttpCode(HttpStatus.OK)
  @CacheTTL(DEFAULT_CACHE_TTL)
  @UseInterceptors(CacheInterceptor)
  @Get('')
  async getListFavor(@Query() query: PaginationParams): Promise<FavorsDto> {
    let items: Favor[] = [];

    const count = await this.favorsService.getCount();

    if (count) {
      items = await this.favorsService.getList([
        { method: ['pagination', query.limit, query.offset] },
      ]);
    }

    return new FavorsDto(items, PaginationHelper.buildPagination(query, count));
  }
}
