import { Provides } from 'src/common/resources/common/provides';
import { Verification } from './models';
import { UsedUserPassword, User } from 'src/users/models';

export const modelProviders = [
  {
    provide: Provides.verification,
    useValue: Verification,
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
