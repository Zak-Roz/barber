import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { EnumHelper } from 'src/common/utils/helpers/enum.helper';
import { FileTypes, FilesValidationRules } from 'src/common/resources/files';

const fileContentTypes: string[] = Object.keys(
  FilesValidationRules.filesContentTypes,
).reduce(
  (contentTypesArray, contentType) =>
    contentTypesArray.concat(
      ...FilesValidationRules.filesContentTypes[contentType].contentTypes,
    ),
  [],
);

export class FileContentTypeDto {
  @ApiProperty({
    type: () => String,
    required: true,
    enum: fileContentTypes,
    description: EnumHelper.toDescription(fileContentTypes),
  })
  @IsNotEmpty()
  @IsEnum(fileContentTypes)
  contentType: string;

  @ApiProperty({
    type: () => Number,
    required: true,
    enum: FileTypes,
    description: EnumHelper.toDescription(FileTypes),
  })
  @IsNotEmpty()
  @IsNumber()
  @IsEnum(FileTypes)
  type: number;
}
