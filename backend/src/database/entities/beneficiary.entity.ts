import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum BeneficiaryType {
  NERRA_PHONE = 'nerra_phone',
  BANK_ACCOUNT = 'bank_account',
}

@Entity('beneficiaries')
@Index('idx_beneficiaries_user_id', ['userId'])
export class Beneficiary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.beneficiaries)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: BeneficiaryType,
  })
  beneficiaryType: BeneficiaryType;

  @Column({ type: 'varchar', length: 100 })
  displayName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  bankCode: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  accountNumberMasked: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  accountName: string;

  @Column({ type: 'boolean', default: false })
  isFavorite: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
