import { ApiProperty } from '@nestjs/swagger';
import { AwsMetaDto } from './aws-meta.dto';
import { FileDto } from './file.dto';
import { File } from './file.entity';

class FilesAwsMeta {
  @ApiProperty({ type: () => [FileDto], required: true })
  file: FileDto;

  @ApiProperty({ type: () => [AwsMetaDto], required: true })
  meta: AwsMetaDto;
}

export class FilesAwsMetaDto {
  @ApiProperty({ type: () => [FilesAwsMeta], required: true })
  readonly files: FilesAwsMeta[];

  constructor(files: File[], awsResponses: any) {
    this.files = files.map((file, index) => ({
      file: new FileDto(file),
      meta: new AwsMetaDto(awsResponses[index]),
    }));
  }
}
