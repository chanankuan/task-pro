import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ColumnsService } from './columns.service';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get(':id')
  getById(@Param('id') column_id: number) {
    return this.columnsService.getById(column_id);
  }

  @Post()
  create() {
    return this.columnsService.create();
  }

  @Put(':id')
  updateById(@Param('id') column_id: number) {
    return this.columnsService.updateById(column_id);
  }

  @Delete(':id')
  deleteById(@Param('id') column_id: number) {
    return this.columnsService.deleteById(column_id);
  }
}
