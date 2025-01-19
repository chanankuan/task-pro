import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { Request } from 'express';
import { Payload } from 'src/auth/interfaces';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { NotFoundParseIntPipe, ZodValidationPipe } from 'src/common/pipes';
import {
  CreateColumnRequestDto,
  createColumnSchema,
  UpdateColumnRequestDto,
  updateColumnSchema,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  // GET COLUMN BY ID
  @Get(':id')
  async getById(
    @Req() req: Request,
    @Param('id', new NotFoundParseIntPipe()) columnId: number,
  ) {
    const { userId } = req.user as Payload;

    const column = await this.columnsService.findById(userId, columnId);

    if (!column) {
      throw new NotFoundException(
        `The requested resource with ID '${columnId}' was not found`,
      );
    }

    return {
      status: 'success',
      payload: column,
      message: null,
    };
  }

  // CREATE COLUMN
  @Post()
  @UsePipes(new ZodValidationPipe(createColumnSchema))
  async create(
    @Req() req: Request,
    @Body() createColumnDto: CreateColumnRequestDto,
  ) {
    const { userId } = req.user as Payload;

    const column = await this.columnsService.create(userId, createColumnDto);

    return {
      status: 'success',
      payload: column,
      message: 'Column created successfully',
    };
  }

  // UPDATE COLUMN
  @Patch(':id')
  async updateById(
    @Req() req: Request,
    @Param('id', new NotFoundParseIntPipe()) columnId: number,
    @Body(new ZodValidationPipe(updateColumnSchema))
    updateColumnDto: UpdateColumnRequestDto,
  ) {
    const { userId } = req.user as Payload;

    const column = await this.columnsService.updateById(
      userId,
      columnId,
      updateColumnDto,
    );

    return {
      status: 'success',
      payload: column,
      message: 'Column updated successfully',
    };
  }

  // DELETE COLUMN
  @Delete(':id')
  async deleteById(
    @Req() req: Request,
    @Param('id', new NotFoundParseIntPipe()) columnId: number,
  ) {
    const { userId } = req.user as Payload;

    await this.columnsService.deleteById(userId, columnId);

    return {
      status: 'success',
      payload: null,
      message: 'Column deleted successfully',
    };
  }
}
