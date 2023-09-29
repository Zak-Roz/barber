import { Provides } from 'src/common/resources/common/provides';
import { UsedUserPassword, User } from 'src/users/models';
import { Verification } from 'src/verifications/models';

export const modelProviders = [
  {
    provide: Provides.user,
    useValue: User,
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
