import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NoticesService } from './notices.service';
import { NoticeCategory } from '@prisma/client';

@ApiTags('Campus Notices & Circulars')
@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all campus announcements and circulars' })
  @ApiQuery({ name: 'category', enum: NoticeCategory, required: false })
  async findAll(@Query('category') category?: NoticeCategory) {
    return this.noticesService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notice details by ID' })
  async findOne(@Param('id') id: string) {
    return this.noticesService.findOne(id);
  }
}
