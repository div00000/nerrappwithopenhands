import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, ActorType } from '../database/entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(params: {
    actorType: ActorType;
    actorId: string;
    action: string;
    targetType?: string;
    targetId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const log = this.auditLogRepository.create(params);
    return this.auditLogRepository.save(log);
  }

  async getLogs(filters: {
    actorType?: ActorType;
    actorId?: string;
    action?: string;
    targetType?: string;
    targetId?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    const query = this.auditLogRepository.createQueryBuilder('log');

    if (filters.actorType) {
      query.andWhere('log.actorType = :actorType', { actorType: filters.actorType });
    }
    if (filters.actorId) {
      query.andWhere('log.actorId = :actorId', { actorId: filters.actorId });
    }
    if (filters.action) {
      query.andWhere('log.action LIKE :action', { action: `%${filters.action}%` });
    }
    if (filters.targetType) {
      query.andWhere('log.targetType = :targetType', { targetType: filters.targetType });
    }
    if (filters.targetId) {
      query.andWhere('log.targetId = :targetId', { targetId: filters.targetId });
    }

    query.orderBy('log.createdAt', 'DESC')
      .take(filters.limit || 20)
      .skip(filters.offset || 0);

    return query.getMany();
  }
}
