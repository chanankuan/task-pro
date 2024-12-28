import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':id')
  getById(@Param('id') card_id: number) {
    return this.cardsService.getById(card_id);
  }

  @Post()
  create() {
    return this.cardsService.create();
  }

  @Put(':id')
  updateById(@Param('id') card_id: number) {
    return this.cardsService.updateById(card_id);
  }

  @Delete(':id')
  deleteById(@Param('id') card_id: number) {
    return this.cardsService.deleteById(card_id);
  }
}
