import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum ActorType {
  USER = 'user',
  ADMIN = 'admin',
  SYSTEM = 'system',
}

@Entity('audit_logs')
@Index('idx_audit_logs_actor', ['actorType', 'actorId'])
@Index('idx_audit_logs_action', ['action'])
@Index('idx_audit_logs_target', ['targetType', 'targetId'])
@Index('idx_audit_logs_created_at', ['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActorType,
  })
  actorType: ActorType;

  @Column({ type: 'uuid' })
  actorId: string;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  targetType: string;

  @Column({ type: 'uuid', nullable: true })
  targetId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadataJson: Record<string, any>;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
