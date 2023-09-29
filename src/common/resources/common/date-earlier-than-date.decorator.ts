import {
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { DateTime } from 'luxon';
import { DEFAULT_DATE_FORMAT } from './dataFormats';

export const IS_DATE_NOT_EARLIER_THAN_DATE = 'IsDateNotEarlierThanDate';

export function IsDateNotEarlierThanDate(
  field?: string | null,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: IS_DATE_NOT_EARLIER_THAN_DATE,
      target: object.constructor,
      propertyName,
      constraints: [field],
      options: { ...validationOptions },
      validator: {
        validate(value: string, args: ValidationArguments) {
          const date = DateTime.fromISO(value);
          const startDate = args?.constraints[0]
            ? DateTime.fromISO(args.object[args?.constraints[0]])
            : null;
          const today = DateTime.fromISO(
            DateTime.now().toFormat(DEFAULT_DATE_FORMAT),
          );

          if (startDate) {
            return date >= startDate;
          }

          return date >= today;
        },
      },
    });
  };
}
