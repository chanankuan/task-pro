import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumn } from './entity/column.entity';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  imports: [BoardsModule, TypeOrmModule.forFeature([BoardColumn])],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
