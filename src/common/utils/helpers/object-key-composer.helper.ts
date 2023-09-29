const IS_INT = /^-?[0-9]+$/;

export class ObjectKeyComposer {
  static createKey(name: string, value: number | string): string {
    return `${name}[${value}]`;
  }

  static extract(key: string, regExp: RegExp): number | string | null {
    const res = key.match(regExp);

    if (!res || !res[1]) {
      return null;
    }

    if (!IS_INT.test(res[1])) {
      return res[1];
    }

    return parseInt(res[1], 10);
  }
}
