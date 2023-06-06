import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as md5 from 'md5';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBProvider } from '../../common/providers/dynamo-db.provider';
import { TaskState } from '../constants/tasks.constant';
import { TaskSchema } from '../schemas/task.schema';

@Injectable()
export class TasksService {
  private readonly tableName: string = 'ddb-media-api-tasks';

  constructor(private dynamoDBProvider: DynamoDBProvider) {}

  async create(original: string): Promise<TaskSchema> {
    const id = await md5(uuidv4());
    const task = {
      id,
      original,
      state: TaskState.CREATED,
      created: moment().format(),
      updated: moment().format(),
    } as TaskSchema;

    try {
      await this.dynamoDBProvider.create(this.tableName, task);
      return task;
    } catch (e) {
      throw new InternalServerErrorException('Cannot be registered the task!');
    }
  }

  async getById(taskId: string): Promise<TaskSchema> {
    try {
      const {
        Items: [task],
      } = await this.dynamoDBProvider.getById(this.tableName, taskId);
      return task;
    } catch (e) {
      throw new InternalServerErrorException('Cannot be recovered the task!');
    }
  }

  async updateById(taskId: string, state: TaskState): Promise<TaskSchema> {
    try {
      const {
        Items: [task],
      } = await this.dynamoDBProvider.updateById(
        this.tableName,
        taskId,
        'set #state = :state, updated = :updated',
        { ':state': state, ':updated': moment().format() },
        { '#state': 'state' },
      );
      return task;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
