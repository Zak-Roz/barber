import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { File } from './models';
import { Transaction } from 'sequelize/types';
import { TranslatorService } from 'nestjs-translator';
import { FilesContentTypesDto } from './models';
import { v4 as uuid } from 'uuid';
import { S3Service } from './s3.service';
import { Provides } from 'src/common/resources/common/provides';
import { BaseService } from 'src/common/base/base.service';
import {
  FileTypes,
  FilesValidationRules,
  FileStatuses,
} from 'src/common/resources/files';
import { UserSessionDto } from 'src/sessions/models';
import { UserRoles } from 'src/common/resources/users';
import { ScopeOptions } from 'sequelize';

interface IAwsFile {
  acl?: string;
  fileName?: string;
  key?: string;
  contentType: string;
  type: number;
}

@Injectable()
export class FilesService extends BaseService<File> {
  constructor(
    @Inject(Provides.file) protected readonly model: Repository<File>,
    private readonly translator: TranslatorService,
    private readonly s3Service: S3Service,
  ) {
    super(model);
  }

  createFilesInDb(userId: number, files: IAwsFile[]): Promise<File[]> {
    const filesForSave = files.map((file) => ({
      userId,
      name: file.fileName,
      fileKey: file.key,
      type: file.type,
    }));

    return this.model.bulkCreate(filesForSave);
  }

  async markFileAsUsed(fileId: number | number[], transaction?: Transaction) {
    await this.model.update(
      { isUsed: true },
      { transaction, where: { id: fileId } },
    );
  }

  async checkCanUse(
    fileId: number,
    type: FileTypes,
    transaction?: Transaction,
    userId?: number,
  ): Promise<void> {
    const scopes: (string | ScopeOptions)[] = [
      { method: ['byId', fileId] },
      { method: ['byType', type] },
    ];

    if (userId) {
      scopes.push({ method: ['byUser', userId] });
    }

    const file = await this.getOne(scopes, transaction);

    if (!file) {
      throw new NotFoundException({
        message: this.translator.translate('FILE_NOT_FOUND'),
        errorCode: 'FILE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    if (file.isUsed) {
      throw new BadRequestException({
        message: this.translator.translate('FILE_IS_USED'),
        errorCode: 'FILE_IS_USED',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      await this.s3Service.markFileAsUploaded(file, transaction);
    } catch (error) {
      throw new NotFoundException({
        message: this.translator.translate('FILE_NOT_FOUND'),
        errorCode: 'FILE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  prepareFiles(body: FilesContentTypesDto, user: UserSessionDto): IAwsFile[] {
    return body.files.map((file) => {
      let extension = '';
      const fileToCreate: IAwsFile = { ...file };

      if (
        !FilesValidationRules.supportedTypes[file.type].includes(
          file.contentType,
        )
      ) {
        throw new ForbiddenException({
          message: this.translator.translate('INVALID_FILE_TYPE'),
          errorCode: 'INVALID_FILE_TYPE',
          statusCode: HttpStatus.FORBIDDEN,
        });
      }

      Object.keys(FilesValidationRules.filesContentTypes).forEach(
        (contentType) => {
          if (
            FilesValidationRules.filesContentTypes[
              contentType
            ].contentTypes.includes(file.contentType)
          ) {
            extension =
              FilesValidationRules.filesContentTypes[contentType].extension;
          }
        },
      );

      fileToCreate.acl = 'public-read';
      fileToCreate.fileName = `pagato_${uuid()}.${extension}`;
      fileToCreate.key = `files/admins/${file.type}/${fileToCreate.fileName}`;
      if (user.role !== UserRoles.admin) {
        fileToCreate.key = `files/user_${user.userId}/${file.type}/${fileToCreate.fileName}`;
      }

      return fileToCreate;
    });
  }

  async checkAndDeleteByKey(key: string) {
    try {
      await this.s3Service.checkFileExistenceInBucket(key);
    } catch (err) {
      throw new NotFoundException({
        message: this.translator.translate('FILE_NOT_FOUND'),
        errorCode: 'FILE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    try {
      await this.s3Service.deleteFile(key);
    } catch (err) {
      throw new NotImplementedException({
        message: err.message,
        errorCode: 'FILE_NOT_FOUND',
        statusCode: HttpStatus.NOT_IMPLEMENTED,
      });
    }
  }

  async deleteFile(
    fileId: number,
    userId: number,
    type: FileTypes | FileTypes[],
    transaction?: Transaction,
  ) {
    const file = await this.getOne(
      [
        { method: ['byId', fileId] },
        { method: ['byUser', userId] },
        { method: ['byType', type] },
      ],
      transaction,
    );

    if (!file) {
      throw new NotFoundException({
        message: this.translator.translate('FILE_NOT_FOUND'),
        errorCode: 'FILE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    if (file.get('status') === FileStatuses.loaded) {
      await this.checkAndDeleteByKey(file.get('fileKey'));
    }

    await file.destroy({ transaction });
  }
}
