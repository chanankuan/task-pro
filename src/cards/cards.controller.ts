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
import { CardsService } from './cards.service';
import { Request } from 'express';
import { Payload } from 'src/auth/interfaces';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { NotFoundParseIntPipe, ZodValidationPipe } from 'src/common/pipes';
import {
  CreateCardRequestDto,
  createCardSchema,
  UpdateCardRequestDto,
  updateCardSchema,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':id')
  async getById(
    @Req() req: Request,
    @Param('id', new NotFoundParseIntPipe()) cardId: number,
  ) {
    const { userId } = req.user as Payload;

    const card = await this.cardsService.findById(userId, cardId);

    return {
      status: 'success',
      payload: card,
      message: null,
    };
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createCardSchema))
  async create(
    @Req() req: Request,
    @Body() createCardDto: CreateCardRequestDto,
  ) {
    const { userId } = req.user as Payload;

    const card = await this.cardsService.create(userId, createCardDto);

    return {
      status: 'success',
      payload: card,
      message: 'Card created successfully',
    };
  }

  @Patch(':id')
  async updateById(
    @Req() req: Request,
    @Param('id', new NotFoundParseIntPipe()) cardId: number,
    @Body(new ZodValidationPipe(updateCardSchema))
    updateCardDto: UpdateCardRequestDto,
  ) {
    const { userId } = req.user as Payload;

    const card = await this.cardsService.updateById(
      userId,
      cardId,
      updateCardDto,
    );

    return {
      status: 'success',
      payload: card,
      message: 'Card updated succcessfully',
    };
  }

  @Delete(':id')
  async deleteById(
    @Req() req: Request,
    @Param('id', new NotFoundParseIntPipe()) cardId: number,
  ) {
    const { userId } = req.user as Payload;

    await this.cardsService.deleteById(userId, cardId);

    return {
      status: 'success',
      payload: null,
      message: 'Card deleted succcessfully',
    };
  }
}
