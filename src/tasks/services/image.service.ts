import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as md5 from 'md5';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBProvider } from '../../common/providers/dynamo-db.provider';
import { StorageProvider } from '../../common/providers/storage.provider';
import { INPUT_DIR, OUTPUT_DIR } from '../constants/tasks.constant';
import { ImageSchema } from '../schemas/image.schema';

@Injectable()
export class ImagesService {
  private readonly tableName: string = 'ddb-media-api-images';
  constructor(
    private configService: ConfigService,
    private storageProvider: StorageProvider,
    private dynamoDBProvider: DynamoDBProvider,
  ) {}

  async create(path: string, original: boolean): Promise<ImageSchema> {
    const id = await md5(uuidv4());
    const image = {
      id,
      original,
      path,
      resolution: 0,
      created: moment().format(),
    } as ImageSchema;

    try {
      await this.dynamoDBProvider.create(this.tableName, image);
      return image;
    } catch (e) {
      throw new InternalServerErrorException('Cannot be registered the image!');
    }
  }

  async upload(
    filename: string,
    body: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    const key = this.getKey(filename);
    return this.storageProvider
      .upload(
        this.configService.get('AWS_BUCKET'),
        key,
        body,
        contentType,
        metadata,
      )
      .then(() => key)
      .catch(() => {
        throw new InternalServerErrorException('The file cannot be uploaded');
      });
  }

  async listUploads() {
    return this.storageProvider.list(
      this.configService.get('AWS_BUCKET'),
      INPUT_DIR,
    );
  }

  async listResized() {
    return this.storageProvider.list(
      this.configService.get('AWS_BUCKET'),
      OUTPUT_DIR,
    );
  }

  getKey(filename: string): string {
    return `${INPUT_DIR}/${filename}`;
  }
}
