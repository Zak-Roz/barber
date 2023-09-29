export class MathHelper {
  static generateRandomNumbers(length: number): string {
    let digits = '';

    for (let i = 0; i < length; i++) {
      const randomDigit = Math.floor(Math.random() * 10);
      digits += randomDigit;
    }

    return digits;
  }
}
