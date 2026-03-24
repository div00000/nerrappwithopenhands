import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VirtualCard, CardProviderType, CardStatus } from '../database/entities/virtual-card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(VirtualCard)
    private readonly cardRepository: Repository<VirtualCard>,
  ) {}

  async getCards(userId: string): Promise<VirtualCard[]> {
    return this.cardRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createCard(userId: string, currency: string = 'NGN'): Promise<VirtualCard> {
    // Check user limit (max 3 cards)
    const count = await this.cardRepository.count({ where: { userId } });
    if (count >= 3) {
      throw new BadRequestException('Maximum card limit reached');
    }

    // In production, call card provider API
    const card = this.cardRepository.create({
      userId,
      providerType: CardProviderType.ITTL,
      providerCardRef: `CARD${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      maskedPan: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      currency,
      status: CardStatus.ACTIVE,
      expiryMonth: String(new Date().getMonth() + 1).padStart(2, '0'),
      expiryYear: String(new Date().getFullYear() + 3).slice(-2),
    });

    return this.cardRepository.save(card);
  }

  async freezeCard(userId: string, cardId: string): Promise<VirtualCard> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    card.status = CardStatus.FROZEN;
    return this.cardRepository.save(card);
  }

  async unfreezeCard(userId: string, cardId: string): Promise<VirtualCard> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    card.status = CardStatus.ACTIVE;
    return this.cardRepository.save(card);
  }

  async fundCard(userId: string, cardId: string, amount: number): Promise<VirtualCard> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.status !== CardStatus.ACTIVE) {
      throw new BadRequestException('Card is not active');
    }

    // In production, call provider API to fund card
    card.availableBalance = parseFloat(card.availableBalance.toString()) + amount;
    return this.cardRepository.save(card);
  }
}
