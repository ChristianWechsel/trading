import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        RolesGuard,
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        {
          provide: AuthService,
          useValue: {
            authenticateUser: jest.fn(),
            generateToken: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return error if login body is missing fields', async () => {
    const result = await controller.signIn(
      { username: '', password: '' } as any,
      {} as Response,
    );
    expect(result).toEqual({ error: 'username and password are required' });
  });

  it('should return error if registration body is missing fields', async () => {
    const result = await controller.register({
      username: '',
      password: '',
    } as any);
    expect(result).toEqual({ error: 'username and password are required' });
  });

  it('should login and set cookie for valid user', async () => {
    (authService.authenticateUser as jest.Mock).mockResolvedValue({
      username: 'test',
      password: 'hashed',
    });
    (authService.generateToken as jest.Mock).mockResolvedValue('jwt-token');
    const cookieMock = jest.fn();
    const res = { cookie: cookieMock } as any;
    const result = await controller.signIn(
      { username: 'test', password: 'pw' },
      res,
    );
    expect(cookieMock).toHaveBeenCalledWith(
      'auth_token',
      'jwt-token',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(result).toHaveProperty('message', 'Login successful');
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('role');
  });

  it('should register user via usersService', async () => {
    (usersService.create as jest.Mock).mockResolvedValue({
      username: 'newuser',
    });
    const result = await controller.register({
      username: 'newuser',
      password: 'pw',
    });
    expect(usersService.create).toHaveBeenCalledWith('newuser', 'pw');
    expect(result).toEqual({ username: 'newuser' });
  });

  it('should return error if authService throws in login', async () => {
    (authService.authenticateUser as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );
    const result = await controller.signIn(
      { username: 'fail', password: 'fail' },
      {} as Response,
    );
    expect(result).toEqual({ error: 'fail' });
  });
});
