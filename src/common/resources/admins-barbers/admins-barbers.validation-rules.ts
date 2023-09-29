export const AdminsBarbersRules = {
  favorNameMinLength: 2,
  favorNameMaxLength: 100,
  favorDescriptionMinLength: 10,
  favorDescriptionMaxLength: 500,
  priceMinValue: 1,
  priceMaxValue: 10000,
  durationMinValue: 10,
  durationMaxValue: 180,
  maxWeekDays: 7,
};

export const TIME_SLOT_REGEX = /^([01]\d|2[0-3]):?(00|15|30|45):00$/;
