import { Provides } from 'src/common/resources/common/provides';
import { UsedUserPassword, User } from 'src/users/models';
import { File } from 'src/files/models';
import { WorkingTime } from './models';

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
    provide: Provides.usedUserPassword,
    useValue: UsedUserPassword,
  },
  {
    provide: Provides.workingTime,
    useValue: WorkingTime,
  },
];
