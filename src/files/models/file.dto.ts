import { ApiProperty } from '@nestjs/swagger';
import { File } from './file.entity';
import { FileHelper } from 'src/common/utils/helpers/file.helper';
import { EnumHelper } from 'src/common/utils/helpers/enum.helper';
import { FileStatuses, FileTypes } from 'src/common/resources/files';

export class FileDto {
  constructor(file: File) {
    this.id = file.id;
    this.userId = file.userId;
    this.name = file.name;
    this.fileKey = file.fileKey;
    this.type = file.type;
    this.isUsed = file.isUsed;
    this.status = file.status;
    this.link = FileHelper.getInstance().buildBaseLink(this.fileKey);
  }

  @ApiProperty({ type: () => Number, required: true })
  readonly id: number;

  @ApiProperty({ type: () => Number, required: true })
  readonly userId: number;

  @ApiProperty({ type: () => String, required: false })
  readonly name: string;

  @ApiProperty({ type: () => String, required: false })
  readonly fileKey: string;

  @ApiProperty({
    type: () => Number,
    required: false,
    enum: FileTypes,
    description: EnumHelper.toDescription(FileTypes),
  })
  readonly type: FileTypes;

  @ApiProperty({ type: () => Boolean, required: false })
  readonly isUsed: boolean;

  @ApiProperty({
    type: () => Number,
    required: false,
    enum: FileStatuses,
    description: EnumHelper.toDescription(FileStatuses),
  })
  readonly status: FileStatuses;

  @ApiProperty({ type: () => String, required: false })
  readonly link: string;
}
