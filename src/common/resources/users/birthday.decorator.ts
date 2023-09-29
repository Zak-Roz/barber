import { registerDecorator, ValidationOptions } from 'class-validator';
import { DateTime } from 'luxon';

export const IS_BIRTHDAY = 'IsBirthday';

export function IsBirthday(validationOptions?: ValidationOptions) {
  return function(object: object, propertyName: string) {
    registerDecorator({
      name: IS_BIRTHDAY,
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { ...validationOptions },
      validator: {
        validate(value: string): boolean {
          const birthday = DateTime.fromISO(value);

          const currentDate = DateTime.now();
          const age = currentDate.diff(birthday, 'years').years;

          return age >= 18;
        },
      },
    });
  };
}
