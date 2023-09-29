import { Transaction } from 'sequelize/types';
import { Injectable } from '@nestjs/common';
import { S3, HeadObjectCommandOutput } from '@aws-sdk/client-s3';
import {
  createPresignedPost as s3CreatePresignedPost,
  PresignedPost,
} from '@aws-sdk/s3-presigned-post';
import { ConfigService } from 'src/common/utils/config/config.service';
import { File } from './models/file.entity';
import { FileStatuses } from 'src/common/resources/files';

@Injectable()
export class S3Service {
  private readonly s3Connection: S3;
  readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get('AWS_S3_BUCKET_NAME');

    this.s3Connection = new S3({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_KEY_SECRET'),
      },
    });
  }

  createPresignedPost(
    key: string,
    contentType: string,
  ): Promise<PresignedPost> {
    const params = {
      Bucket: this.bucket,
      Conditions: [{ acl: 'public-read' }, { 'Content-Type': contentType }],
      Key: key,
    };

    return s3CreatePresignedPost(this.s3Connection, params);
  }

  async checkFileExistenceInBucket(
    Key: string,
  ): Promise<HeadObjectCommandOutput> {
    return this.s3Connection.headObject({ Key, Bucket: this.bucket });
  }

  async markFileAsUploaded(
    file: File,
    transaction?: Transaction,
  ): Promise<void> {
    if (file.status !== FileStatuses.loaded) {
      await this.checkFileExistenceInBucket(`${file.fileKey}`);

      await file.update({ status: FileStatuses.loaded }, { transaction });
    }
  }

  async deleteFile(key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    return this.s3Connection.deleteObject(params);
  }
}
