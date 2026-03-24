import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { AdminUserRole } from './admin-user-role.entity';

@Entity('admin_roles')
export class AdminRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => AdminUserRole, (userRole) => userRole.adminRole)
  adminUserRoles: AdminUserRole[];

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('admin_user_roles')
export class AdminUserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  adminUserId: string;

  @Column({ type: 'uuid' })
  adminRoleId: string;

  @CreateDateColumn()
  createdAt: Date;
}
