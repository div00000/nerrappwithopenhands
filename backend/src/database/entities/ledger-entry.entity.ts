import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LedgerJournal } from './ledger-journal.entity';
import { LedgerAccount } from './ledger-account.entity';

export enum EntryType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

@Entity('ledger_entries')
@Index('idx_ledger_entries_journal_id', ['journalId'])
@Index('idx_ledger_entries_account_id', ['ledgerAccountId'])
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  journalId: string;

  @ManyToOne(() => LedgerJournal)
  @JoinColumn({ name: 'journalId' })
  journal: LedgerJournal;

  @Column({ type: 'uuid' })
  ledgerAccountId: string;

  @ManyToOne(() => LedgerAccount)
  @JoinColumn({ name: 'ledgerAccountId' })
  ledgerAccount: LedgerAccount;

  @Column({
    type: 'enum',
    enum: EntryType,
  })
  entryType: EntryType;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'NGN' })
  currency: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  referenceType: string;

  @Column({ type: 'uuid', nullable: true })
  referenceId: string;

  @CreateDateColumn()
  createdAt: Date;
}
