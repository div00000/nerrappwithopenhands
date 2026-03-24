import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReconciliationService } from './reconciliation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reconciliation')
@Controller('reconciliation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Post('run')
  @ApiOperation({ summary: 'Run reconciliation' })
  async runReconciliation(@Body() body: { provider: string; date: string }) {
    return this.reconciliationService.runReconciliation(body.provider, body.date);
  }

  @Get('runs')
  @ApiOperation({ summary: 'Get reconciliation history' })
  async getHistory(@Body() body: { provider?: string }) {
    return this.reconciliationService.getReconciliationHistory(body.provider);
  }

  @Post('investigate/:transactionId')
  @ApiOperation({ summary: 'Investigate discrepancy' })
  async investigate(@Param('transactionId') id: string) {
    return this.reconciliationService.investigateDiscrepancy(id);
  }
}
