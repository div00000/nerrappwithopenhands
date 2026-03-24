import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { FraudFlag, FlagType, FlagSeverity, FlagStatus } from '../database/entities/fraud-flag.entity';
import { RiskScore } from '../database/entities/fraud-flag.entity';

interface RiskCheckResult {
  allowed: boolean;
  flagged: boolean;
  blocked: boolean;
  score: number;
  reasons: string[];
}

@Injectable()
export class FraudRiskService {
  constructor(
    @InjectRepository(FraudFlag)
    private readonly fraudFlagRepository: Repository<FraudFlag>,
    @InjectRepository(RiskScore)
    private readonly riskScoreRepository: Repository<RiskScore>,
  ) {}

  async checkTransaction(userId: string, amount: number): Promise<RiskCheckResult> {
    const reasons: string[] = [];
    let flagged = false;
    let blocked = false;
    let score = 0;

    // Check transaction amount
    if (amount > 100000) {
      score += 30;
      reasons.push('High value transaction');
    } else if (amount > 50000) {
      score += 15;
    }

    // Check for recent fraud flags
    const recentFlags = await this.fraudFlagRepository.count({
      where: { userId, status: FlagStatus.OPEN },
    });

    if (recentFlags > 0) {
      score += 50;
      flagged = true;
      reasons.push('Open fraud flags on account');
    }

    // Get user risk score
    const riskScore = await this.riskScoreRepository.findOne({
      where: { userId },
      order: { evaluatedAt: 'DESC' },
    });

    if (riskScore) {
      score += riskScore.score;
      if (riskScore.score > 70) {
        blocked = true;
        reasons.push('High risk score');
      } else if (riskScore.score > 40) {
        flagged = true;
      }
    }

    return {
      allowed: !blocked,
      flagged,
      blocked,
      score,
      reasons,
    };
  }

  async createFlag(userId: string, data: {
    flagType: FlagType;
    severity: FlagSeverity;
    reason: string;
    transactionId?: string;
    metadata?: Record<string, any>;
  }): Promise<FraudFlag> {
    const flag = this.fraudFlagRepository.create({
      userId,
      transactionId: data.transactionId,
      flagType: data.flagType,
      severity: data.severity,
      reason: data.reason,
      metadata: data.metadata,
      status: FlagStatus.OPEN,
    });

    return this.fraudFlagRepository.save(flag);
  }

  async resolveFlag(flagId: string, resolution: 'resolved' | 'false_positive'): Promise<void> {
    await this.fraudFlagRepository.update(flagId, {
      status: resolution === 'resolved' ? FlagStatus.RESOLVED : FlagStatus.FALSE_POSITIVE,
      resolvedAt: new Date(),
    });
  }

  async getFlags(userId: string): Promise<FraudFlag[]> {
    return this.fraudFlagRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async calculateRiskScore(userId: string): Promise<number> {
    let score = 0;

    // Count recent flags
    const recentFlags = await this.fraudFlagRepository.count({
      where: { 
        userId,
        createdAt: MoreThan(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      },
    });
    score += recentFlags * 20;

    // Cap score at 100
    score = Math.min(score, 100);

    // Save risk score
    await this.riskScoreRepository.save({
      userId,
      score,
      level: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
      factorsJson: { recentFlags },
      evaluatedAt: new Date(),
    });

    return score;
  }
}
