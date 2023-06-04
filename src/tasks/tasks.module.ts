import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { ImagesService } from './services/image.service';
import { StorageProvider } from 'src/common/providers/storage.provider';
import { DynamoDBProvider } from 'src/common/providers/dynamo-db.provider';

@Module({
  controllers: [TasksController],
  providers: [TasksService, ImagesService, StorageProvider, DynamoDBProvider],
})
export class TasksModule {}
