import { Module } from '@nestjs/common';
import { DynamoDBProvider } from '../common/providers/dynamo-db.provider';
import { StorageProvider } from '../common/providers/storage.provider';
import { TasksController } from './controllers/tasks.controller';
import { ImagesService } from './services/image.service';
import { TasksService } from './services/tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, ImagesService, StorageProvider, DynamoDBProvider],
})
export class TasksModule {}
