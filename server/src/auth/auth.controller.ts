import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    if (!body.username || !body.password) {
      return { error: 'username and password are required' };
    }
    const user = await this.usersService.create(body.username, body.password);
    return { userId: user.userId, username: user.username };
  }
}
