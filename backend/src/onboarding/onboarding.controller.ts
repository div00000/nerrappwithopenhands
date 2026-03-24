import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

@ApiTags('Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('slides')
  @ApiOperation({ summary: 'Get onboarding slides' })
  async getSlides() {
    return this.onboardingService.getSlides();
  }

  @Get('state')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get onboarding state' })
  async getState(@Req() req: { user: User }) {
    return this.onboardingService.getOnboardingState(req.user.id);
  }

  @Post('complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark onboarding as complete' })
  async complete(@Req() req: { user: User }) {
    await this.onboardingService.completeOnboarding(req.user.id);
    return { message: 'Onboarding completed' };
  }

  @Post('reset')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset onboarding for testing' })
  async reset(@Req() req: { user: User }) {
    await this.onboardingService.resetOnboarding(req.user.id);
    return { message: 'Onboarding reset' };
  }
}
