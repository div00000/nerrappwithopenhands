import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { VirtualCard } from '../database/entities/virtual-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VirtualCard])],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
