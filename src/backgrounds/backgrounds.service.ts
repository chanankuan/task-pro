import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Background } from './enitity/background.entity';
import { backgrounds } from './data';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BackgroundsService {
  constructor(
    @InjectRepository(Background)
    private backgroundsRepository: Repository<Background>,
    private readonly dataSource: DataSource,
  ) {}

  async populateBackgrounds() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      await queryRunner.query(
        'TRUNCATE TABLE backgrounds RESTART IDENTITY CASCADE',
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    for (const background of backgrounds) {
      const bg = new Background();
      bg.name = background.name;
      bg.background_url = background.background_url;
      bg.type = background.type;
      bg.upscale = background.upscale;

      await this.backgroundsRepository.save(bg); // This awaits correctly in a `for...of` loop
    }
  }
}
