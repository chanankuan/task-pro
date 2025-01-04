import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entity/card.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCardRequestDto, UpdateCardRequestDto } from './dto';
import { ColumnsService } from 'src/columns/columns.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardsRepository: Repository<Card>,
    private readonly columnsService: ColumnsService,
    private readonly dataSource: DataSource,
  ) {}

  getByColumnId(columnId: number) {
    return `This will retrieve all cards related to a column with an id of ${columnId}`;
  }

  // FIND ONE BY ID
  async findById(userId: number, cardId: number) {
    const card = await this.cardsRepository.findOne({
      where: { id: cardId, column: { board: { user: { id: userId } } } },
    });

    return card;
  }

  // CREATE CARD
  async create(userId: number, createCardDto: CreateCardRequestDto) {
    const column = await this.columnsService.findById(
      userId,
      createCardDto.columnId,
    );

    if (!column) {
      throw new NotFoundException(
        `Cannot create card: Column with ID '${createCardDto.columnId}' was not found`,
      );
    }

    // Create new instance
    const card = new Card();
    // Assign cards data
    card.title = createCardDto.title;
    card.description = createCardDto.description;
    card.priority = createCardDto.priority;
    card.deadline = new Date(createCardDto.deadline);
    // Set hour to 23, minutes and seconds to 59
    card.deadline.setHours(23);
    card.deadline.setMinutes(59);
    card.deadline.setSeconds(59);
    card.column = column;

    const newCard = await this.cardsRepository.save(card);

    const { column: _, ...result } = newCard;

    return result;
  }

  // UPDATE CARD
  async updateById(
    userId: number,
    cardId: number,
    updateCardDto: UpdateCardRequestDto,
  ) {
    // Ensure card exists
    const card = await this.findById(userId, cardId);

    if (!card) {
      throw new NotFoundException(
        `The requested resource with ID '${cardId}' was not found`,
      );
    }

    const updatedCard = await this.cardsRepository.save({
      ...card,
      ...updateCardDto,
    });

    return updatedCard;
  }

  // DELETE CARD
  async deleteById(userId: number, cardId: number) {
    // Ensure card exists
    const card = await this.findById(userId, cardId);

    if (!card) {
      throw new NotFoundException(
        `The requested resource with ID '${cardId}' was not found`,
      );
    }

    // Crate transaction
    await this.dataSource.transaction(async (manager) => {
      const currentDate = new Date();

      // Soft delete card
      await manager
        .createQueryBuilder()
        .update(Card)
        .set({ deletedAt: currentDate })
        .where('id = :cardId', { cardId })
        .execute();
    });
  }
}
