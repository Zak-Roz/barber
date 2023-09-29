import {
  Post,
  Controller,
  Body,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FilesContentTypesDto, FilesAwsMetaDto } from './models';
import { S3Service } from './s3.service';
import { UserRoles } from 'src/common/resources/users';
import { Roles } from 'src/common/resources/common/role.decorator';
import { UserSessionDto } from 'src/sessions/models';
import { FilesService } from './file.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: () => FilesAwsMetaDto })
  @ApiOperation({
    summary: 'Request for save files.',
  })
  @Roles(UserRoles.admin, UserRoles.user)
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async prepareLoadUrls(
    @Body() body: FilesContentTypesDto,
    @Request() req: Request & { user: UserSessionDto },
  ): Promise<FilesAwsMetaDto> {
    const filesRequests = this.filesService.prepareFiles(body, req.user);

    const awsResponses = await Promise.all(
      filesRequests.map(async (file) => {
        const awsResponse = await this.s3Service.createPresignedPost(
          file.key,
          file.contentType,
        );
        return Object.assign(awsResponse, file);
      }),
    );

    const files = await this.filesService.createFilesInDb(
      req.user.userId,
      filesRequests,
    );

    return new FilesAwsMetaDto(files, awsResponses);
  }
}
