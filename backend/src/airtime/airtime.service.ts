import { Injectable, BadRequestException } from '@nestjs/common';

export interface AirtimeProduct {
  network: string;
  code: string;
  name: string;
  denominations: number[];
}

export interface DataProduct {
  network: string;
  planCode: string;
  name: string;
  amount: number;
  validity: string;
}

@Injectable()
export class AirtimeService {
  private airtimeProducts: AirtimeProduct[] = [
    { network: 'mtn', code: 'mtn', name: 'MTN', denominations: [100, 200, 500, 1000, 2000, 5000] },
    { network: 'airtel', code: 'airtel', name: 'Airtel', denominations: [100, 200, 500, 1000, 2000, 5000] },
    { network: 'glo', code: 'glo', name: 'Glo', denominations: [100, 200, 500, 1000, 2000, 5000] },
    { network: '9mobile', code: '9mobile', name: '9Mobile', denominations: [100, 200, 500, 1000, 2000, 5000] },
  ];

  private dataProducts: DataProduct[] = [
    { network: 'mtn', planCode: 'mtn_500_30d', name: 'MTN 500MB', amount: 500, validity: '30 days' },
    { network: 'mtn', planCode: 'mtn_1000_30d', name: 'MTN 1GB', amount: 1000, validity: '30 days' },
    { network: 'mtn', planCode: 'mtn_2000_30d', name: 'MTN 2GB', amount: 2000, validity: '30 days' },
    { network: 'airtel', planCode: 'airtel_500_30d', name: 'Airtel 500MB', amount: 500, validity: '30 days' },
    { network: 'airtel', planCode: 'airtel_1000_30d', name: 'Airtel 1GB', amount: 1000, validity: '30 days' },
    { network: 'glo', planCode: 'glo_500_30d', name: 'Glo 500MB', amount: 500, validity: '30 days' },
    { network: 'glo', planCode: 'glo_1000_30d', name: 'Glo 1GB', amount: 1000, validity: '30 days' },
    { network: '9mobile', planCode: '9mobile_500_30d', name: '9Mobile 500MB', amount: 500, validity: '30 days' },
    { network: '9mobile', planCode: '9mobile_1000_30d', name: '9Mobile 1GB', amount: 1000, validity: '30 days' },
  ];

  getAirtimeProducts(): AirtimeProduct[] {
    return this.airtimeProducts;
  }

  getDataProducts(): DataProduct[] {
    return this.dataProducts;
  }

  async purchaseAirtime(userId: string, network: string, phone: string, amount: number): Promise<{
    success: boolean;
    reference: string;
    message: string;
  }> {
    // Validate network
    const validNetwork = this.airtimeProducts.find(p => p.network === network);
    if (!validNetwork) {
      throw new BadRequestException('Invalid network');
    }

    // Validate amount
    if (!validNetwork.denominations.includes(amount)) {
      throw new BadRequestException('Invalid amount for this network');
    }

    // In production, call provider API
    const reference = `AR${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return {
      success: true,
      reference,
      message: `Airtime purchase successful`,
    };
  }

  async purchaseData(userId: string, network: string, phone: string, planCode: string): Promise<{
    success: boolean;
    reference: string;
    message: string;
  }> {
    // Validate plan
    const plan = this.dataProducts.find(p => p.network === network && p.planCode === planCode);
    if (!plan) {
      throw new BadRequestException('Invalid data plan');
    }

    // In production, call provider API
    const reference = `DA${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return {
      success: true,
      reference,
      message: `Data purchase successful`,
    };
  }
}
