import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto';
  icon: string;
}

export interface CryptoTransaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  asset: string;
  amount: number;
  fiatAmount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

@Injectable()
export class CryptoService {
  private cryptoEnabled = false; // Feature flag - disable by default

  private assets: CryptoAsset[] = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', type: 'crypto', icon: 'btc' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', type: 'crypto', icon: 'eth' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', type: 'crypto', icon: 'usdt' },
  ];

  async getAssets(): Promise<CryptoAsset[]> {
    if (!this.cryptoEnabled) {
      throw new ForbiddenException('Crypto services are currently unavailable');
    }
    return this.assets;
  }

  async getTransactions(userId: string): Promise<CryptoTransaction[]> {
    if (!this.cryptoEnabled) {
      throw new ForbiddenException('Crypto services are currently unavailable');
    }
    // Return empty for now
    return [];
  }

  async createOrder(
    userId: string,
    data: {
      type: 'buy' | 'sell';
      asset: string;
      amount: number;
    },
  ): Promise<CryptoTransaction> {
    if (!this.cryptoEnabled) {
      throw new ForbiddenException('Crypto services are currently unavailable');
    }

    const asset = this.assets.find(a => a.id === data.asset);
    if (!asset) {
      throw new BadRequestException('Invalid asset');
    }

    // In production, integrate with licensed crypto partner
    return {
      id: `CR${Date.now()}`,
      type: data.type,
      asset: data.asset,
      amount: data.amount,
      fiatAmount: data.amount * 500, // Mock price
      status: 'pending',
      createdAt: new Date(),
    };
  }
}
