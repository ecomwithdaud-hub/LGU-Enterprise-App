import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Accounts & Fee Challans')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('my-challans')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all fee challans generated for the authenticated student' })
  async getMyChallans(@CurrentUser() user: any) {
    return this.accountsService.getMyChallans(user.id);
  }

  @Get('challans/:challanNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific fee challan voucher by challan number (with IDOR protection)' })
  async getChallanById(
    @Param('challanNumber') challanNumber: string,
    @CurrentUser() user: any,
  ) {
    return this.accountsService.getChallanById(challanNumber, user);
  }
}
