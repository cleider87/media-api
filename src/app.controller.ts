import { Controller, Get, Render } from '@nestjs/common';
import { ImagesService } from './tasks/services/image.service';

@Controller()
export class AppController {

  constructor(
    private readonly imagesService: ImagesService
  ) {}
  @Get()
  @Render('index')
  async getRoot(){
    const uploaded = await this.imagesService.listUploads();
    const resized = await this.imagesService.listResized();
    return { uploaded, resized };
  }
}
