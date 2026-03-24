import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { VirtualCard } from './virtual-card.entity';

export enum CardTransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  DECLINED = 'declined',
}

@Entity('card_transactions')
@Index('idx_card_transactions_card_id', ['virtualCardId'])
@Index('idx_card_transactions_provider_ref', ['providerTxRef'])
export class CardTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  virtualCardId: string;

  @ManyToOne(() => VirtualCard, (card) => card.transactions)
  @JoinColumn({ name: 'virtualCardId' })
  virtualCard: VirtualCard;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerTxRef: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'NGN' })
  currency: string;

  @Column({ type: 'varchar', length: 255 })
  merchantName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  merchantCategory: string;

  @Column({
    type: 'enum',
    enum: CardTransactionStatus,
    default: CardTransactionStatus.PENDING,
  })
  status: CardTransactionStatus;

  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
