import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Transaction, TransactionType, TransactionCategory, TransactionStatus, RiskStatus } from '../database/entities/transaction.entity';
import { Beneficiary, BeneficiaryType } from '../database/entities/beneficiary.entity';
import { WalletService } from '../wallet/wallet.service';
import { PinService } from '../pin/pin.service';
import { FraudRiskService } from '../fraud-risk/fraud-risk.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Beneficiary)
    private readonly beneficiaryRepository: Repository<Beneficiary>,
    private readonly walletService: WalletService,
    private readonly pinService: PinService,
    private readonly fraudRiskService: FraudRiskService,
  ) {}

  async validateRecipient(userId: string, phone: string): Promise<{ valid: boolean; name?: string }> {
    const recipient = await this.userRepository.findOne({
      where: { primaryPhone: phone },
    });

    if (!recipient) {
      return { valid: false };
    }

    return { valid: true, name: `${recipient.primaryEmail?.split('@')[0] || 'User'}` };
  }

  async validateBankAccount(bankCode: string, accountNumber: string): Promise<{ valid: boolean; name?: string }> {
    // In production, call provider API to validate
    // Mock implementation
    if (accountNumber.length !== 10) {
      return { valid: false };
    }
    return { valid: true, name: 'VALIDATED ACCOUNT' };
  }

  async initiateTransfer(
    userId: string,
    data: {
      type: 'nerra' | 'bank';
      recipient: string;
      bankCode?: string;
      amount: number;
      narration?: string;
      pin: string;
    },
  ): Promise<Transaction> {
    // Verify PIN
    await this.pinService.verifyPin(userId, data.pin);

    // Check fraud risk
    const riskCheck = await this.fraudRiskService.checkTransaction(userId, data.amount);
    if (riskCheck.blocked) {
      throw new BadRequestException('Transaction blocked due to security concerns');
    }

    // Create transaction
    const transactionRef = `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const transaction = this.transactionRepository.create({
      userId,
      transactionRef,
      transactionType: TransactionType.TRANSFER,
      category: data.type === 'nerra' ? TransactionCategory.TRANSFER_TO_NERRA : TransactionCategory.TRANSFER_TO_BANK,
      amount: data.amount,
      feeAmount: this.calculateFee(data.amount),
      status: TransactionStatus.PENDING,
      riskStatus: riskCheck.flagged ? RiskStatus.FLAGGED : RiskStatus.APPROVED,
      beneficiaryRef: data.recipient,
      narration: data.narration,
      initiatedAt: new Date(),
    });

    await this.transactionRepository.save(transaction);

    // Deduct from wallet
    const totalAmount = data.amount + transaction.feeAmount;
    await this.walletService.debitWallet(userId, totalAmount, transactionRef);

    // Process transfer (async in production)
    // For now, mark as success
    transaction.status = TransactionStatus.SUCCESS;
    transaction.completedAt = new Date();
    await this.transactionRepository.save(transaction);

    return transaction;
  }

  async getTransaction(userId: string, transactionRef: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { userId, transactionRef },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async getTransactions(userId: string, limit: number = 20, offset: number = 0): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  // Beneficiary management
  async addBeneficiary(
    userId: string,
    data: {
      type: BeneficiaryType;
      displayName: string;
      phone?: string;
      bankCode?: string;
      accountNumber?: string;
    },
  ): Promise<Beneficiary> {
    const beneficiary = this.beneficiaryRepository.create({
      userId,
      ...data,
    });

    return this.beneficiaryRepository.save(beneficiary);
  }

  async getBeneficiaries(userId: string): Promise<Beneficiary[]> {
    return this.beneficiaryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteBeneficiary(userId: string, beneficiaryId: string): Promise<void> {
    await this.beneficiaryRepository.delete({ id: beneficiaryId, userId });
  }

  private calculateFee(amount: number): number {
    // Fee structure: 0-10000 = 10 Naira, 10001-50000 = 25 Naira, 50001+ = 50 Naira
    if (amount <= 10000) return 10;
    if (amount <= 50000) return 25;
    return 50;
  }
}
