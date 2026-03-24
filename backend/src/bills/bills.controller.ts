import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BillsService } from './bills.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

class ValidateBillDto {
  billerId: string;
  customerReference: string;
}

class PayBillDto {
  billerId: string;
  customerReference: string;
  amount: number;
}

@ApiTags('Bills')
@Controller('bills')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get bill categories' })
  async getCategories() {
    return this.billsService.getCategories();
  }

  @Get('billers')
  @ApiOperation({ summary: 'Get billers' })
  async getBillers(@Param('categoryId') categoryId?: string) {
    return this.billsService.getBillers(categoryId);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate customer reference' })
  async validateBill(@Body() data: ValidateBillDto) {
    return this.billsService.validateBill(data.billerId, data.customerReference);
  }

  @Post('pay')
  @ApiOperation({ summary: 'Pay bill' })
  async payBill(@Req() req: { user: User }, @Body() data: PayBillDto) {
    return this.billsService.payBill(req.user.id, data.billerId, data.customerReference, data.amount);
  }
}
