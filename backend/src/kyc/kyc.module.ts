import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { User } from '../database/entities/user.entity';
import { KycSubmission } from '../database/entities/kyc-submission.entity';
import { KycDocument } from '../database/entities/kyc-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, KycSubmission, KycDocument])],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
