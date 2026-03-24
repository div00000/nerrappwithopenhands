import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Provider interface definitions
export interface DepositInstruction {
  accountNumber: string;
  accountName: string;
  bankName: string;
  provider: string;
}

export interface PayoutResult {
  provider: string;
  providerReference: string;
  status: 'pending' | 'success' | 'failed';
  message?: string;
}

export interface BankAccountValidation {
  valid: boolean;
  accountName?: string;
  bankCode?: string;
}

// Provider adapter interface
export interface IPaymentProvider {
  readonly name: string;
  readonly type: 'funding' | 'payout' | 'virtual_account' | 'card';
  
  createDepositInstruction(userId: string): Promise<DepositInstruction>;
  validateBankAccount(bankCode: string, accountNumber: string): Promise<BankAccountValidation>;
  initiatePayout(params: {
    bankCode: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    narration?: string;
  }): Promise<PayoutResult>;
  queryPayoutStatus(providerRef: string): Promise<PayoutResult>;
}

@Injectable()
export class ProvidersService {
  private providers: Map<string, IPaymentProvider> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.initializeProviders();
  }

  private initializeProviders() {
    // In production, initialize actual provider adapters
    // For now, register mock providers
    this.providers.set('flutterwave', this.createFlutterwaveAdapter());
    this.providers.set('paystack', this.createPaystackAdapter());
  }

  private createFlutterwaveAdapter(): IPaymentProvider {
    return {
      name: 'Flutterwave',
      type: 'payout',
      async createDepositInstruction(userId: string): Promise<DepositInstruction> {
        return {
          accountNumber: '1234567890',
          accountName: `NERRA_${userId.substring(0, 8)}`,
          bankName: 'Guaranty Trust Bank',
          provider: 'flutterwave',
        };
      },
      async validateBankAccount(bankCode: string, accountNumber: string): Promise<BankAccountValidation> {
        // In production, call Flutterwave API
        return { valid: accountNumber.length === 10, accountName: 'Verified Account', bankCode };
      },
      async initiatePayout(params): Promise<PayoutResult> {
        // In production, call Flutterwave API
        return {
          provider: 'flutterwave',
          providerReference: `FLW${Date.now()}`,
          status: 'success',
        };
      },
      async queryPayoutStatus(providerRef: string): Promise<PayoutResult> {
        return { provider: 'flutterwave', providerReference: providerRef, status: 'success' };
      },
    };
  }

  private createPaystackAdapter(): IPaymentProvider {
    return {
      name: 'Paystack',
      type: 'payout',
      async createDepositInstruction(userId: string): Promise<DepositInstruction> {
        return {
          accountNumber: '0987654321',
          accountName: `NERRA_${userId.substring(0, 8)}`,
          bankName: 'Access Bank',
          provider: 'paystack',
        };
      },
      async validateBankAccount(bankCode: string, accountNumber: string): Promise<BankAccountValidation> {
        return { valid: accountNumber.length === 10, accountName: 'Verified Account', bankCode };
      },
      async initiatePayout(params): Promise<PayoutResult> {
        return {
          provider: 'paystack',
          providerReference: `PS${Date.now()}`,
          status: 'success',
        };
      },
      async queryPayoutStatus(providerRef: string): Promise<PayoutResult> {
        return { provider: 'paystack', providerReference: providerRef, status: 'success' };
      },
    };
  }

  getProvider(name: string): IPaymentProvider | undefined {
    return this.providers.get(name);
  }

  getAllProviders(): IPaymentProvider[] {
    return Array.from(this.providers.values());
  }

  async routeTransaction(transactionKind: string): Promise<IPaymentProvider> {
    // Simple routing - in production, implement complex routing logic
    const provider = this.providers.get('flutterwave');
    if (!provider) {
      throw new Error('No provider available');
    }
    return provider;
  }
}
