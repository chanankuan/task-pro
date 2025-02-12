import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../interfaces';

@Entity('support_cases')
export class Support {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  case_id: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'enum', enum: Status, default: Status.OPEN })
  status: Status;

  @ManyToOne(() => User, (user) => user.supports)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    onUpdate: 'CURRENT_TIMESTAMP', // Set new date on update,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'closed_at' })
  closedAt: Date;
}
