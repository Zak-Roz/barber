import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!roles) {
      return true;
    }
    if (!user.role) {
      return false;
    }
    return this.matchRoles(roles, user.role);
  }

  matchRoles(allowedRoles: number[], role: number): boolean {
    return allowedRoles.includes(role);
  }
}
