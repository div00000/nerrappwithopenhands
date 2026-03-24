import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';

@ApiTags('Cards')
@Controller('cards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get virtual cards' })
  async getCards(@Req() req: { user: User }) {
    return this.cardsService.getCards(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create virtual card' })
  async createCard(@Req() req: { user: User }, @Body() body: { currency?: string }) {
    return this.cardsService.createCard(req.user.id, body.currency);
  }

  @Post(':id/freeze')
  @ApiOperation({ summary: 'Freeze virtual card' })
  async freezeCard(@Req() req: { user: User }, @Param('id') id: string) {
    return this.cardsService.freezeCard(req.user.id, id);
  }

  @Post(':id/unfreeze')
  @ApiOperation({ summary: 'Unfreeze virtual card' })
  async unfreezeCard(@Req() req: { user: User }, @Param('id') id: string) {
    return this.cardsService.unfreezeCard(req.user.id, id);
  }

  @Post(':id/fund')
  @ApiOperation({ summary: 'Fund virtual card' })
  async fundCard(@Req() req: { user: User }, @Param('id') id: string, @Body() body: { amount: number }) {
    return this.cardsService.fundCard(req.user.id, id, body.amount);
  }
}
