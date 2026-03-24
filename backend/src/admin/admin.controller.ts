import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth/login')
  @ApiOperation({ summary: 'Admin login' })
  async login(@Body() body: { email: string; password: string }) {
    return this.adminService.validateAdmin(body.email, body.password);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard stats' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details' })
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Post('users/:id/freeze')
  @ApiOperation({ summary: 'Freeze user' })
  async freezeUser(@Param('id') id: string) {
    await this.adminService.freezeUser(id);
    return { message: 'User frozen' };
  }

  @Post('users/:id/unfreeze')
  @ApiOperation({ summary: 'Unfreeze user' })
  async unfreezeUser(@Param('id') id: string) {
    await this.adminService.unfreezeUser(id);
    return { message: 'User unfrozen' };
  }

  @Get('kyc/queue')
  @ApiOperation({ summary: 'Get KYC review queue' })
  async getKycQueue() {
    return this.adminService.getKycQueue();
  }

  @Post('kyc/:id/approve')
  @ApiOperation({ summary: 'Approve KYC' })
  async approveKyc(@Param('id') id: string, @Body() body: { adminId: string }) {
    await this.adminService.reviewKyc(id, body.adminId, 'approve');
    return { message: 'KYC approved' };
  }

  @Post('kyc/:id/reject')
  @ApiOperation({ summary: 'Reject KYC' })
  async rejectKyc(@Param('id') id: string, @Body() body: { adminId: string; reason: string }) {
    await this.adminService.reviewKyc(id, body.adminId, 'reject', body.reason);
    return { message: 'KYC rejected' };
  }

  @Get('fraud/queue')
  @ApiOperation({ summary: 'Get fraud review queue' })
  async getFraudQueue() {
    return this.adminService.getFraudQueue();
  }

  @Post('fraud/:id/resolve')
  @ApiOperation({ summary: 'Resolve fraud flag' })
  async resolveFraud(@Param('id') id: string, @Body() body: { resolution: 'resolved' | 'false_positive' }) {
    await this.adminService.resolveFraud(id, body.resolution);
    return { message: 'Fraud flag resolved' };
  }
}
