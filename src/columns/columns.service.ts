import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumn } from './entity/column.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly columnsRepository: Repository<BoardColumn>,
    private readonly dataSource: DataSource,
  ) {}

  getByBoardId(board_id: number) {
    return `This will retrieve all columns related to a board with an id of ${board_id}`;
  }

  getById(column_id: number) {
    return `This will retrieve a column which has an id of ${column_id}`;
  }

  create() {
    return 'This will create a new column';
  }

  updateById(column_id: number) {
    return `This will update the current column which has an id of ${column_id}`;
  }

  deleteById(column_id: number) {
    return `This will delete the column which has an id of ${column_id}`;
  }
}
