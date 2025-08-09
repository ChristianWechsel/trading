import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('login')
  @Render('login')
  loginPage() {
    return {};
  }

  @Get()
  @Render('home')
  landingPage() {
    return {};
  }

  @Get('chart')
  @Render('chart')
  showChartPage() {
    return {};
  }

  @Get('notification')
  @Render('notification')
  notificationPage() {
    return {};
  }

  @Get('analysis')
  @Render('analysis')
  analysisPage() {
    return {
      steps: [
        'MovingAverage',
        'SwingPointDetection',
        'TrendDetection',
        'TrendChannelCalculation',
        'AverageTrueRange',
        'Trading',
        'TradingSignal',
      ],
    };
  }
}
