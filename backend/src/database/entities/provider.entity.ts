import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

export enum ProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

@Entity('funding_providers')
export class FundingProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  providerCode: string;

  @Column({ type: 'varchar', length: 100 })
  providerName: string;

  @Column({
    type: 'enum',
    enum: ProviderStatus,
    default: ProviderStatus.ACTIVE,
  })
  status: ProviderStatus;

  @Column({ type: 'jsonb', nullable: true })
  configJson: Record<string, any>;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  feePercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  flatFee: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('payout_providers')
export class PayoutProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  providerCode: string;

  @Column({ type: 'varchar', length: 100 })
  providerName: string;

  @Column({
    type: 'enum',
    enum: ProviderStatus,
    default: ProviderStatus.ACTIVE,
  })
  status: ProviderStatus;

  @Column({ type: 'jsonb', nullable: true })
  configJson: Record<string, any>;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  feePercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  flatFee: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('provider_routing_rules')
export class ProviderRoutingRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  transactionKind: string;

  @Column({ type: 'varchar', length: 50 })
  providerType: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'jsonb', nullable: true })
  conditionsJson: Record<string, any>;

  @Column({
    type: 'enum',
    enum: ProviderStatus,
    default: ProviderStatus.ACTIVE,
  })
  status: ProviderStatus;

  @CreateDateColumn()
  createdAt: Date;
}
