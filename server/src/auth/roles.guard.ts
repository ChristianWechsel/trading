import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role, TokenPayload } from './type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const request = context.switchToHttp().getRequest<Request>();
      if ('user' in request) {
        const user = request['user'] as TokenPayload;
        return requiredRoles.some((role) => user.role === role);
      }
    } catch (error) {
      console.error('Error retrieving roles:', error);
    }

    throw new ForbiddenException('You do not have the required role.');
  }
}
