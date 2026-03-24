import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { CardTransaction } from './card-transaction.entity';

export enum CardProviderType {
  ITTL = 'ittl',
  PROBASE = 'probase',
}

export enum CardStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  BLOCKED = 'blocked',
  EXPIRED = 'expired',
}

@Entity('virtual_cards')
@Index('idx_virtual_cards_user_id', ['userId'])
export class VirtualCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.virtualCards)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: CardProviderType,
  })
  providerType: CardProviderType;

  @Column({ type: 'varchar', length: 255, unique: true })
  providerCardRef: string;

  @Column({ type: 'varchar', length: 20 })
  maskedPan: string;

  @Column({ type: 'varchar', length: 10, default: 'NGN' })
  currency: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  availableBalance: number;

  @Column({
    type: 'enum',
    enum: CardStatus,
    default: CardStatus.ACTIVE,
  })
  status: CardStatus;

  @Column({ type: 'varchar', length: 10, nullable: true })
  expiryMonth: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  expiryYear: string;

  @OneToMany(() => CardTransaction, (tx) => tx.virtualCard)
  transactions: CardTransaction[];

  @CreateDateColumn()
  createdAt: Date;
}
