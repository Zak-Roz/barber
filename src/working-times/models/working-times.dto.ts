import { ApiProperty } from '@nestjs/swagger';
import { WorkingTime, WorkingTimeDto } from '.';

export class WorkingTimesDto {
  constructor(data: WorkingTime[]) {
    this.data = data.map((item) => new WorkingTimeDto(item));
  }

  @ApiProperty({ type: () => [WorkingTimeDto] })
  readonly data: WorkingTimeDto[];
}
