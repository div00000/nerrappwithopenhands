import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';
import { TicketCategory, TicketPriority } from '../database/entities/support-ticket.entity';

class CreateTicketDto {
  category: TicketCategory;
  priority?: TicketPriority;
  subject: string;
  description: string;
}

class AddMessageDto {
  body: string;
}

@ApiTags('Support')
@Controller('support/tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  @ApiOperation({ summary: 'Get support tickets' })
  async getTickets(@Req() req: { user: User }) {
    return this.supportService.getTickets(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create support ticket' })
  async createTicket(@Req() req: { user: User }, @Body() data: CreateTicketDto) {
    return this.supportService.createTicket(req.user.id, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details' })
  async getTicket(@Req() req: { user: User }, @Param('id') id: string) {
    return this.supportService.getTicket(req.user.id, id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add message to ticket' })
  async addMessage(@Req() req: { user: User }, @Param('id') id: string, @Body() data: AddMessageDto) {
    return this.supportService.addMessage(id, req.user.id, data.body);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close ticket' })
  async closeTicket(@Req() req: { user: User }, @Param('id') id: string) {
    await this.supportService.closeTicket(req.user.id, id);
    return { message: 'Ticket closed' };
  }
}
