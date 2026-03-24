import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketCategory, TicketPriority, TicketStatus } from '../database/entities/support-ticket.entity';
import { SupportMessage, SenderType } from '../database/entities/support-message.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepository: Repository<SupportTicket>,
    @InjectRepository(SupportMessage)
    private readonly messageRepository: Repository<SupportMessage>,
  ) {}

  async createTicket(userId: string, data: {
    category: TicketCategory;
    priority?: TicketPriority;
    subject: string;
    description: string;
  }): Promise<SupportTicket> {
    const ticket = this.ticketRepository.create({
      userId,
      category: data.category,
      priority: data.priority || TicketPriority.MEDIUM,
      subject: data.subject,
      description: data.description,
      status: TicketStatus.OPEN,
    });

    return this.ticketRepository.save(ticket);
  }

  async getTickets(userId: string): Promise<SupportTicket[]> {
    return this.ticketRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTicket(userId: string, ticketId: string): Promise<SupportTicket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId, userId },
      relations: ['messages'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async addMessage(ticketId: string, userId: string, body: string): Promise<SupportMessage> {
    const message = this.messageRepository.create({
      ticketId,
      senderType: SenderType.USER,
      senderId: userId,
      body,
    });

    return this.messageRepository.save(message);
  }

  async closeTicket(userId: string, ticketId: string): Promise<void> {
    await this.ticketRepository.update(
      { id: ticketId, userId },
      { status: TicketStatus.CLOSED, closedAt: new Date() },
    );
  }
}
