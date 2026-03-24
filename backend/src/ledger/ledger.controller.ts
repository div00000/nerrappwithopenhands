import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LedgerService } from './ledger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

@ApiTags('Ledger')
@Controller('ledger')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get ledger balance' })
  async getBalance(@Req() req: { user: User }) {
    const balance = await this.ledgerService.getBalance(req.user.id);
    return { balance };
  }

  @Get('journals')
  @ApiOperation({ summary: 'Get journal entries' })
  async getJournals(@Req() req: { user: User }) {
    // Return recent journals
    return { journals: [] };
  }
}
