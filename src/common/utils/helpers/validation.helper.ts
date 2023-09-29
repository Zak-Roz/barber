import { BadRequestException, HttpStatus } from '@nestjs/common';
import { TranslatorService } from 'nestjs-translator';

export class ValidationHelper {
  static emptyObjectFail(obj: object, translator: TranslatorService): void {
    if (!Object.keys(obj).length) {
      throw new BadRequestException({
        message: translator.translate('EMPTY_DATA'),
        errorCode: 'EMPTY_DATA',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
