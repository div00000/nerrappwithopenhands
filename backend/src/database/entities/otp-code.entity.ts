import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum OtpPurpose {
  PHONE_VERIFICATION = 'phone_verification',
  PHONE_CHANGE = 'phone_change',
  PASSWORD_RESET = 'password_reset',
  PIN_RESET = 'pin_reset',
  WITHDRAWAL = 'withdrawal',
}

@Entity('otp_codes')
@Index('idx_otp_codes_phone', ['phone'])
@Index('idx_otp_codes_user_id', ['userId'])
@Index('idx_otp_codes_created_at', ['createdAt'])
export class OtpCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.otpCodes, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: OtpPurpose,
  })
  purpose: OtpPurpose;

  @Column({ type: 'varchar', length: 255 })
  codeHash: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  consumedAt: Date;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'int', default: 3 })
  maxAttempts: number;

  @CreateDateColumn()
  createdAt: Date;
}
