import * as crypto from 'crypto';

export class PasswordHelper {
  static hash(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static compare(password: string, hashedPassword: string): boolean {
    return this.hash(password) === hashedPassword;
  }

  static generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
