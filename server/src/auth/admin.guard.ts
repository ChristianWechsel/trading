import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      interface JwtPayload {
        role: string;
        [key: string]: any;
      }
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
      request['user'] = payload;

      if (payload.role !== 'admin') {
        throw new ForbiddenException('Only admin can access this endpoint');
      }
    } catch {
      throw new ForbiddenException('Only admin can access this endpoint');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
