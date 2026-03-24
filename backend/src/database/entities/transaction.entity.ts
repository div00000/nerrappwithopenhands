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

export enum TransactionType {
  FUNDING = 'funding',
  TRANSFER = 'transfer',
  WITHDRAWAL = 'withdrawal',
  AIRTIME = 'airtime',
  DATA = 'data',
  BILL_PAYMENT = 'bill_payment',
  CARD_FUNDING = 'card_funding',
  CARD_WITHDRAWAL = 'card_withdrawal',
  CRYPTO = 'crypto',
  FEE = 'fee',
  REVERSAL = 'reversal',
}

export enum TransactionCategory {
  DEPOSIT = 'deposit',
  TRANSFER_TO_NERRA = 'transfer_to_nerra',
  TRANSFER_TO_BANK = 'transfer_to_bank',
  AIRTIME_PURCHASE = 'airtime_purchase',
  DATA_PURCHASE = 'data_purchase',
  BILL_PAYMENT = 'bill_payment',
  VIRTUAL_CARD = 'virtual_card',
  CRYPTO = 'crypto',
  OTHER = 'other',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  REVERSED = 'reversed',
}

export enum RiskStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  FLAGGED = 'flagged',
  BLOCKED = 'blocked',
  MANUAL_REVIEW = 'manual_review',
}

@Entity('transactions')
@Index('idx_transactions_user_id', ['userId'])
@Index('idx_transactions_ref', ['transactionRef'], { unique: true })
@Index('idx_transactions_status', ['status'])
@Index('idx_transactions_created_at', ['createdAt'])
@Index('idx_transactions_beneficiary_ref', ['beneficiaryRef'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 50, unique: true })
  transactionRef: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transactionType: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionCategory,
  })
  category: TransactionCategory;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  feeAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'NGN' })
  currency: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: RiskStatus,
    default: RiskStatus.APPROVED,
  })
  riskStatus: RiskStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  providerStatus: string;

  @Column({ type: 'text', nullable: true })
  narration: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  beneficiaryRef: string;

  @Column({ type: 'timestamp', nullable: true })
  initiatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
