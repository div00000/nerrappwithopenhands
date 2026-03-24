import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PinService } from './pin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

class SetPinDto {
  pin: string;
}

class VerifyPinDto {
  pin: string;
}

class ResetPinDto {
  currentPin?: string;
  newPin: string;
  resetToken?: string;
}

@ApiTags('Security - PIN')
@Controller('security/pin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PinController {
  constructor(private readonly pinService: PinService) {}

  @Post('setup')
  @ApiOperation({ summary: 'Set transaction PIN' })
  async setPin(@Req() req: { user: User }, @Body() data: SetPinDto) {
    await this.pinService.setPin(req.user.id, data.pin);
    return { message: 'PIN set successfully' };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify transaction PIN' })
  async verifyPin(@Req() req: { user: User }, @Body() data: VerifyPinDto) {
    const valid = await this.pinService.verifyPin(req.user.id, data.pin);
    return { valid };
  }

  @Post('reset/request')
  @ApiOperation({ summary: 'Request PIN reset' })
  async requestReset(@Req() req: { user: User }) {
    await this.pinService.requestPinReset(req.user.id);
    return { message: 'PIN reset initiated' };
  }

  @Post('reset/confirm')
  @ApiOperation({ summary: 'Confirm PIN reset' })
  async confirmReset(@Req() req: { user: User }, @Body() data: ResetPinDto) {
    if (data.resetToken) {
      await this.pinService.confirmPinReset(req.user.id, data.resetToken, data.newPin);
    } else if (data.currentPin) {
      await this.pinService.resetPin(req.user.id, data.currentPin, data.newPin);
    }
    return { message: 'PIN reset successfully' };
  }
}
