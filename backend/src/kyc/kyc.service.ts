import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus, KycTier } from '../database/entities/user.entity';
import { KycSubmission, KycStatus } from '../database/entities/kyc-submission.entity';
import { KycDocument, DocumentType, VerificationStatus } from '../database/entities/kyc-document.entity';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(KycSubmission)
    private readonly kycSubmissionRepository: Repository<KycSubmission>,
    @InjectRepository(KycDocument)
    private readonly kycDocumentRepository: Repository<KycDocument>,
  ) {}

  async getKycStatus(userId: string): Promise<{ tier: KycTier; status: KycStatus }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const latestSubmission = await this.kycSubmissionRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return {
      tier: user.kycTier,
      status: latestSubmission?.status || KycStatus.PENDING,
    };
  }

  async submitKyc(userId: string, data: {
    tier: number;
    bvn?: string;
    nin?: string;
  }): Promise<KycSubmission> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.kycTier >= data.tier) {
      throw new BadRequestException('Higher or equal tier already verified');
    }

    // Create KYC submission
    const submission = this.kycSubmissionRepository.create({
      userId,
      tierRequested: data.tier,
      bvn: data.bvn,
      nin: data.nin,
      status: KycStatus.PENDING,
      submittedAt: new Date(),
    });

    await this.kycSubmissionRepository.save(submission);

    // Update user status
    await this.userRepository.update(userId, { status: UserStatus.KYC_PENDING });

    // In production, trigger background verification job
    return submission;
  }

  async uploadDocument(
    submissionId: string,
    documentType: DocumentType,
    storageKey: string,
  ): Promise<KycDocument> {
    const document = this.kycDocumentRepository.create({
      kycSubmissionId: submissionId,
      documentType,
      storageKey,
      verificationStatus: VerificationStatus.PENDING,
    });

    return this.kycDocumentRepository.save(document);
  }

  async getKycLimits(tier: KycTier): Promise<{
    dailyTransferLimit: number;
    singleTransferLimit: number;
    monthlyVolumeLimit: number;
  }> {
    const limits = {
      [KycTier.NONE]: { dailyTransferLimit: 0, singleTransferLimit: 0, monthlyVolumeLimit: 0 },
      [KycTier.TIER_1]: { dailyTransferLimit: 50000, singleTransferLimit: 20000, monthlyVolumeLimit: 200000 },
      [KycTier.TIER_2]: { dailyTransferLimit: 200000, singleTransferLimit: 100000, monthlyVolumeLimit: 1000000 },
      [KycTier.TIER_3]: { dailyTransferLimit: 500000, singleTransferLimit: 250000, monthlyVolumeLimit: 5000000 },
    };
    return limits[tier];
  }

  async reviewSubmission(
    submissionId: string,
    adminId: string,
    decision: 'approve' | 'reject',
    reason?: string,
  ): Promise<KycSubmission> {
    const submission = await this.kycSubmissionRepository.findOne({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    submission.status = decision === 'approve' ? KycStatus.APPROVED : KycStatus.REJECTED;
    submission.reviewedAt = new Date();
    submission.reviewedBy = adminId;
    submission.rejectionReason = reason;

    await this.kycSubmissionRepository.save(submission);

    // Update user tier if approved
    if (decision === 'approve') {
      const user = await this.userRepository.findOne({ where: { id: submission.userId } });
      if (user && user.kycTier < submission.tierRequested) {
        await this.userRepository.update(submission.userId, {
          kycTier: submission.tierRequested as KycTier,
          status: UserStatus.ACTIVE,
        });
      }
    }

    return submission;
  }
}
