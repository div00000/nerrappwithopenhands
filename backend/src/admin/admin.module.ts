import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminUser } from '../database/entities/admin-user.entity';
import { AdminRole } from '../database/entities/admin-role.entity';
import { User } from '../database/entities/user.entity';
import { Transaction } from '../database/entities/transaction.entity';
import { KycSubmission } from '../database/entities/kyc-submission.entity';
import { FraudFlag } from '../database/entities/fraud-flag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, AdminRole, User, Transaction, KycSubmission, FraudFlag]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
