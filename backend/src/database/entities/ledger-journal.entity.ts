import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum JournalStatus {
  DRAFT = 'draft',
  POSTED = 'posted',
  REVERSED = 'reversed',
  VOIDED = 'voided',
}

@Entity('ledger_journals')
@Index('idx_ledger_journals_ref', ['journalRef'], { unique: true })
@Index('idx_ledger_journals_status', ['status])
@Index('idx_ledger_journals_created_at', ['createdAt'])
export class LedgerJournal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  journalRef: string;

  @Column({
    type: 'enum',
    enum: JournalStatus,
    default: JournalStatus.DRAFT,
  })
  status: JournalStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  reversedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  reversedByJournalId: string;
}
