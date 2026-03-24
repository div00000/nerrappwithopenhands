import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../database/entities/user.entity';
import { UserProfile } from '../database/entities/user-profile.entity';
import { Device } from '../database/entities/device.entity';
import { UpdateProfileDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByPublicId(publicUserId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { publicUserId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getProfile(userId: string): Promise<UserProfile> {
    let profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profileRepository.create({ userId });
      await this.profileRepository.save(profile);
    }
    return profile;
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<UserProfile> {
    let profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profileRepository.create({ userId, ...data });
    } else {
      Object.assign(profile, data);
    }
    return this.profileRepository.save(profile);
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
    await this.userRepository.update(userId, { status });
    return this.findById(userId);
  }

  async getDevices(userId: string): Promise<Device[]> {
    return this.deviceRepository.find({
      where: { userId },
      order: { lastSeenAt: 'DESC' },
    });
  }

  async removeDevice(userId: string, deviceId: string): Promise<void> {
    await this.deviceRepository.delete({ id: deviceId, userId });
  }

  async addOrUpdateDevice(
    userId: string,
    deviceData: Partial<Device>,
  ): Promise<Device> {
    let device = await this.deviceRepository.findOne({
      where: { userId, deviceFingerprint: deviceData.deviceFingerprint },
    });

    if (device) {
      Object.assign(device, deviceData, { lastSeenAt: new Date() });
    } else {
      device = this.deviceRepository.create({ userId, ...deviceData });
    }

    return this.deviceRepository.save(device);
  }
}
