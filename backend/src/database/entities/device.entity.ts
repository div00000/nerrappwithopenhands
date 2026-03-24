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

export enum TrustedStatus {
  TRUSTED = 'trusted',
  UNTRUSTED = 'untrusted',
  BLOCKED = 'blocked',
}

export enum Platform {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
}

@Entity('devices')
@Index('idx_devices_user_id', ['userId'])
@Index('idx_devices_fingerprint', ['deviceFingerprint'])
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  deviceFingerprint: string;

  @Column({
    type: 'enum',
    enum: Platform,
  })
  platform: Platform;

  @Column({ type: 'varchar', length: 50 })
  appVersion: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  osVersion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  model: string;

  @Column({
    type: 'enum',
    enum: TrustedStatus,
    default: TrustedStatus.UNTRUSTED,
  })
  trustedStatus: TrustedStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastSeenAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
