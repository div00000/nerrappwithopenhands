import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PhoneVerificationService } from './phone-verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';
import { OtpPurpose } from '../database/entities/otp-code.entity';

class RequestOtpDto {
  phone: string;
}

class VerifyOtpDto {
  phone: string;
  code: string;
}

@ApiTags('Phone Verification')
@Controller('verification/phone')
export class PhoneVerificationController {
  constructor(private readonly phoneVerificationService: PhoneVerificationService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request OTP for phone verification' })
  async requestOtp(@Req() req: { user: User }, @Body() data: RequestOtpDto) {
    await this.phoneVerificationService.requestOtp(req.user.id, data.phone, OtpPurpose.PHONE_VERIFICATION);
    return { message: 'OTP sent successfully' };
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify phone with OTP' })
  async verifyOtp(@Req() req: { user: User }, @Body() data: VerifyOtpDto) {
    const result = await this.phoneVerificationService.verifyOtp(
      req.user.id,
      data.phone,
      data.code,
      OtpPurpose.PHONE_VERIFICATION,
    );
    return { verified: result };
  }

  @Post('change/request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request OTP for phone change' })
  async requestPhoneChange(@Req() req: { user: User }, @Body() data: RequestOtpDto) {
    await this.phoneVerificationService.changePhoneRequest(req.user.id, data.phone);
    return { message: 'OTP sent successfully' };
  }

  @Post('change/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm phone change with OTP' })
  async confirmPhoneChange(@Req() req: { user: User }, @Body() data: VerifyOtpDto) {
    const result = await this.phoneVerificationService.changePhoneConfirm(
      req.user.id,
      data.phone,
      data.code,
    );
    return { changed: result };
  }
}
