import { Priority } from 'src/cards/interfaces';
import { BoardColumn } from 'src/columns/entity/column.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column({ type: 'smallint', name: 'icon_id' })
  iconId: number;

  @Column({ type: 'varchar', length: 255, name: 'bg_name' })
  bgName: string;

  @Column({ type: 'enum', enum: Priority, nullable: true, default: null })
  filter: Priority;

  @OneToMany(() => BoardColumn, (column) => column.board, { cascade: true })
  columns: BoardColumn[];

  @ManyToOne(() => User, (user) => user.boards, { nullable: false })
  @JoinColumn({ name: 'user_id' }) // Specify the custom column name
  user: User;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    onUpdate: 'CURRENT_TIMESTAMP', // Set new date on update,
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;
}
