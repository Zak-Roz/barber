import { Provides } from 'src/common/resources/common/provides';
import { File } from './models/file.entity';
import { UsedUserPassword, User } from 'src/users/models';

export const modelProviders = [
  {
    provide: Provides.file,
    useValue: File,
  },
  {
    provide: Provides.user,
    useValue: User,
  },
  {
    provide: Provides.usedUserPassword,
    useValue: UsedUserPassword,
  },
];
