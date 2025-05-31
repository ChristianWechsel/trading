import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateCalendarEventDto } from './calendar-event.dto';
import { CalendarEventService } from './calendar-event.service';

@Controller('calendar-events')
export class CalendarEventController {
  constructor(private readonly calendarEventService: CalendarEventService) {}

  @Post()
  create(@Body() dto: CreateCalendarEventDto) {
    return this.calendarEventService.create(dto);
  }

  @Get()
  findAll() {
    return this.calendarEventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarEventService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarEventService.remove(Number(id));
  }
}
