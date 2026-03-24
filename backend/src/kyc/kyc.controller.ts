import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User, KycTier } from '../database/entities/user.entity';
import { DocumentType } from '../database/entities/kyc-document.entity';

class SubmitKycDto {
  tier: number;
  bvn?: string;
  nin?: string;
}

class UploadDocumentDto {
  documentType: DocumentType;
  storageKey: string;
}

@ApiTags('KYC')
@Controller('kyc')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get KYC status' })
  async getStatus(@Req() req: { user: User }) {
    return this.kycService.getKycStatus(req.user.id);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit KYC application' })
  async submit(@Req() req: { user: User }, @Body() data: SubmitKycDto) {
    return this.kycService.submitKyc(req.user.id, data);
  }

  @Post('documents/upload')
  @ApiOperation({ summary: 'Upload KYC document' })
  async uploadDocument(
    @Body() data: UploadDocumentDto,
  ) {
    // Get latest submission for user
    return { message: 'Document upload endpoint - use multipart form data' };
  }

  @Get('limits')
  @ApiOperation({ summary: 'Get KYC limits by tier' })
  async getLimits(@Req() req: { user: User }) {
    return this.kycService.getKycLimits(req.user.kycTier);
  }
}
