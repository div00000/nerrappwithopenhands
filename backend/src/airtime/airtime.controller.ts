import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AirtimeService } from './airtime.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

class PurchaseAirtimeDto {
  network: string;
  phone: string;
  amount: number;
}

class PurchaseDataDto {
  network: string;
  phone: string;
  planCode: string;
}

@ApiTags('Airtime & Data')
@Controller('purchases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AirtimeController {
  constructor(private readonly airtimeService: AirtimeService) {}

  @Get('airtime')
  @ApiOperation({ summary: 'Get available airtime products' })
  async getAirtimeProducts() {
    return this.airtimeService.getAirtimeProducts();
  }

  @Get('data')
  @ApiOperation({ summary: 'Get available data products' })
  async getDataProducts() {
    return this.airtimeService.getDataProducts();
  }

  @Post('airtime')
  @ApiOperation({ summary: 'Purchase airtime' })
  async purchaseAirtime(@Req() req: { user: User }, @Body() data: PurchaseAirtimeDto) {
    return this.airtimeService.purchaseAirtime(req.user.id, data.network, data.phone, data.amount);
  }

  @Post('data')
  @ApiOperation({ summary: 'Purchase data' })
  async purchaseData(@Req() req: { user: User }, @Body() data: PurchaseDataDto) {
    return this.airtimeService.purchaseData(req.user.id, data.network, data.phone, data.planCode);
  }
}
