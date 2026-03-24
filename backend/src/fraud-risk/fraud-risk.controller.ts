import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FraudRiskService } from './fraud-risk.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

@ApiTags('Fraud Risk')
@Controller('fraud')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FraudRiskController {
  constructor(private readonly fraudRiskService: FraudRiskService) {}

  @Get('flags')
  @ApiOperation({ summary: 'Get fraud flags' })
  async getFlags(@Req() req: { user: User }) {
    return this.fraudRiskService.getFlags(req.user.id);
  }

  @Get('score')
  @ApiOperation({ summary: 'Get risk score' })
  async getRiskScore(@Req() req: { user: User }) {
    return this.fraudRiskService.calculateRiskScore(req.user.id);
  }
}
