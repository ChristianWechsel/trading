import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;
  let reflector: Partial<Reflector>;
  let context: Partial<ExecutionContext>;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ userId: 1 }),
    };
    configService = {
      get: jest.fn().mockReturnValue('secret'),
    };
    reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    };
    context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer token' },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
    guard = new AuthGuard(
      jwtService as any,
      configService as any,
      reflector as any,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if @Public is set', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
    await expect(guard.canActivate(context as any)).resolves.toBe(true);
  });

  it('should throw UnauthorizedException if no token', async () => {
    (context.switchToHttp as any) = () => ({
      getRequest: () => ({ headers: {} }),
    });
    await expect(guard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should call jwtService.verifyAsync with correct token', async () => {
    await guard.canActivate(context as any);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token', {
      secret: 'secret',
    });
  });
});
