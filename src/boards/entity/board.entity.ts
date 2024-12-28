import { Filter } from 'src/cards/interfaces';
import { BoardColumn } from 'src/columns/entity/column.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'smallint' })
  icon_id: number;

  @Column({ type: 'varchar', length: 255 })
  bg_name: string;

  @Column({ type: 'enum', enum: Filter, default: Filter.DEFAULT })
  filter: Filter;

  @OneToMany(() => BoardColumn, (column) => column.board)
  columns: BoardColumn[];

  @ManyToOne(() => User, (user) => user.boards)
  @JoinColumn({ name: 'user_id' }) // Specify the custom column name
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
