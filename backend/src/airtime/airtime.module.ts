import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirtimeService } from './airtime.service';
import { AirtimeController } from './airtime.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [AirtimeController],
  providers: [AirtimeService],
  exports: [AirtimeService],
})
export class AirtimeModule {}
