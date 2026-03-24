import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum OwnerType {
  USER = 'user',
  SYSTEM = 'system',
}

export enum LedgerAccountType {
  LIABILITY = 'liability',
  ASSET = 'asset',
  EQUITY = 'equity',
  REVENUE = 'revenue',
  EXPENSE = 'expense',
}

export enum LedgerAccountStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

@Entity('ledger_accounts')
@Index('idx_ledger_accounts_owner', ['ownerType', 'ownerId'])
@Index('idx_ledger_accounts_code', ['accountCode'], { unique: true })
export class LedgerAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: OwnerType,
  })
  ownerType: OwnerType;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  accountCode: string;

  @Column({ type: 'varchar', length: 255 })
  accountName: string;

  @Column({ type: 'varchar', length: 3, default: 'NGN' })
  currency: string;

  @Column({
    type: 'enum',
    enum: LedgerAccountType,
  })
  accountType: LedgerAccountType;

  @Column({
    type: 'enum',
    enum: LedgerAccountStatus,
    default: LedgerAccountStatus.ACTIVE,
  })
  status: LedgerAccountStatus;

  @CreateDateColumn()
  createdAt: Date;
}
