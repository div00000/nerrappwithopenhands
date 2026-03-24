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
import { SupportMessage } from './support-message.entity';

export enum TicketCategory {
  ACCOUNT = 'account',
  TRANSACTION = 'transaction',
  KYC = 'kyc',
  CARD = 'card',
  TECHNICAL = 'technical',
  OTHER = 'other',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  PENDING_USER = 'pending_user',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('support_tickets')
@Index('idx_support_tickets_user_id', ['userId'])
@Index('idx_support_tickets_status', ['status'])
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.supportTickets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: TicketCategory,
  })
  category: TicketCategory;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => SupportMessage, (message) => message.ticket)
  messages: SupportMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
}
