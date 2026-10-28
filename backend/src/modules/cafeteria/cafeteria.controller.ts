import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CafeteriaService } from './cafeteria.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Campus Cafeteria & Canteen')
@Controller('cafeteria')
export class CafeteriaController {
  constructor(private readonly cafeteriaService: CafeteriaService) {}

  @Get('menu')
  @ApiOperation({ summary: 'Get current cafeteria menu and item availability' })
  async getMenu() {
    return this.cafeteriaService.getMenu();
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List food orders placed by current user' })
  async getMyOrders(@CurrentUser() user: any) {
    return this.cafeteriaService.getMyOrders(user.id);
  }
}
