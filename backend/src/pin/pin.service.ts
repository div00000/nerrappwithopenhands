import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserStatus, KycTier } from '../database/entities/user.entity';

@Injectable()
export class PinService {
  private pinAttempts: Map<string, { count: number; lockedUntil?: Date }> = new Map();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async setPin(userId: string, pin: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.transactionPinEnabled) {
      throw new BadRequestException('PIN already set. Use reset to change.');
    }

    // Validate PIN format (4-6 digits)
    if (!/^\d{4,6}$/.test(pin)) {
      throw new BadRequestException('PIN must be 4-6 digits');
    }

    const pinHash = await bcrypt.hash(pin, 12);
    
    // In production, store in a separate secure table
    // For now, we'll use a metadata approach
    await this.userRepository.update(userId, {
      transactionPinEnabled: true,
    });

    // Update status if pending
    if (user.status === UserStatus.PIN_SETUP_PENDING) {
      await this.userRepository.update(userId, {
        status: UserStatus.KYC_PENDING,
      });
    }
  }

  async verifyPin(userId: string, pin: string): Promise<boolean> {
    const attempts = this.pinAttempts.get(userId) || { count: 0 };
    
    if (attempts.lockedUntil && attempts.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil.getTime() - Date.now()) / 60000);
      throw new ForbiddenException(`Too many attempts. Try again in ${remainingMinutes} minutes`);
    }

    // In production, retrieve stored PIN hash
    // For demo, we'll simulate
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user || !user.transactionPinEnabled) {
      throw new BadRequestException('PIN not set');
    }

    // In production, compare with stored hash
    // For demo, accept any 4-6 digit PIN
    const isValid = /^\d{4,6}$/.test(pin);
    
    if (!isValid) {
      this.incrementAttempts(userId);
      throw new BadRequestException('Invalid PIN');
    }

    // Reset attempts on success
    this.pinAttempts.delete(userId);
    return true;
  }

  async resetPin(userId: string, currentPin: string, newPin: string): Promise<void> {
    // Verify current PIN first
    await this.verifyPin(userId, currentPin);
    
    // Set new PIN
    await this.setPin(userId, newPin);
  }

  async requestPinReset(userId: string): Promise<void> {
    // In production, send reset token via email/SMS
    // For now, just simulate
    console.log(`PIN reset requested for user ${userId}`);
  }

  async confirmPinReset(userId: string, resetToken: string, newPin: string): Promise<void> {
    // In production, verify reset token
    await this.setPin(userId, newPin);
  }

  private incrementAttempts(userId: string): void {
    const attempts = this.pinAttempts.get(userId) || { count: 0 };
    attempts.count += 1;
    
    const maxAttempts = this.configService.get('pin.maxAttempts');
    const lockoutMinutes = this.configService.get('pin.lockoutMinutes');
    
    if (attempts.count >= maxAttempts) {
      attempts.lockedUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
    }
    
    this.pinAttempts.set(userId, attempts);
  }
}
