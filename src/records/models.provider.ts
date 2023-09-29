import { Provides } from 'src/common/resources/common/provides';
import { UsedUserPassword, User } from 'src/users/models';
import { File } from 'src/files/models';
import { Record } from './models';
import { WorkingTime } from 'src/working-times/models';
import { Favor } from 'src/favor/models';

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
    provide: Provides.record,
    useValue: Record,
  },
  {
    provide: Provides.workingTime,
    useValue: WorkingTime,
  },
  {
    provide: Provides.favor,
    useValue: Favor,
  },
];
