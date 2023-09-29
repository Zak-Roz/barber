import { UserRoles } from 'src/common/resources/users';

export class UserSessionDto {
  constructor(data: { [key: string]: any }) {
    this.userId = data.userId;
    this.role = data.role;
    this.sessionId = data.sessionId;
  }

  readonly userId: number;
  readonly role: UserRoles;
  readonly sessionId: string;
}
