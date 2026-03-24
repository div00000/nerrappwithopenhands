import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupportTicket } from './support-ticket.entity';

export enum SenderType {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('support_messages')
export class SupportMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ticketId: string;

  @ManyToOne(() => SupportTicket, (ticket) => ticket.messages)
  @JoinColumn({ name: 'ticketId' })
  ticket: SupportTicket;

  @Column({
    type: 'enum',
    enum: SenderType,
  })
  senderType: SenderType;

  @Column({ type: 'uuid', nullable: true })
  senderId: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  attachmentKey: string;

  @CreateDateColumn()
  createdAt: Date;
}
