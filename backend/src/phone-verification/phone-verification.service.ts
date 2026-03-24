import { Injectable, BadRequestException, TooManyRequestsException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../database/entities/user.entity';
import { OtpCode, OtpPurpose } from '../database/entities/otp-code.entity';
import { PhoneVerification, VerificationStatus, VerificationMethod } from '../database/entities/phone-verification.entity';

@Injectable()
export class PhoneVerificationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OtpCode)
    private readonly otpRepository: Repository<OtpCode>,
    @InjectRepository(PhoneVerification)
    private readonly phoneVerificationRepository: Repository<PhoneVerification>,
    private readonly configService: ConfigService,
  ) {}

  async requestOtp(userId: string, phone: string, purpose: OtpPurpose): Promise<void> {
    // Check rate limiting - max 10 OTP requests per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRequests = await this.otpRepository.count({
      where: {
        phone,
        createdAt: MoreThan(oneHourAgo),
      },
    });

    if (recentRequests >= this.configService.get('rateLimit.otpRequests')) {
      throw new TooManyRequestsException('Too many OTP requests. Please try again later.');
    }

    // Generate OTP
    const otp = this.generateOtp();
    const expiryMinutes = this.configService.get('otp.expiryMinutes');

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 12);

    // Create OTP record
    const otpCode = this.otpRepository.create({
      userId,
      phone,
      purpose,
      codeHash: otpHash,
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
      maxAttempts: this.configService.get('otp.maxAttempts'),
    });

    await this.otpRepository.save(otpCode);

    // TODO: Send OTP via SMS provider (Termii, Twilio, etc.)
    // For now, log the OTP for development
    console.log(`OTP for ${phone}: ${otp}`);
  }

  async verifyOtp(userId: string, phone: string, code: string, purpose: OtpPurpose): Promise<boolean> {
    const otpCode = await this.otpRepository.findOne({
      where: {
        phone,
        purpose,
        consumedAt: null,
      },
      order: { createdAt: 'DESC' },
    });

    if (!otpCode) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpCode.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    if (otpCode.attempts >= otpCode.maxAttempts) {
      throw new BadRequestException('Too many attempts. Please request a new OTP');
    }

    const isValid = await bcrypt.compare(code, otpCode.codeHash);
    
    if (!isValid) {
      otpCode.attempts += 1;
      await this.otpRepository.save(otpCode);
      throw new BadRequestException('Invalid OTP');
    }

    // Mark OTP as consumed
    otpCode.consumedAt = new Date();
    await this.otpRepository.save(otpCode);

    // Create phone verification record
    const verification = this.phoneVerificationRepository.create({
      userId,
      phone,
      status: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      verificationMethod: VerificationMethod.OTP,
    });
    await this.phoneVerificationRepository.save(verification);

    // Update user phone if this is initial verification
    if (purpose === OtpPurpose.PHONE_VERIFICATION) {
      await this.userRepository.update(userId, {
        primaryPhone: phone,
        phoneVerifiedAt: new Date(),
        status: UserStatus.PIN_SETUP_PENDING,
      });
    }

    return true;
  }

  async changePhoneRequest(userId: string, newPhone: string): Promise<void> {
    await this.requestOtp(userId, newPhone, OtpPurpose.PHONE_CHANGE);
  }

  async changePhoneConfirm(userId: string, newPhone: string, code: string): Promise<boolean> {
    return this.verifyOtp(userId, newPhone, code, OtpPurpose.PHONE_CHANGE);
  }

  private generateOtp(): string {
    const length = this.configService.get('otp.length');
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }
}
