import { Provides } from 'src/common/resources/common/provides';
import { UsedUserPassword, User } from './models';
import { File } from 'src/files/models';
import { Verification } from 'src/verifications/models';

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
];
