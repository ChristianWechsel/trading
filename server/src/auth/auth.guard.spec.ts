import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let reflector: Reflector;
  let jwtService: JwtService;
  let configService: ConfigService;
  let context: Partial<ExecutionContext>;
  let httpArgumentsHost: any;
  let guard: AuthGuard;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    jwtService = { verifyAsync: jest.fn() } as any;
    configService = { get: jest.fn() } as any;
    httpArgumentsHost = {
      getRequest: jest
        .fn()
        .mockReturnValue({ cookies: { auth_token: 'token' } }),
      getResponse: jest.fn(),
      getNext: jest.fn(),
    };
    context = {
      switchToHttp: () => httpArgumentsHost,
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
    guard = new AuthGuard(jwtService, configService, reflector);
  });

  it('should allow public route', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
    await expect(guard.canActivate(context as ExecutionContext)).resolves.toBe(
      true,
    );
  });

  it('should throw UnauthorizedException if no token', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    httpArgumentsHost.getRequest.mockReturnValue({ cookies: {} });
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should verify token and attach user', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    (configService.get as jest.Mock).mockReturnValue('secret');
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({
      username: 'test',
    });
    const req: any = { cookies: { auth_token: 'token' } };
    httpArgumentsHost.getRequest.mockReturnValue(req);
    await expect(guard.canActivate(context as ExecutionContext)).resolves.toBe(
      true,
    );
    expect(req.user).toEqual({ username: 'test' });
  });
});
