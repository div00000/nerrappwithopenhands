import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerAccount, OwnerType, LedgerAccountType, LedgerAccountStatus } from '../database/entities/ledger-account.entity';
import { LedgerJournal, JournalStatus } from '../database/entities/ledger-journal.entity';
import { LedgerEntry, EntryType } from '../database/entities/ledger-entry.entity';
import { v4 as uuidv4 } from 'uuid';

interface JournalEntry {
  accountType: string;
  ownerId?: string;
  entryType: 'debit' | 'credit';
  amount: number;
}

interface PostJournalParams {
  description: string;
  entries: JournalEntry[];
  referenceId?: string;
  referenceType?: string;
}

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerAccount)
    private readonly accountRepository: Repository<LedgerAccount>,
    @InjectRepository(LedgerJournal)
    private readonly journalRepository: Repository<LedgerJournal>,
    @InjectRepository(LedgerEntry)
    private readonly entryRepository: Repository<LedgerEntry>,
  ) {}

  async getOrCreateAccount(
    ownerType: OwnerType,
    ownerId: string,
    accountType: string,
    currency: string = 'NGN',
  ): Promise<LedgerAccount> {
    const accountCode = this.generateAccountCode(ownerType, ownerId, accountType);
    
    let account = await this.accountRepository.findOne({
      where: { accountCode },
    });

    if (!account) {
      account = this.accountRepository.create({
        ownerType,
        ownerId,
        accountCode,
        accountName: this.generateAccountName(ownerType, accountType),
        currency,
        accountType: this.mapAccountType(accountType),
        status: LedgerAccountStatus.ACTIVE,
      });
      await this.accountRepository.save(account);
    }

    return account;
  }

  async postJournal(params: PostJournalParams): Promise<LedgerJournal> {
    const { description, entries, referenceId, referenceType } = params;

    // Validate entries - debits must equal credits
    const totalDebits = entries
      .filter(e => e.entryType === 'debit')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const totalCredits = entries
      .filter(e => e.entryType === 'credit')
      .reduce((sum, e) => sum + e.amount, 0);

    if (totalDebits !== totalCredits) {
      throw new BadRequestException('Debits must equal credits');
    }

    // Create journal
    const journal = this.journalRepository.create({
      journalRef: `JRN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      description,
      status: JournalStatus.DRAFT,
    });
    await this.journalRepository.save(journal);

    // Create entries
    for (const entry of entries) {
      const account = await this.getOrCreateAccount(
        entry.ownerId ? OwnerType.USER : OwnerType.SYSTEM,
        entry.ownerId || 'system',
        entry.accountType,
      );

      const ledgerEntry = this.entryRepository.create({
        journalId: journal.id,
        ledgerAccountId: account.id,
        entryType: entry.entryType === 'debit' ? EntryType.DEBIT : EntryType.CREDIT,
        amount: entry.amount,
        referenceType,
        referenceId,
      });
      await this.entryRepository.save(ledgerEntry);
    }

    // Post journal
    journal.status = JournalStatus.POSTED;
    journal.postedAt = new Date();
    await this.journalRepository.save(journal);

    return journal;
  }

  async getBalance(userId: string): Promise<number> {
    const userAccount = await this.getOrCreateAccount(
      OwnerType.USER,
      userId,
      'user_wallet',
    );

    const entries = await this.entryRepository.find({
      where: { ledgerAccountId: userAccount.id },
    });

    let balance = 0;
    for (const entry of entries) {
      if (entry.entryType === EntryType.DEBIT) {
        balance += parseFloat(entry.amount.toString());
      } else {
        balance -= parseFloat(entry.amount.toString());
      }
    }

    return Math.abs(balance);
  }

  async reverseJournal(journalId: string, reason: string): Promise<LedgerJournal> {
    const original = await this.journalRepository.findOne({
      where: { id: journalId },
    });

    if (!original || original.status !== JournalStatus.POSTED) {
      throw new BadRequestException('Journal not found or already reversed');
    }

    // Create reversing journal
    const reversingJournal = this.journalRepository.create({
      journalRef: `RVR${original.journalRef}`,
      description: `Reversal of ${original.journalRef}: ${reason}`,
      status: JournalStatus.POSTED,
      postedAt: new Date(),
    });
    await this.journalRepository.save(reversingJournal);

    // Get original entries and reverse them
    const originalEntries = await this.entryRepository.find({
      where: { journalId },
    });

    for (const entry of originalEntries) {
      const reversingEntry = this.entryRepository.create({
        journalId: reversingJournal.id,
        ledgerAccountId: entry.ledgerAccountId,
        entryType: entry.entryType === EntryType.DEBIT ? EntryType.CREDIT : EntryType.DEBIT,
        amount: entry.amount,
        referenceType: 'reversal',
        referenceId: journalId,
      });
      await this.entryRepository.save(reversingEntry);
    }

    // Mark original as reversed
    original.status = JournalStatus.REVERSED;
    original.reversedAt = new Date();
    await this.journalRepository.save(original);

    return reversingJournal;
  }

  private generateAccountCode(ownerType: OwnerType, ownerId: string, accountType: string): string {
    return `${ownerType.toUpperCase()}_${accountType}_${ownerId.substring(0, 8)}`.replace(/[^A-Z0-9_]/g, '');
  }

  private generateAccountName(ownerType: OwnerType, accountType: string): string {
    const names: Record<string, string> = {
      user_wallet: 'User Wallet',
      system_settlement: 'System Settlement',
      fee_revenue: 'Fee Revenue',
      pending_transfers: 'Pending Transfers',
    };
    return names[accountType] || accountType;
  }

  private mapAccountType(accountType: string): LedgerAccountType {
    const mapping: Record<string, LedgerAccountType> = {
      user_wallet: LedgerAccountType.LIABILITY,
      system_settlement: LedgerAccountType.ASSET,
      fee_revenue: LedgerAccountType.REVENUE,
      pending_transfers: LedgerAccountType.LIABILITY,
    };
    return mapping[accountType] || LedgerAccountType.ASSET;
  }
}
