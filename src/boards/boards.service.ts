import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,
    private readonly dataSource: DataSource,
  ) {}

  getAll() {
    return 'This will retrieve all boards owned by a user';
  }

  getById(board_id: number) {
    return `This will retrieve a board which has an id of ${board_id}`;
  }

  create() {
    return 'This will create a new board';
  }

  updateById(board_id: number) {
    return `This will update the current board which has an id of ${board_id}`;
  }

  deleteById(board_id: number) {
    return `This will delete the board which has an id of ${board_id}`;
  }
}
