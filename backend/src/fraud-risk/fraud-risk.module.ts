import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudRiskService } from './fraud-risk.service';
import { FraudRiskController } from './fraud-risk.controller';
import { FraudFlag } from '../database/entities/fraud-flag.entity';
import { RiskScore } from '../database/entities/fraud-flag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FraudFlag, RiskScore])],
  controllers: [FraudRiskController],
  providers: [FraudRiskService],
  exports: [FraudRiskService],
})
export class FraudRiskModule {}
