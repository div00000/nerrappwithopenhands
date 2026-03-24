import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get wallet details' })
  async getWallet(@Req() req: { user: User }) {
    return this.walletService.getWallet(req.user.id);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  async getBalance(@Req() req: { user: User }) {
    return this.walletService.getBalance(req.user.id);
  }

  @Get('deposit-instructions')
  @ApiOperation({ summary: 'Get deposit instructions' })
  async getDepositInstructions(@Req() req: { user: User }) {
    // Return virtual account details for funding
    return {
      bankName: 'Guaranty Trust Bank',
      accountName: `Nerra Prepaid_${req.user.publicUserId}`,
      accountNumber: '1234567890',
      instructions: 'Transfer from any bank. Deposits are instant.',
    };
  }
}
