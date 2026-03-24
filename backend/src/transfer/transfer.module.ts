import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { User } from '../database/entities/user.entity';
import { Transaction } from '../database/entities/transaction.entity';
import { Beneficiary } from '../database/entities/beneficiary.entity';
import { WalletModule } from '../wallet/wallet.module';
import { LedgerModule } from '../ledger/ledger.module';
import { FraudRiskModule } from '../fraud-risk/fraud-risk.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Transaction, Beneficiary]),
    WalletModule,
    LedgerModule,
    FraudRiskModule,
  ],
  controllers: [TransferController],
  providers: [TransferService],
  exports: [TransferService],
})
export class TransferModule {}
