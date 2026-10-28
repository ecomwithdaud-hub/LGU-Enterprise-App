import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TimetablesService } from './timetables.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DayOfWeek } from '@prisma/client';

@ApiTags('Timetables & Scheduling')
@Controller('timetables')
export class TimetablesController {
  constructor(private readonly timetablesService: TimetablesService) {}

  @Get('my-schedule')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get timetable of the currently authenticated student or faculty member' })
  @ApiQuery({ name: 'day', enum: DayOfWeek, required: false })
  async getMyTimetable(@CurrentUser() user: any, @Query('day') day?: DayOfWeek) {
    return this.timetablesService.getMyTimetable(user, day);
  }

  @Get('rooms')
  @ApiOperation({ summary: 'List all university venues and rooms' })
  async listRooms() {
    return this.timetablesService.listAllRooms();
  }

  @Get('sections')
  @ApiOperation({ summary: 'List all academic sections' })
  async listSections() {
    return this.timetablesService.listAllSections();
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Get timetable schedule for a specific room/lecture hall' })
  @ApiQuery({ name: 'day', enum: DayOfWeek, required: false })
  async getRoomTimetable(@Param('roomId') roomId: string, @Query('day') day?: DayOfWeek) {
    return this.timetablesService.getRoomTimetable(roomId, day);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get timetable schedule for a specific faculty member' })
  @ApiQuery({ name: 'day', enum: DayOfWeek, required: false })
  async getTeacherTimetable(@Param('teacherId') teacherId: string, @Query('day') day?: DayOfWeek) {
    return this.timetablesService.getTeacherTimetable(teacherId, day);
  }

  @Get('section/:sectionId')
  @ApiOperation({ summary: 'Get timetable schedule for a specific student section' })
  @ApiQuery({ name: 'day', enum: DayOfWeek, required: false })
  async getSectionTimetable(@Param('sectionId') sectionId: string, @Query('day') day?: DayOfWeek) {
    return this.timetablesService.getSectionTimetable(sectionId, day);
  }
}
