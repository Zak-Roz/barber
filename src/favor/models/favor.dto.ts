import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base/base.dto';
import { Favor } from '.';

export class FavorDto extends BaseDto {
  constructor(data: Favor) {
    super(data);
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.duration = data.duration;
  }

  @ApiProperty({ type: () => String, required: true })
  readonly name: string;

  @ApiProperty({ type: () => String, required: true })
  readonly description: string;

  @ApiProperty({ type: () => Number, required: true })
  readonly price: number;

  @ApiProperty({ type: () => Number, required: true })
  readonly duration: number;
}
