import { Board } from '../entity/board.entity';

export type CreateBoardResponseDto = Pick<
  Board,
  'id' | 'title' | 'iconId' | 'bgName' | 'filter'
>;
