import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, BootstrapDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('session/bootstrap')
  @ApiOperation({ summary: 'Bootstrap session after Auth0 login' })
  async bootstrap(@Body() data: BootstrapDto, @Req() req) {
    return this.authService.bootstrap(data, req.ip);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() data: LoginDto, @Req() req) {
    return this.authService.login(data, req.ip);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register with email and password' })
  async register(@Body() data: RegisterDto, @Req() req) {
    return this.authService.register(data, req.ip);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() body: { refreshToken: string }, @Req() req) {
    return this.authService.refreshToken(body.refreshToken, req.ip);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  async logout(@Body() body: { allDevices?: boolean }, @Req() req) {
    const user = req.user;
    return this.authService.logout(user.id, body.allDevices);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async me(@Req() req) {
    return req.user;
  }
}
