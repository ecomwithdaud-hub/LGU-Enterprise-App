import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Campus Transport & Bus Fleet')
@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get('routes')
  @ApiOperation({ summary: 'List all active transport routes and GPS stops' })
  async getRoutes() {
    return this.transportService.getRoutes();
  }

  @Get('buses')
  @ApiOperation({ summary: 'List all buses and operational status' })
  async getBuses() {
    return this.transportService.getBuses();
  }

  @Get('my-pass')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user bus subscription and digital pass' })
  async getMySubscription(@CurrentUser() user: any) {
    return this.transportService.getMySubscription(user.id);
  }
}
