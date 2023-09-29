import {
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { DateTime } from 'luxon';
import { DEFAULT_DATE_FORMAT } from './dataFormats';

export const IS_ONLY_DATE_BY_FORMAT = 'IsOnlyDateByFormat';

export function IsOnlyDateByFormat(
  format: string = DEFAULT_DATE_FORMAT,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: IS_ONLY_DATE_BY_FORMAT,
      target: object.constructor,
      propertyName,
      constraints: [format],
      options: { ...validationOptions },
      validator: {
        validate: (value: string, args: ValidationArguments) =>
          value !== null &&
          value !== undefined &&
          DateTime.fromFormat(value, args?.constraints[0]).isValid,
      },
    });
  };
}
