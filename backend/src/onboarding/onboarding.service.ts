import { Injectable } from '@nestjs/common';

export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  animationUrl?: string;
}

@Injectable()
export class OnboardingService {
  private slides: OnboardingSlide[] = [
    {
      id: 1,
      title: 'Welcome to Nerra',
      description: 'Your all-in-one financial companion. Send money, pay bills, and manage your finances with ease.',
    },
    {
      id: 2,
      title: 'Flexible Access',
      description: 'Sign in with Google, Apple, or email. Your choice, your security.',
    },
    {
      id: 3,
      title: 'Everything in One Place',
      description: 'Wallet, transfers, airtime, data, bills, and virtual cards. All in one app.',
    },
    {
      id: 4,
      title: 'Security First',
      description: 'Phone verification, transaction PIN, KYC, and fraud controls keep your money safe.',
    },
    {
      id: 5,
      title: 'Licensed Partners',
      description: 'Financial services delivered through licensed third-party partners. Nerra is not a bank.',
    },
  ];

  getSlides(): OnboardingSlide[] {
    return this.slides;
  }

  async completeOnboarding(userId: string): Promise<void> {
    // In production, update user record
    console.log(`Onboarding completed for user ${userId}`);
  }

  async getOnboardingState(userId: string): Promise<{ completed: boolean }> {
    // In production, check user record
    return { completed: false };
  }

  async resetOnboarding(userId: string): Promise<void> {
    // In production, reset user onboarding state
    console.log(`Onboarding reset for user ${userId}`);
  }
}
