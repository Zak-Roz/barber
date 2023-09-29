import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../users';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
