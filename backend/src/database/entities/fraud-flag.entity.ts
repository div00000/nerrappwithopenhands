import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

export enum FlagType {
  HIGH_VALUE = 'high_value',
  RAPID_TRANSACTIONS = 'rapid_transactions',
  NEW_BENEFICIARY = 'new_beneficiary',
  SUSPICIOUS_DEVICE = 'suspicious_device',
  VELOCITY = 'velocity',
  IMPOSSIBLE_TRAVEL = 'impossible_travel',
  DUPLICATE_ACCOUNT = 'duplicate_account',
  KYC_MISMATCH = 'kyc_mismatch',
  FRAUD_HISTORY = 'fraud_history',
}

export enum FlagSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum FlagStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  FALSE_POSITIVE = 'false_positive',
}

@Entity('fraud_flags')
@Index('idx_fraud_flags_user_id', ['userId'])
@Index('idx_fraud_flags_status', ['status'])
@Index('idx_fraud_flags_created_at', ['createdAt'])
export class FraudFlag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.fraudFlags, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  transactionId: string;

  @ManyToOne(() => Transaction, { nullable: true })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @Column({
    type: 'enum',
    enum: FlagType,
  })
  flagType: FlagType;

  @Column({
    type: 'enum',
    enum: FlagSeverity,
  })
  severity: FlagSeverity;

  @Column({
    type: 'enum',
    enum: FlagStatus,
    default: FlagStatus.OPEN,
  })
  status: FlagStatus;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;
}

@Entity('risk_scores')
@Index('idx_risk_scores_user_id', ['userId'])
export class RiskScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.riskScores)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'varchar', length: 20 })
  level: string;

  @Column({ type: 'jsonb', nullable: true })
  factorsJson: Record<string, any>;

  @CreateDateColumn()
  evaluatedAt: Date;
}
