import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Theme } from '../interfaces';
import { Board } from 'src/boards/entity/board.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar_url: string | null;

  @Column({ type: 'enum', enum: Theme, default: Theme.LIGHT })
  theme: Theme;

  @Column({ type: 'varchar', length: 255, nullable: true })
  access_token: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refresh_token: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
}
