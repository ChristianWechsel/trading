import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @Render('home')
  landingPage() {
    console.log('Landing page rendered');
    return {};
  }

  @Public()
  @Get('login')
  @Render('login')
  loginPage() {
    console.log('Login page rendered');
    return {};
  }
}
