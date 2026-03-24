import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from '../database/entities/admin-user.entity';
import { User, UserStatus } from '../database/entities/user.entity';
import { Transaction } from '../database/entities/transaction.entity';
import { KycSubmission, KycStatus } from '../database/entities/kyc-submission.entity';
import { FraudFlag, FlagStatus } from '../database/entities/fraud-flag.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(KycSubmission)
    private readonly kycRepository: Repository<KycSubmission>,
    @InjectRepository(FraudFlag)
    private readonly fraudFlagRepository: Repository<FraudFlag>,
  ) {}

  async validateAdmin(email: string, password: string): Promise<AdminUser> {
    const admin = await this.adminUserRepository.findOne({ where: { email } });
    
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return admin;
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalTransactions: number;
    pendingKyc: number;
    flaggedTransactions: number;
  }> {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { status: UserStatus.ACTIVE } });
    const totalTransactions = await this.transactionRepository.count();
    const pendingKyc = await this.kycRepository.count({ where: { status: KycStatus.PENDING } });
    const flaggedTransactions = await this.fraudFlagRepository.count({ where: { status: FlagStatus.OPEN } });

    return { totalUsers, activeUsers, totalTransactions, pendingKyc, flaggedTransactions };
  }

  async getUsers(limit: number = 20, offset: number = 0): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async freezeUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { status: UserStatus.RESTRICTED });
  }

  async unfreezeUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { status: UserStatus.ACTIVE });
  }

  async getKycQueue(): Promise<KycSubmission[]> {
    return this.kycRepository.find({
      where: { status: KycStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async reviewKyc(submissionId: string, adminId: string, decision: 'approve' | 'reject', reason?: string): Promise<void> {
    const submission = await this.kycRepository.findOne({ where: { id: submissionId } });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    submission.status = decision === 'approve' ? KycStatus.APPROVED : KycStatus.REJECTED;
    submission.reviewedAt = new Date();
    submission.reviewedBy = adminId;
    submission.rejectionReason = reason;

    await this.kycRepository.save(submission);
  }

  async getFraudQueue(): Promise<FraudFlag[]> {
    return this.fraudFlagRepository.find({
      where: { status: FlagStatus.OPEN },
      order: { createdAt: 'ASC' },
    });
  }

  async resolveFraud(flagId: string, resolution: 'resolved' | 'false_positive'): Promise<void> {
    await this.fraudFlagRepository.update(flagId, {
      status: resolution === 'resolved' ? FlagStatus.RESOLVED : FlagStatus.FALSE_POSITIVE,
      resolvedAt: new Date(),
    });
  }
}
