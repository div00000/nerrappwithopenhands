import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';
import { UserProfile } from '../database/entities/user-profile.entity';
import { Device } from '../database/entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile, Device])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
