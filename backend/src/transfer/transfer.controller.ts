import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransferService } from './transfer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';
import { BeneficiaryType } from '../database/entities/beneficiary.entity';

class ValidateRecipientDto {
  phone: string;
}

class ValidateBankDto {
  bankCode: string;
  accountNumber: string;
}

class InitiateTransferDto {
  type: 'nerra' | 'bank';
  recipient: string;
  bankCode?: string;
  amount: number;
  narration?: string;
  pin: string;
}

class AddBeneficiaryDto {
  type: BeneficiaryType;
  displayName: string;
  phone?: string;
  bankCode?: string;
  accountNumber?: string;
}

@ApiTags('Transfers')
@Controller('transfers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('nerra/validate-recipient')
  @ApiOperation({ summary: 'Validate Nerra recipient' })
  async validateRecipient(@Req() req: { user: User }, @Body() data: ValidateRecipientDto) {
    return this.transferService.validateRecipient(req.user.id, data.phone);
  }

  @Post('bank/validate-account')
  @ApiOperation({ summary: 'Validate bank account' })
  async validateBank(@Body() data: ValidateBankDto) {
    return this.transferService.validateBankAccount(data.bankCode, data.accountNumber);
  }

  @Post('nerra')
  @ApiOperation({ summary: 'Transfer to Nerra user' })
  async transferToNerra(@Req() req: { user: User }, @Body() data: InitiateTransferDto) {
    return this.transferService.initiateTransfer(req.user.id, { ...data, type: 'nerra' });
  }

  @Post('bank')
  @ApiOperation({ summary: 'Transfer to bank account' })
  async transferToBank(@Req() req: { user: User }, @Body() data: InitiateTransferDto) {
    return this.transferService.initiateTransfer(req.user.id, { ...data, type: 'bank' });
  }

  @Get(':ref')
  @ApiOperation({ summary: 'Get transaction details' })
  async getTransaction(@Req() req: { user: User }, @Param('ref') ref: string) {
    return this.transferService.getTransaction(req.user.id, ref);
  }

  @Get()
  @ApiOperation({ summary: 'Get transaction history' })
  async getTransactions(
    @Req() req: { user: User },
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.transferService.getTransactions(req.user.id, limit, offset);
  }
}

@ApiTags('Beneficiaries')
@Controller('beneficiaries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BeneficiaryController {
  constructor(private readonly transferService: TransferService) {}

  @Get()
  @ApiOperation({ summary: 'Get beneficiaries' })
  async getBeneficiaries(@Req() req: { user: User }) {
    return this.transferService.getBeneficiaries(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add beneficiary' })
  async addBeneficiary(@Req() req: { user: User }, @Body() data: AddBeneficiaryDto) {
    return this.transferService.addBeneficiary(req.user.id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove beneficiary' })
  async removeBeneficiary(@Req() req: { user: User }, @Param('id') id: string) {
    await this.transferService.deleteBeneficiary(req.user.id, id);
    return { message: 'Beneficiary removed' };
  }
}
