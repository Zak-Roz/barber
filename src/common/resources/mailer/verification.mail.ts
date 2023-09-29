import { User } from 'src/users/models';

export const EmailContents = {
  getEmailVerificationHtml: (verificationLink: string): string => `
    <p>Thank you for registering with our platform! We're excited to have you as a part of our community. To complete the registration process and ensure the security of your account, we kindly request you to verify your email address.</p>
    <p><a href="${verificationLink}">Verify your email address</a></p>
    <p>Once you've verified your email, you'll have full access to all the features and benefits our platform offers.</p>
    <p>Thank you for choosing our platform. We look forward to providing you with a great experience!</p>
    <p>Best regards,</p>
    <p>Guxamit Team</p>
  `,
  getResetPasswordHtml: (user: User, verificationLink: string): string => `
    <p>Dear ${user.get('firstName')} ${user.get('lastName')},</p>
    <p>We hope this email finds you well. It seems that you've recently requested to reset your password for your Guxamit account. Don't worry; we've got you covered!</p>
    <p>To proceed with resetting your password, please follow the instructions below:</p>
    <ol>
      <li>Click on the following link to access the password reset page: <a href="${verificationLink}">Reset Password Button</a></li>
      <li>If the link does not work, copy and paste this URL into your web browser: ${verificationLink}</li>
    </ol> 
    <p>Please note that this link is valid for the next 24 hours. After that, you'll need to request another password reset.</p>
    <p>If you didn't initiate this password reset request, please ignore this email. Rest assured, your account is safe and secure.</p>
    <p>For your security, we recommend creating a strong and unique password that includes a mix of upper and lower case letters, numbers, and special characters.</p>
    <p>Thank you for being a valued member of our community. If you have any questions or need further assistance, feel free to reach out to our support team.</p>
    <p>Best regards,</p>
    <p>Guxamit Team</p>
  `,
};
