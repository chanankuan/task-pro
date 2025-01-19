import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardRequestDto, UpdateBoardRequestDto } from './dto';
import { User } from 'src/users/entity/user.entity';
import { Card } from 'src/cards/entity/card.entity';
import { BoardColumn } from 'src/columns/entity/column.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(userId: number) {
    const boards = await this.boardsRepository.find({
      where: { user: { id: userId } }, // Filter by user ID
      relations: ['columns', 'columns.cards'], // Include related entities
      // withDeleted: true, // Include soft-deleted records
    });

    return boards;
  }

  async findRelationById(userId: number, boardId: number) {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId, user: { id: userId } }, // Filter by board ID
      relations: ['columns', 'columns.cards'], // Include related entities
    });

    if (!board) {
      throw new NotFoundException(
        `The requested resource with ID '${boardId}' was not found`,
      );
    }

    return board;
  }

  async findById(userId: number, boardId: number) {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId, user: { id: userId } }, // Filter by board ID
    });

    // if (!board) {
    //   throw new NotFoundException(
    //     `The requested resource with ID '${boardId}' was not found`,
    //   );
    // }

    return board;
  }

  async create(userId: number, createBoardDto: CreateBoardRequestDto) {
    // Create an instance of a user
    const user = new User();
    user.id = userId;

    // Create a new board
    const board = new Board();

    // Assign title, iconId, bgName, and user
    board.title = createBoardDto.title;
    board.iconId = createBoardDto.iconId;
    board.bgName = createBoardDto.bgName;
    board.user = user; // Link the user entity

    try {
      await this.boardsRepository.save(board);
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation (Postgres)
        throw new HttpException(
          `User with id ${userId} was not found.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Could not complete operation. Please try later.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBoard = await this.findById(userId, board.id);
    return newBoard;
  }

  async updateById(
    userId: number,
    boardId: number,
    updateBoardDto: UpdateBoardRequestDto,
  ) {
    // Ensure board with id 'boardId' exists and belong to user with id 'userId'
    const board = await this.findById(userId, boardId);

    if (!board) {
      throw new NotFoundException(
        `The requested resource with ID '${boardId}' was not found`,
      );
    }

    // Update board
    const updatedBoard = await this.boardsRepository.save({
      ...board,
      ...updateBoardDto,
      updatedAt: new Date(),
    });

    return updatedBoard;
  }

  async deleteById(userId: number, boardId: number) {
    // Ensure board with id 'boardId' exists and belong to user with id 'userId'
    const board = await this.findById(userId, boardId);

    if (!board) {
      throw new NotFoundException(
        `The requested resource with ID '${boardId}' was not found`,
      );
    }

    await this.dataSource.transaction(async (manager) => {
      const currentDate = new Date();

      // Soft delete cards related to the board's columns
      await manager
        .createQueryBuilder()
        .update(Card)
        .set({ deletedAt: currentDate })
        .where(
          'column_id IN (SELECT id FROM columns WHERE board_id = :boardId)',
          { boardId },
        )
        .andWhere('deleted_at IS NULL')
        .execute();

      // Soft delete columns related to the board
      await manager
        .createQueryBuilder()
        .update(BoardColumn)
        .set({ deletedAt: currentDate })
        .where('board_id = :boardId', { boardId })
        .andWhere('deleted_at IS NULL')
        .execute();

      // Soft delete the board
      await manager
        .createQueryBuilder()
        .update(Board)
        .set({ deletedAt: currentDate })
        .where('id = :boardId', { boardId })
        .execute();
    });
  }
}
