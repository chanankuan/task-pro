import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { SupportService } from './support.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import type { Payload } from 'src/auth/interfaces';
import { supportSchema, type SupportDto } from './dto/support-dto';
import { ZodValidationPipe } from 'src/common/pipes';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async support(
    @Req() req: Request,
    @Body(new ZodValidationPipe(supportSchema)) supportDto: SupportDto,
  ) {
    const { userId } = req.user as Payload;

    await this.supportService.support(userId, supportDto);

    return {
      status: 'success',
      payload: null,
      message: 'Email sent successfully',
    };
  }
}
