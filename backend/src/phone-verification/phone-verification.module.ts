import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneVerificationService } from './phone-verification.service';
import { PhoneVerificationController } from './phone-verification.controller';
import { User } from '../database/entities/user.entity';
import { OtpCode } from '../database/entities/otp-code.entity';
import { PhoneVerification } from '../database/entities/phone-verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OtpCode, PhoneVerification])],
  controllers: [PhoneVerificationController],
  providers: [PhoneVerificationService],
  exports: [PhoneVerificationService],
})
export class PhoneVerificationModule {}
