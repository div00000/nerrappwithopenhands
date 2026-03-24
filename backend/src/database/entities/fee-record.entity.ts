import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

export enum FeeType {
  TRANSFER_FEE = 'transfer_fee',
  WITHDRAWAL_FEE = 'withdrawal_fee',
  AIRTIME_FEE = 'airtime_fee',
  DATA_FEE = 'data_fee',
  BILL_FEE = 'bill_fee',
  CARD_FEE = 'card_fee',
}

@Entity('fee_records')
export class FeeRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  transactionId: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @Column({
    type: 'enum',
    enum: FeeType,
  })
  feeType: FeeType;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'NGN' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('feature_flags')
export class FeatureFlag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  scopeJson: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('legal_consents')
export class LegalConsent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  consentType: string;

  @Column({ type: 'varchar', length: 20 })
  consentVersion: string;

  @Column({ type: 'timestamp' })
  acceptedAt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;
}
