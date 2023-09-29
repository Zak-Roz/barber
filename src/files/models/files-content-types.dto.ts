import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { FileContentTypeDto } from './file-content-type.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FilesValidationRules } from 'src/common/resources/files';

export class FilesContentTypesDto {
  @ApiProperty({ type: () => [FileContentTypeDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(FilesValidationRules.maxUploadFiles)
  @ValidateNested()
  @Type(() => FileContentTypeDto)
  files: FileContentTypeDto[];
}
