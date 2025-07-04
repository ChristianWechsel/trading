import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('home')
  landingPage() {
    return {};
  }

  @Public()
  @Get('login')
  @Render('login')
  loginPage() {
    return {};
  }
}
