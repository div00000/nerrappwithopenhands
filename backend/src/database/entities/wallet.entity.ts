import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum WalletType {
  NIGERIA_NGN = 'nigeria_ngn',
}

export enum WalletStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

@Entity('wallets')
@Index('idx_wallets_user_id', ['userId'])
@Index('idx_wallets_wallet_type', ['walletType'])
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: WalletType,
  })
  walletType: WalletType;

  @Column({ type: 'varchar', length: 3, default: 'NGN' })
  currency: string;

  @Column({
    type: 'enum',
    enum: WalletStatus,
    default: WalletStatus.ACTIVE,
  })
  status: WalletStatus;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  availableBalanceSnapshot: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  ledgerBalanceSnapshot: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
