import { Provides } from 'src/common/resources/common/provides';
import { UsedUserPassword, User } from 'src/users/models';
import { File } from 'src/files/models';
import { Verification } from 'src/verifications/models';
import { Favor } from 'src/favor/models';
import { Record } from 'src/records/models';
import { WorkingTime } from 'src/working-times/models';

export const modelProviders = [
  {
    provide: Provides.user,
    useValue: User,
  },
  {
    provide: Provides.file,
    useValue: File,
  },
  {
    provide: Provides.verification,
    useValue: Verification,
  },
  {
    provide: Provides.usedUserPassword,
    useValue: UsedUserPassword,
  },
  {
    provide: Provides.favor,
    useValue: Favor,
  },
  {
    provide: Provides.record,
    useValue: Record,
  },
  {
    provide: Provides.workingTime,
    useValue: WorkingTime,
  },
];
