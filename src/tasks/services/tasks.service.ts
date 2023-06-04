import * as md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';
import * as moment from "moment";
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskSchema } from '../schemas/task.schema';
import { TaskState } from '../constants/tasks.constant';
import { DynamoDBProvider } from 'src/common/providers/dynamo-db.provider';

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
      throw new InternalServerErrorException(e);
    }
  }

  async getById(taskId: string) {
    try {
      return await this.dynamoDBProvider.getById(this.tableName, taskId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateById(taskId: string, state: TaskState) {
    try {
      return await this.dynamoDBProvider.updateById(
        this.tableName,
        taskId,
        'set #state = :state, updated = :updated',
        { ':state': state, ':updated': moment().format() },
        { '#state': 'state' },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
