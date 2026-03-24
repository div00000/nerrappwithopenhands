import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { KycDocument } from './kyc-document.entity';

export enum KycStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('kyc_submissions')
export class KycSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.kycSubmissions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  tierRequested: number;

  @Column({
    type: 'enum',
    enum: KycStatus,
    default: KycStatus.PENDING,
  })
  status: KycStatus;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'text', nullable: true })
  riskNotes: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  bvn: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nin: string;

  @OneToMany(() => KycDocument, (doc) => doc.kycSubmission)
  documents: KycDocument[];

  @CreateDateColumn()
  createdAt: Date;
}
