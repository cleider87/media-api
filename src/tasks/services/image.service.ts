import * as md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from '../../common/providers/storage.provider';
import { INPUT_DIR } from '../constants/tasks.constant';
import { DynamoDBProvider } from 'src/common/providers/dynamo-db.provider';
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
      throw new InternalServerErrorException(e);
    }
  }

  async upload(
    filename: string,
    body: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
  ) {
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

  getKey(filename: string) {
    return `${INPUT_DIR}/${filename}`;
  }
}
