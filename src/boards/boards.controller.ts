import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import {
  type CreateBoardRequestDto,
  createBoardSchema,
  type UpdateBoardRequestDto,
  updateBoardSchema,
} from './dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Payload } from 'src/auth/interfaces';
import { Request } from 'express';
import { NotFoundParseIntPipe } from 'src/common/pipes';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const { userId } = req.user as Payload;
    const boards = await this.boardsService.findAll(userId);
    return {
      status: 'success',
      payload: boards,
      message: null,
    };
  }

  @Get(':id')
  async findById(
    @Req() req: Request,
    @Param('id', new NotFoundParseIntPipe()) boardId: number,
  ) {
    const { userId } = req.user as Payload;
    const board = await this.boardsService.findRelationById(userId, boardId);

    return {
      status: 'success',
      payload: board,
      message: null,
    };
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createBoardSchema))
  async create(
    @Req() req: Request,
    @Body() createBoardDto: CreateBoardRequestDto,
  ) {
    const { userId } = req.user as Payload;
    const board = await this.boardsService.create(userId, createBoardDto);

    return {
      status: 'success',
      payload: board,
      message: 'Board created successfully',
    };
  }

  @Patch(':id')
  async updateById(
    @Req() req: Request,
    @Param('id', new NotFoundParseIntPipe()) boardId: number,
    @Body(new ZodValidationPipe(updateBoardSchema))
    updateBoardDto: UpdateBoardRequestDto,
  ) {
    const { userId } = req.user as Payload;
    const board = await this.boardsService.updateById(
      userId,
      boardId,
      updateBoardDto,
    );

    return {
      status: 'success',
      payload: board,
      message: 'Board updated successfully',
    };
  }

  @Delete(':id')
  async deleteById(
    @Req() req: Request,
    @Param('id', new NotFoundParseIntPipe()) boardId: number,
  ) {
    const { userId } = req.user as Payload;
    await this.boardsService.deleteById(userId, boardId);

    return {
      status: 'success',
      payload: null,
      message: 'Board deleted successfully',
    };
  }
}
