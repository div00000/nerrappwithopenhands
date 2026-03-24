import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CryptoService } from './crypto.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

@ApiTags('Crypto')
@Controller('crypto')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('assets')
  @ApiOperation({ summary: 'Get available crypto assets' })
  async getAssets() {
    return this.cryptoService.getAssets();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get crypto transactions' })
  async getTransactions(@Req() req: { user: User }) {
    return this.cryptoService.getTransactions(req.user.id);
  }

  @Post('orders')
  @ApiOperation({ summary: 'Create crypto order' })
  async createOrder(
    @Req() req: { user: User },
    @Body() body: { type: 'buy' | 'sell'; asset: string; amount: number },
  ) {
    return this.cryptoService.createOrder(req.user.id, body);
  }
}
