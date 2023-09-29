import { Favor } from 'src/favor/models';
import { File } from 'src/files/models';
import { Record } from 'src/records/models';
import { UsedUserPassword, User } from 'src/users/models';
import { Verification } from 'src/verifications/models';
import { WorkingTime } from 'src/working-times/models';

export const entities = [
  User,
  Verification,
  UsedUserPassword,
  File,
  WorkingTime,
  Record,
  Favor,
];
