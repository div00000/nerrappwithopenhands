import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus, KycTier } from '../database/entities/user.entity';
import { Wallet, WalletType, WalletStatus } from '../database/entities/wallet.entity';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly ledgerService: LedgerService,
  ) {}

  async getOrCreateWallet(userId: string, currency: string = 'NGN'): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({
      where: { userId, currency: currency as any },
    });

    if (!wallet) {
      wallet = this.walletRepository.create({
        userId,
        walletType: WalletType.NIGERIA_NGN,
        currency,
        status: WalletStatus.ACTIVE,
      });
      await this.walletRepository.save(wallet);
    }

    return wallet;
  }

  async getWallet(userId: string): Promise<Wallet> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.getOrCreateWallet(userId);
  }

  async getBalance(userId: string): Promise<{ available: number; ledger: number }> {
    const wallet = await this.getWallet(userId);
    
    // Get actual balance from ledger
    const ledgerBalance = await this.ledgerService.getBalance(userId);

    return {
      available: parseFloat(wallet.availableBalanceSnapshot.toString()),
      ledger: ledgerBalance,
    };
  }

  async creditWallet(userId: string, amount: number, reference: string): Promise<void> {
    const wallet = await this.getWallet(userId);
    
    if (wallet.status !== WalletStatus.ACTIVE) {
      throw new BadRequestException('Wallet is not active');
    }

    // Update snapshot
    await this.walletRepository.increment(
      { id: wallet.id },
      'availableBalanceSnapshot',
      amount,
    );

    // Post ledger entry
    await this.ledgerService.postJournal({
      description: `Wallet credit - ${reference}`,
      entries: [
        { accountType: 'system_settlement', entryType: 'credit', amount },
        { accountType: 'user_wallet', ownerId: userId, entryType: 'debit', amount },
      ],
    });
  }

  async debitWallet(userId: string, amount: number, reference: string): Promise<void> {
    const wallet = await this.getWallet(userId);
    
    if (wallet.status !== WalletStatus.ACTIVE) {
      throw new BadRequestException('Wallet is not active');
    }

    const currentBalance = parseFloat(wallet.availableBalanceSnapshot.toString());
    if (currentBalance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // Update snapshot
    await this.walletRepository.decrement(
      { id: wallet.id },
      'availableBalanceSnapshot',
      amount,
    );

    // Post ledger entry
    await this.ledgerService.postJournal({
      description: `Wallet debit - ${reference}`,
      entries: [
        { accountType: 'user_wallet', ownerId: userId, entryType: 'credit', amount },
        { accountType: 'system_settlement', entryType: 'debit', amount },
      ],
    });
  }

  async freezeWallet(userId: string): Promise<void> {
    await this.walletRepository.update({ userId }, { status: WalletStatus.FROZEN });
  }

  async unfreezeWallet(userId: string): Promise<void> {
    await this.walletRepository.update({ userId }, { status: WalletStatus.ACTIVE });
  }
}
