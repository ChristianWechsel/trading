import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() body: { username: string; password: string }) {
    console.log(body);
  }
}
