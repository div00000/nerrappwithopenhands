import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PhoneVerificationModule } from './phone-verification/phone-verification.module';
import { PinModule } from './pin/pin.module';
import { KycModule } from './kyc/kyc.module';
import { WalletModule } from './wallet/wallet.module';
import { LedgerModule } from './ledger/ledger.module';
import { TransferModule } from './transfer/transfer.module';
import { ProvidersModule } from './providers/providers.module';
import { AirtimeModule } from './airtime/airtime.module';
import { BillsModule } from './bills/bills.module';
import { CardsModule } from './cards/cards.module';
import { CryptoModule } from './crypto/crypto.module';
import { NotificationModule } from './notification/notification.module';
import { FraudRiskModule } from './fraud-risk/fraud-risk.module';
import { SupportModule } from './support/support.module';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';
import { ReconciliationModule } from './reconciliation/reconciliation.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { typeOrmConfig } from './config/typeorm.config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UsersModule,
    PhoneVerificationModule,
    PinModule,
    KycModule,
    WalletModule,
    LedgerModule,
    TransferModule,
    ProvidersModule,
    AirtimeModule,
    BillsModule,
    CardsModule,
    CryptoModule,
    NotificationModule,
    FraudRiskModule,
    SupportModule,
    AdminModule,
    AuditModule,
    ReconciliationModule,
    OnboardingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
