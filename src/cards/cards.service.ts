import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entity/card.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly boardsRepository: Repository<Card>,
    private readonly dataSource: DataSource,
  ) {}

  getByColumnId(column_id: number) {
    return `This will retrieve all cards related to a column with an id of ${column_id}`;
  }

  getById(card_id: number) {
    return `This will retrieve a card which has an id of ${card_id}`;
  }

  create() {
    return 'This will create a new card';
  }

  updateById(card_id: number) {
    return `This will update the current card which has an id of ${card_id}`;
  }

  deleteById(card_id: number) {
    return `This will delete the card which has an id of ${card_id}`;
  }
}
