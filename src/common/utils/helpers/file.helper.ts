import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/common/utils/config/config.service';

@Injectable()
export class FileHelper {
  private static instance: FileHelper;

  constructor(private readonly configService: ConfigService) {
    FileHelper.instance = this;
  }

  public static getInstance(): FileHelper {
    return FileHelper.instance;
  }

  buildBaseLink(fileKey: string): string {
    return `${this.configService.get('AWS_S3_DOMAIN')}/${this.configService.get(
      'AWS_S3_BUCKET_NAME',
    )}/${fileKey}`;
  }
}
