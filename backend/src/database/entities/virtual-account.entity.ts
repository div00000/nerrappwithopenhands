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

export enum ProviderType {
  FLUTTERWAVE = 'flutterwave',
  PAYSTACK = 'paystack',
  MONO = 'mono',
}

export enum VirtualAccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

@Entity('virtual_accounts')
@Index('idx_virtual_accounts_user_id', ['userId'])
@Index('idx_virtual_accounts_provider_ref', ['providerReference'], { unique: true })
export class VirtualAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.virtualAccounts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ProviderType,
  })
  providerType: ProviderType;

  @Column({ type: 'varchar', length: 255, unique: true })
  providerReference: string;

  @Column({ type: 'varchar', length: 100 })
  accountName: string;

  @Column({ type: 'varchar', length: 20 })
  accountNumber: string;

  @Column({ type: 'varchar', length: 100 })
  bankName: string;

  @Column({
    type: 'enum',
    enum: VirtualAccountStatus,
    default: VirtualAccountStatus.ACTIVE,
  })
  status: VirtualAccountStatus;

  @Column({ type: 'boolean', default: false })
  isDynamic: boolean;

  @CreateDateColumn()
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;
}
