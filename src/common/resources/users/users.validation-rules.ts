export const UsersValidationRules = {
  firstNameMinLength: 2,
  firstNameMaxLength: 20,
  lastNameMinLength: 2,
  lastNameMaxLength: 20,
  passwordMinLength: 8,
  passwordMaxLength: 50,
  passwordRequirements: {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  },
  emailMaxLength: 129,
};

export const FIRST_LAST_NAME_REGEX =
  /^[A-Za-zÀàÂâÄäÉéÈèÊêËëÎîÏïÔôŒœÙùÛûÜüÇç]+$/;
export const NO_PASSWORD_SPACE_REGEX = /^[^\s]+$/;
export const EMAIL_REGEX = /^(.{2,64})@(.{2,64})$/;
export const SIN_REGEX = /^\d{9}$/;
