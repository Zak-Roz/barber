import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base/base.dto';
import { Record } from '.';
import { UserDto } from 'src/users/models';
import { FavorDto } from 'src/favor/models';

export class RecordDto extends BaseDto {
  constructor(data: Record) {
    super(data);

    this.clientId = data.clientId;
    this.barberId = data.barberId;
    this.favorId = data.favorId;
    this.date = data.date;
    this.startsAt = data.startsAt;
    this.endsAt = data.endsAt;
    this.client = data.client ? new UserDto(data.client) : undefined;
    this.barber = data.barber ? new UserDto(data.barber) : undefined;
    this.favor = data.favor ? new FavorDto(data.favor) : undefined;
  }

  @ApiProperty({ type: () => Number, required: true })
  readonly clientId: number;

  @ApiProperty({ type: () => Number, required: true })
  readonly barberId: number;

  @ApiProperty({ type: () => Number, required: true })
  readonly favorId: number;

  @ApiProperty({ type: () => String, required: true })
  readonly date: string;

  @ApiProperty({ type: () => String, required: true })
  readonly startsAt: string;

  @ApiProperty({ type: () => String, required: true })
  readonly endsAt: string;

  @ApiProperty({ type: () => UserDto, required: false })
  readonly client?: UserDto;

  @ApiProperty({ type: () => UserDto, required: false })
  readonly barber?: UserDto;

  @ApiProperty({ type: () => FavorDto, required: false })
  readonly favor?: FavorDto;
}
