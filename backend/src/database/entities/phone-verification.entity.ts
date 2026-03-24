import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export enum VerificationMethod {
  OTP = 'otp',
  MANUAL = 'manual',
}

@Entity('phone_verifications')
export class PhoneVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.phoneVerifications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({
    type: 'enum',
    enum: VerificationMethod,
    default: VerificationMethod.OTP,
  })
  verificationMethod: VerificationMethod;

  @CreateDateColumn()
  createdAt: Date;
}
