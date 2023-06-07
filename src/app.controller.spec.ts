import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { GlobalModule } from './common/global.module';
import { DynamoDBProvider } from './common/providers/dynamo-db.provider';
import { StorageProvider } from './common/providers/storage.provider';
import { HealthModule } from './health/health.module';
import { ImagesService } from './tasks/services/image.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';

    const moduleRef = await Test.createTestingModule({
      imports: [GlobalModule, HealthModule],
      controllers: [AppController],
      providers: [ImagesService, StorageProvider, DynamoDBProvider]
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  it('should be defined AppController', () => {
    expect(appController).toBeDefined();
  });
});
