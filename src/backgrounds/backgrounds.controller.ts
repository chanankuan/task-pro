import { Controller, Post } from '@nestjs/common';
import { BackgroundsService } from './backgrounds.service';

@Controller('backgrounds')
export class BackgroundsController {
  constructor(private readonly backgroundsService: BackgroundsService) {}

  @Post('populate-backgrounds')
  async populateBackgrounds() {
    await this.backgroundsService.populateBackgrounds();
    return { message: 'Populated successfully' };
  }
}
