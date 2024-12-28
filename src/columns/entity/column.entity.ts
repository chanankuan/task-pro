import { Board } from 'src/boards/entity/board.entity';
import { Card } from 'src/cards/entity/card.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('columns')
export class BoardColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ManyToOne(() => Board, (board) => board.columns)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => Card, (card) => card.column)
  cards: Card[];
}
