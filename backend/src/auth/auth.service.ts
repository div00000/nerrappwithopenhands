import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserStatus, KycTier, RiskLevel } from '../../database/entities/user.entity';
import { UserIdentity, ProviderType } from '../../database/entities/user-identity.entity';
import { Session } from '../../database/entities/session.entity';
import { OtpCode, OtpPurpose } from '../../database/entities/otp-code.entity';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto, RegisterDto, BootstrapDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserIdentity)
    private readonly identityRepository: Repository<UserIdentity>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(OtpCode)
    private readonly otpRepository: Repository<OtpCode>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async bootstrap(data: BootstrapDto, ipAddress?: string) {
    const { email, provider, providerUserId, providerEmail, metadata } = data;

    // Check if user already exists
    let identity = await this.identityRepository.findOne({
      where: { providerType: provider, providerUserId },
      relations: ['user'],
    });

    let user: User;

    if (identity) {
      user = identity.user;
    } else {
      // Create new user
      user = this.userRepository.create({
        publicUserId: this.generatePublicUserId(),
        primaryEmail: email || providerEmail,
        status: UserStatus.PHONE_VERIFICATION_PENDING,
        kycTier: KycTier.NONE,
        riskLevel: RiskLevel.LOW,
      });
      await this.userRepository.save(user);

      // Create identity link
      identity = this.identityRepository.create({
        userId: user.id,
        providerType: provider,
        providerUserId,
        providerEmail: providerEmail || email,
        metadataJson: metadata,
      });
      await this.identityRepository.save(identity);
    }

    // Update last login
    identity.lastLoginAt = new Date();
    await this.identityRepository.save(identity);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Create session
    await this.createSession(user.id, refreshToken, ipAddress);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      requiresPhoneVerification: user.status === UserStatus.PHONE_VERIFICATION_PENDING,
      requiresPinSetup: user.status === UserStatus.PIN_SETUP_PENDING,
      requiresKyc: user.status === UserStatus.KYC_PENDING,
    };
  }

  async validateToken(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user || user.status === UserStatus.CLOSED) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  async login(data: LoginDto, ipAddress?: string) {
    const { email, password } = data;

    const user = await this.userRepository.findOne({
      where: { primaryEmail: email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.createSession(user.id, refreshToken, ipAddress);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async register(data: RegisterDto, ipAddress?: string) {
    const { email, password, firstName, lastName } = data;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { primaryEmail: email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Create user
    const user = this.userRepository.create({
      publicUserId: this.generatePublicUserId(),
      primaryEmail: email,
      emailVerifiedAt: new Date(),
      status: UserStatus.PHONE_VERIFICATION_PENDING,
      kycTier: KycTier.NONE,
      riskLevel: RiskLevel.LOW,
      passwordHash: await bcrypt.hash(password, 12),
    });

    await this.userRepository.save(user);

    // Create email identity
    const identity = this.identityRepository.create({
      userId: user.id,
      providerType: ProviderType.AUTH0_EMAIL,
      providerUserId: email,
      providerEmail: email,
    });
    await this.identityRepository.save(identity);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.createSession(user.id, refreshToken, ipAddress);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string, ipAddress?: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.secret'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || user.status === UserStatus.CLOSED) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify session
      const session = await this.sessionRepository.findOne({
        where: { userId: user.id, refreshTokenHash: await this.hashToken(refreshToken) },
      });

      if (!session || session.revokedAt) {
        throw new UnauthorizedException('Session revoked');
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Revoke old session and create new one
      session.revokedAt = new Date();
      await this.sessionRepository.save(session);

      await this.createSession(user.id, newRefreshToken, ipAddress);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, allDevices: boolean = false) {
    if (allDevices) {
      await this.sessionRepository.update(
        { userId, revokedAt: null },
        { revokedAt: new Date() },
      );
    } else {
      // Revoke current session (would need token to identify)
      // For now, we'll implement based on user ID
      const sessions = await this.sessionRepository.find({
        where: { userId, revokedAt: null },
        order: { createdAt: 'DESC' },
        take: 1,
      });
      if (sessions.length > 0) {
        sessions[0].revokedAt = new Date();
        await this.sessionRepository.save(sessions[0]);
      }
    }
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.primaryEmail, type: 'access' },
      { expiresIn: this.configService.get('jwt.expiresIn') },
    );
  }

  private generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: this.configService.get('jwt.refreshExpiresIn') },
    );
  }

  private async createSession(userId: string, refreshToken: string, ipAddress?: string) {
    const session = this.sessionRepository.create({
      userId,
      refreshTokenHash: await this.hashToken(refreshToken),
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    await this.sessionRepository.save(session);
  }

  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 12);
  }

  private generatePublicUserId(): string {
    return `NER${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
