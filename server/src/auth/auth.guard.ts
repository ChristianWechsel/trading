import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { TokenPayload } from './type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicMethod(context)) {
      return true;
    }

    try {
      const authToken = this.getAuthTokenFromRequest(context);
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync<object>(authToken, {
        secret,
      });
      this.addUserToRequest(context, payload as TokenPayload);
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private isPublicMethod(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getAuthTokenFromRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies as Record<string, string>;
    if (!cookies) {
      throw new Error();
    }

    if (!('auth_token' in cookies)) {
      throw new Error();
    }

    return cookies.auth_token;
  }

  private addUserToRequest(context: ExecutionContext, user: TokenPayload) {
    const request = context.switchToHttp().getRequest<Request>();
    request['user'] = user;
  }
}
