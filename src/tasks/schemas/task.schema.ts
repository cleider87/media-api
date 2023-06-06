import { Schema } from '../../common/interfaces/schema';
import { TaskState } from '../constants/tasks.constant';

export class TaskSchema extends Schema{
    original: string;
    state: TaskState;
    updated: string;
}