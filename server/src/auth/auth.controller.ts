import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Role } from './type';

@Controller('auth')
export class AuthController {
  private readonly authTokenCookie: string;
  private readonly authTokenMaxAge: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.authTokenMaxAge =
      this.configService.get<number>('AUTH_TOKEN_MAX_AGE') ?? 3600000;
    this.authTokenCookie =
      this.configService.get<string>('AUTH_TOKEN_COOKIE_NAME') ?? 'auth_token';
  }

  @Post('register')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async register(@Body() body: AuthDto) {
    const error = this.validateBody(body);
    if (error) return error;

    const user = await this.usersService.create(body.username, body.password);
    return user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const error = this.validateBody(body);
    if (error) return error;

    try {
      const user = await this.authService.authenticateUser(
        body.username,
        body.password,
      );
      const role: Role = user.username === 'admin' ? 'admin' : 'user';
      const token = await this.authService.generateToken(user, role);
      response.cookie(this.authTokenCookie, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: this.authTokenMaxAge,
      });
      return { message: 'Login successful', user, role };
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : 'An unknown error occurred';
      return { error: errorMessage };
    }
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.authTokenCookie);
    return { message: 'Logout successful' };
  }

  private validateBody(body: AuthDto) {
    if (!body.username || !body.password) {
      return { error: 'username and password are required' };
    }
    return null;
  }
}
