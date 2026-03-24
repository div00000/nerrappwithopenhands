import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationChannel, NotificationType, NotificationStatus } from '../database/entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { status: NotificationStatus.READ, readAt: new Date() },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, status: NotificationStatus.SENT },
      { status: NotificationStatus.READ, readAt: new Date() },
    );
  }

  async createNotification(userId: string, data: {
    channel: NotificationChannel;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, any>;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      ...data,
      status: NotificationStatus.PENDING,
    });

    return this.notificationRepository.save(notification);
  }

  async sendNotification(userId: string, data: {
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, any>;
  }): Promise<void> {
    // Create notification record
    await this.createNotification(userId, {
      channel: NotificationChannel.IN_APP,
      ...data,
    });

    // In production, also send via push/email/SMS based on user preferences
  }
}
