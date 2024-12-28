import { Module } from '@nestjs/common';
import { BackgroundsService } from './backgrounds.service';
import { BackgroundsController } from './backgrounds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Background } from './enitity/background.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Background])],
  controllers: [BackgroundsController],
  providers: [BackgroundsService],
})
export class BackgroundsModule {}
