import { BoardColumn } from 'src/columns/entity/column.entity';
import { Board } from '../entity/board.entity';
import { Card } from 'src/cards/entity/card.entity';

export type GetBoardResponseDto = Pick<
  Board,
  'id' | 'title' | 'iconId' | 'bgName' | 'filter'
> & {
  columns: Array<
    Pick<BoardColumn, 'id' | 'title'> & {
      cards: Array<
        Pick<Card, 'id' | 'title' | 'description' | 'deadline' | 'priority'>
      >;
    }
  >;
};
