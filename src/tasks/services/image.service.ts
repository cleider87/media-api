import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from '../../common/providers/storage.provider';
import { INPUT_DIR } from '../constants/tasks.constant';

@Injectable()
export class ImagesService {
  constructor(
    private configService: ConfigService,
    private storageProvider: StorageProvider,
  ) {}

  async upload(filename: string, body: Buffer) {
    const key = this.getKey(filename);
    return this.storageProvider.upload(
      this.configService.get('AWS_BUCKET'),
      key,
      body,
    ).then(()=>key).catch(()=>{
      throw new InternalServerErrorException('The file cannot be uploaded');
    });
  }

  getKey(filename: string){
    return `${INPUT_DIR}/${filename}`;
  }
}
