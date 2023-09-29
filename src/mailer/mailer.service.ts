import { Injectable } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { ConfigService } from 'src/common/utils/config/config.service';
import { toASCII } from 'punycode/';
import { EmailContents } from 'src/common/resources/mailer';
import { User } from 'src/users/models';
import { TranslatorService } from 'nestjs-translator';

@Injectable()
export class MailerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly nodeMailer: NodemailerService,
    private readonly translator: TranslatorService,
  ) {}

  encodeEmail(email: string): string {
    const [localPart, domainPart] = email.split('@');

    return `${toASCII(localPart)}@${toASCII(domainPart)}`;
  }

  prepareParams(email: string, subject: string, html: string): any {
    return {
      from: this.configService.get('AWS_SES_FROM_MAIL'),
      to: this.encodeEmail(email),
      subject: this.translator.translate(subject),
      html,
    };
  }

  async sendVerificationEmail(
    verificationToken: string,
    email: string,
  ): Promise<void> {
    const verificationLink = `${this.configService.get(
      'FRONTEND_BASE_URL',
    )}/verify-email?token=${verificationToken}`;

    return this.nodeMailer.sendMail(
      this.prepareParams(
        email,
        'EMAIL_VERIFICATION',
        EmailContents.getEmailVerificationHtml(verificationLink),
      ),
    );
  }

  async sendResetPasswordEmail(
    user: User,
    verificationToken: string,
  ): Promise<void> {
    const verificationLink = `${this.configService.get(
      'FRONTEND_BASE_URL',
    )}/auth/reset-password?token=${verificationToken}`;

    return this.nodeMailer.sendMail(
      this.prepareParams(
        user.get('email'),
        'RESET_PASSWORD_SUBJECT',
        EmailContents.getResetPasswordHtml(user, verificationLink),
      ),
    );
  }
}
