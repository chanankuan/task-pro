import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Filter } from '../interfaces';
import { BoardColumn } from 'src/columns/entity/column.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'timestamp without time zone' })
  deadline: Date;

  @Column({ type: 'enum', enum: Filter, default: Filter.DEFAULT })
  filter: Filter;

  @ManyToOne(() => BoardColumn, (column) => column.cards)
  @JoinColumn({ name: 'column_id' })
  column: BoardColumn;
}
