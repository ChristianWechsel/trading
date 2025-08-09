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
      yValueSources: [
        { value: 'open', label: 'Open' },
        { value: 'high', label: 'High' },
        { value: 'low', label: 'Low' },
        { value: 'close', label: 'Close' },
      ],
      moneyManagementOptions: [
        { value: '', label: '-- Bitte wählen --' },
        { value: 'all-in', label: 'All-In' },
        { value: 'fixed-fractional', label: 'Fixed Fractional' },
      ],
      riskManagementOptions: [
        { value: '', label: '-- Bitte wählen --' },
        { value: 'atr-based', label: 'ATR-Based' },
        { value: 'fixed-percentage', label: 'Fixed Percentage' },
      ],
    };
  }
}
