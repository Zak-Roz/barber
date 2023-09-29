import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { ConfigService } from 'src/common/utils/config/config.service';
import { v4 as uuid } from 'uuid';
import SESTransport from 'nodemailer/lib/ses-transport';
import * as aws from '@aws-sdk/client-ses';
import { TranslatorService } from 'nestjs-translator';

@Injectable()
export class NodemailerService {
  private transporter: Transporter<SESTransport.SentMessageInfo>;

  constructor(
    private readonly translator: TranslatorService,
    private readonly configService: ConfigService,
  ) {
    const ses = new aws.SES({
      region: this.configService.get('AWS_SES_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_SES_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SES_KEY_SECRET'),
      },
      apiVersion: '2013-12-01',
    });

    this.transporter = createTransport({
      SES: { ses, aws },
    });
  }

  async sendMail(params: any) {
    try {
      const initialParams = params,
        emailsData = {};

      if (initialParams.attachments) {
        initialParams.attachments = initialParams.attachments.map(
          (attachment) => {
            if (attachment.cid) {
              return attachment;
            }

            return {
              filename: attachment.name,
              path: attachment.link,
            };
          },
        );
      }

      if (Array.isArray(initialParams.to)) {
        initialParams.to.forEach((address) => {
          const messageId = uuid();

          emailsData[messageId] = {
            from:
              params.mailFrom || this.configService.get('AWS_SES_FROM_MAIL'),
            messageId,
            ...params,
            to: address,
          };
        });
      } else {
        const messageId = uuid();
        emailsData[messageId] = {
          from: params.mailFrom || this.configService.get('AWS_SES_FROM_MAIL'),
          messageId,
          ...params,
          to: initialParams.to,
        };
      }

      if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') {
        for (const key of Object.keys(emailsData)) {
          try {
            await this.transporter.sendMail(emailsData[key]);
          } catch (e) {
            emailsData[key].status = e;
          }
        }
      } else {
        await Promise.all(
          Object.keys(emailsData).map((key) =>
            this.transporter.sendMail(emailsData[key]),
          ),
        );
      }
    } catch (error) {
      throw new BadGatewayException({
        message: this.translator.translate('EMAIL_SERVICE_ERROR'),
        errorCode: 'EMAIL_SERVICE_ERROR',
        statusCode: HttpStatus.BAD_GATEWAY,
      });
    }
  }
}
