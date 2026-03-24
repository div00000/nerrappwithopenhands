import { Injectable, BadRequestException } from '@nestjs/common';

export interface BillerCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Biller {
  id: string;
  categoryId: string;
  name: string;
  serviceType: string;
}

@Injectable()
export class BillsService {
  private categories: BillerCategory[] = [
    { id: 'electricity', name: 'Electricity', icon: 'bolt' },
    { id: 'tv', name: 'TV & Entertainment', icon: 'tv' },
    { id: 'internet', name: 'Internet', icon: 'wifi' },
    { id: 'education', name: 'Education', icon: 'school' },
    { id: 'insurance', name: 'Insurance', icon: 'shield' },
  ];

  private billers: Biller[] = [
    { id: 'ikeja-electric', categoryId: 'electricity', name: 'Ikeja Electric', serviceType: 'prepaid' },
    { id: 'eko-electric', categoryId: 'electricity', name: 'Eko Electric', serviceType: 'prepaid' },
    { id: 'jos-electric', categoryId: 'electricity', name: 'Jos Electric', serviceType: 'prepaid' },
    { id: 'port Harcourt-electric', categoryId: 'electricity', name: 'Port Harcourt Electric', serviceType: 'prepaid' },
    { id: 'dstv', categoryId: 'tv', name: 'DSTV', serviceType: 'subscription' },
    { id: 'gotv', categoryId: 'tv', name: 'GOTV', serviceType: 'subscription' },
    { id: 'startimes', categoryId: 'tv', name: 'StarTimes', serviceType: 'subscription' },
    { id: 'spectranet', categoryId: 'internet', name: 'Spectranet', serviceType: 'data' },
    { id: 'smile', categoryId: 'internet', name: 'Smile', serviceType: 'data' },
  ];

  getCategories(): BillerCategory[] {
    return this.categories;
  }

  getBillers(categoryId?: string): Biller[] {
    if (categoryId) {
      return this.billers.filter(b => b.categoryId === categoryId);
    }
    return this.billers;
  }

  async validateBill(billerId: string, customerReference: string): Promise<{
    valid: boolean;
    customerName?: string;
    amount?: number;
  }> {
    // In production, call provider API
    return {
      valid: true,
      customerName: 'JOHN DOE',
      amount: 5000,
    };
  }

  async payBill(userId: string, billerId: string, customerReference: string, amount: number): Promise<{
    success: boolean;
    reference: string;
    message: string;
  }> {
    const biller = this.billers.find(b => b.id === billerId);
    if (!biller) {
      throw new BadRequestException('Invalid biller');
    }

    const reference = `BL${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return {
      success: true,
      reference,
      message: `Bill payment successful for ${biller.name}`,
    };
  }
}
