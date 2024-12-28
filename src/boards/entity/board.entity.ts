import { BoardColumn } from 'src/columns/entity/column.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'smallint' })
  icon_id: number;

  @OneToMany(() => BoardColumn, (column) => column.board)
  columns: BoardColumn[];

  @ManyToOne(() => User, (user) => user.boards)
  @JoinColumn({ name: 'user_id' }) // Specify the custom column name
  user: User;
}
