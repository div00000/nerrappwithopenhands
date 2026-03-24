import { Controller, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async me(@Req() req: { user: User }) {
    const user = await this.usersService.findById(req.user.id);
    const profile = await this.usersService.getProfile(req.user.id);
    return { user, profile };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(@Req() req: { user: User }, @Body() data: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, data);
  }

  @Get('me/devices')
  @ApiOperation({ summary: 'Get user devices' })
  async getDevices(@Req() req: { user: User }) {
    return this.usersService.getDevices(req.user.id);
  }

  @Delete('me/devices/:id')
  @ApiOperation({ summary: 'Remove device' })
  async removeDevice(@Req() req: { user: User }, @Param('id') deviceId: string) {
    return this.usersService.removeDevice(req.user.id, deviceId);
  }
}
