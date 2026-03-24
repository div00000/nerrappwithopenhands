import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinService } from './pin.service';
import { PinController } from './pin.controller';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [PinController],
  providers: [PinService],
  exports: [PinService],
})
export class PinModule {}
