import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  constructor(data: any) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  @ApiProperty({ type: () => Number, required: true })
  readonly id: number;

  @ApiProperty({ type: () => String, required: true })
  readonly createdAt: string;

  @ApiProperty({ type: () => String, required: true })
  readonly updatedAt: string;
}
