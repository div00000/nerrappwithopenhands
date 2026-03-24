import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserIdentity } from './user-identity.entity';
import { UserProfile } from './user-profile.entity';
import { Device } from './device.entity';
import { Session } from './session.entity';
import { Wallet } from './wallet.entity';
import { OtpCode } from './otp-code.entity';
import { PhoneVerification } from './phone-verification.entity';
import { KycSubmission } from './kyc-submission.entity';
import { Beneficiary } from './beneficiary.entity';
import { Transaction } from './transaction.entity';
import { VirtualAccount } from './virtual-account.entity';
import { VirtualCard } from './virtual-card.entity';
import { Notification } from './notification.entity';
import { SupportTicket } from './support-ticket.entity';
import { FraudFlag } from './fraud-flag.entity';
import { RiskScore } from './risk-score.entity';
import { LegalConsent } from './legal-consent.entity';

export enum UserStatus {
  ONBOARDING_PENDING = 'onboarding_pending',
  PHONE_VERIFICATION_PENDING = 'phone_verification_pending',
  PIN_SETUP_PENDING = 'pin_setup_pending',
  KYC_PENDING = 'kyc_pending',
  ACTIVE = 'active',
  RESTRICTED = 'restricted',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

export enum KycTier {
  NONE = 0,
  TIER_1 = 1, // Basic - phone + email verified
  TIER_2 = 2, // BVN verified
  TIER_3 = 3, // Full KYC with ID verification
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('users')
@Index('idx_users_status', ['status'])
@Index('idx_users_primary_phone', ['primaryPhone'])
@Index('idx_users_primary_email', ['primaryEmail'])
@Index('idx_users_public_user_id', ['publicUserId'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  publicUserId: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ONBOARDING_PENDING,
  })
  status: UserStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  primaryEmail: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Index('idx_users_phone')
  primaryPhone: string;

  @Column({ type: 'timestamp', nullable: true })
  phoneVerifiedAt: Date;

  @Column({
    type: 'enum',
    enum: KycTier,
    default: KycTier.NONE,
  })
  kycTier: KycTier;

  @Column({ type: 'boolean', default: false })
  transactionPinEnabled: boolean;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.LOW,
  })
  riskLevel: RiskLevel;

  @Column({ type: 'boolean', default: false })
  onboardingCompleted: boolean;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @OneToMany(() => UserIdentity, (identity) => identity.user)
  identities: UserIdentity[];

  @OneToMany(() => UserProfile, (profile) => profile.user)
  profiles: UserProfile[];

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => OtpCode, (otp) => otp.user)
  otpCodes: OtpCode[];

  @OneToMany(() => PhoneVerification, (pv) => pv.user)
  phoneVerifications: PhoneVerification[];

  @OneToMany(() => KycSubmission, (kyc) => kyc.user)
  kycSubmissions: KycSubmission[];

  @OneToMany(() => Beneficiary, (beneficiary) => beneficiary.user)
  beneficiaries: Beneficiary[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => VirtualAccount, (va) => va.user)
  virtualAccounts: VirtualAccount[];

  @OneToMany(() => VirtualCard, (card) => card.user)
  virtualCards: VirtualCard[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => SupportTicket, (ticket) => ticket.user)
  supportTickets: SupportTicket[];

  @OneToMany(() => FraudFlag, (flag) => flag.user)
  fraudFlags: FraudFlag[];

  @OneToMany(() => RiskScore, (score) => score.user)
  riskScores: RiskScore[];

  @OneToMany(() => LegalConsent, (consent) => consent.user)
  legalConsents: LegalConsent[];
}
