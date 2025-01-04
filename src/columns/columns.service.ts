import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumn } from './entity/column.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateColumnRequestDto, UpdateColumnRequestDto } from './dto';
import { BoardsService } from 'src/boards/boards.service';
import { Card } from 'src/cards/entity/card.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly columnsRepository: Repository<BoardColumn>,
    private readonly boardsService: BoardsService,
    private readonly dataSource: DataSource,
  ) {}

  async findById(userId: number, columnId: number) {
    const column = await this.columnsRepository.findOne({
      where: { id: columnId, board: { user: { id: userId } } },
    });

    // if (!column) {
    //   throw new NotFoundException(
    //     `The requested resource with ID '${columnId}' was not found`,
    //   );
    // }

    return column;
  }

  // CREATE COLUMN
  async create(userId: number, createColumnDto: CreateColumnRequestDto) {
    // Ensure board is found
    const board = await this.boardsService.findById(
      userId,
      createColumnDto.boardId,
    );

    if (!board) {
      throw new NotFoundException(
        `Cannot create column: Board with ID '${createColumnDto.boardId}' was not found`,
      );
    }

    // Create new instance
    const column = new BoardColumn();

    // Assign title and board ID
    column.title = createColumnDto.title;
    column.board = board;

    // Save the column
    const savedColumn = await this.columnsRepository.save(column);
    const { board: _, ...result } = savedColumn;

    return result;
  }

  // UPDATE COLUMN
  async updateById(
    userId: number,
    columnId: number,
    updateColumnDto: UpdateColumnRequestDto,
  ) {
    // Ensure column exists and bolongs to current user
    const column = await this.findById(userId, columnId);

    if (!column) {
      throw new NotFoundException(
        `The requested resource with ID '${columnId}' was not found`,
      );
    }

    // Update column
    const updatedColumn = await this.columnsRepository.save({
      ...column,
      ...updateColumnDto,
    });

    // Return updated column
    return updatedColumn;
  }

  // DELETE COLUMN
  async deleteById(userId: number, columnId: number) {
    // Ensure column exists and bolongs to current user
    const column = await this.findById(userId, columnId);

    if (!column) {
      throw new NotFoundException(
        `The requested resource with ID '${columnId}' was not found`,
      );
    }

    // Crate transaction
    await this.dataSource.transaction(async (manager) => {
      const currentDate = new Date();

      // Soft delete cards related to the column
      await manager
        .createQueryBuilder()
        .update(Card)
        .set({ deletedAt: currentDate })
        .where('column_id = :columnId', { columnId })
        .andWhere('deleted_at IS NULL')
        .execute();

      // Soft delete column
      await manager
        .createQueryBuilder()
        .update(BoardColumn)
        .set({ deletedAt: currentDate })
        .where('id = :columnId', { columnId })
        .execute();
    });
  }
}
