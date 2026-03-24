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

export enum ProviderType {
  AUTH0_EMAIL = 'auth0_email',
  GOOGLE = 'google',
  APPLE = 'apple',
}

@Entity('user_identities')
@Index('idx_user_identities_provider', ['providerType', 'providerUserId'], { unique: true })
@Index('idx_user_identities_user_id', ['userId'])
export class UserIdentity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.identities)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ProviderType,
  })
  providerType: ProviderType;

  @Column({ type: 'varchar', length: 255 })
  providerUserId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerEmail: string;

  @CreateDateColumn()
  linkedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadataJson: Record<string, any>;
}
