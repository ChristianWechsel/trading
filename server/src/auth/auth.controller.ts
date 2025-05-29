import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdminGuard } from './admin.guard';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(AdminGuard)
  @Post('register')
  async register(@Body() body: AuthDto) {
    const error = this.validateBody(body);
    if (error) return error;

    const user = await this.usersService.create(body.username, body.password);
    return user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: AuthDto) {
    const error = this.validateBody(body);
    if (error) return error;

    return await this.authService.signIn(body.username, body.password);
  }

  @Get('profile')
  getProfile(@Request() req: { user: string }) {
    return req.user;
  }

  private validateBody(body: AuthDto) {
    if (!body.username || !body.password) {
      return { error: 'username and password are required' };
    }
    return null;
  }
}
