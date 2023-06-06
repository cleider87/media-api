import { Test } from '@nestjs/testing';
import { GlobalModule } from '../../common/global.module';
import { DynamoDBProvider } from '../../common/providers/dynamo-db.provider';
import { StorageProvider } from '../../common/providers/storage.provider';
import { ImagesService } from '../services/image.service';
import { TasksService } from '../services/tasks.service';
import { TasksController } from './tasks.controller';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GlobalModule],
      controllers: [TasksController],
      providers: [
        TasksService,
        ImagesService,
        DynamoDBProvider,
        StorageProvider
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
    tasksController =
      moduleRef.get<TasksController>(TasksController);
  });

  it('should be defined TasksController', () => {
    expect(tasksController).toBeDefined();
  });

  it('should be defined TasksService', () => {
    expect(tasksService).toBeDefined();
  });
});
