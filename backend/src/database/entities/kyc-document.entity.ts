import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KycSubmission } from './kyc-submission.entity';

export enum DocumentType {
  ID_CARD = 'id_card',
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  PROOF_OF_ADDRESS = 'proof_of_address',
  SELFIE = 'selfie',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('kyc_documents')
export class KycDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  kycSubmissionId: string;

  @ManyToOne(() => KycSubmission, (submission) => submission.documents)
  @JoinColumn({ name: 'kycSubmissionId' })
  kycSubmission: KycSubmission;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  documentType: DocumentType;

  @Column({ type: 'varchar', length: 500 })
  storageKey: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @CreateDateColumn()
  uploadedAt: Date;
}
