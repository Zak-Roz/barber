import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from 'src/common/base/pagination-params.dto';

export enum OrderType {
  desc = 'descend',
  asc = 'ascend',
}

export function OrderParamsFactory(orderByEnum: object) {
  class OrderParams extends PaginationParams {
    @IsOptional()
    @ApiProperty({ type: () => String, required: false })
    @Type(() => String)
    @IsString()
    @IsEnum(orderByEnum)
    readonly orderBy?: string;

    @IsOptional()
    @ApiProperty({ enum: OrderType, required: false })
    @IsEnum(OrderType)
    readonly orderType?: OrderType;
  }

  return OrderParams;
}
