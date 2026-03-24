import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { LedgerAccount } from '../database/entities/ledger-account.entity';
import { LedgerJournal } from '../database/entities/ledger-journal.entity';
import { LedgerEntry } from '../database/entities/ledger-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerAccount, LedgerJournal, LedgerEntry])],
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService],
})
export class LedgerModule {}
