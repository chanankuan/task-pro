import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  getAll() {
    return this.boardsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') board_id: number) {
    return this.boardsService.getById(board_id);
  }

  @Post()
  create() {
    return this.boardsService.create();
  }

  @Put(':id')
  updateById(@Param('id') board_id: number) {
    return this.boardsService.updateById(board_id);
  }

  @Delete(':id')
  deleteById(@Param('id') board_id: number) {
    return this.boardsService.deleteById(board_id);
  }
}
