import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from '../services/tasks.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../services/image.service';
import { TaskSchema } from '../schemas/task.schema';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { MAX_FILE_SIZE_BYTES, TaskState } from '../constants/tasks.constant';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly tasksService: TasksService,
  ) {}

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ description: 'Create a taks' })
  @ApiBody({ description: 'Image to upload', type: CreateTaskDto })
  async createTasks(
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_BYTES }),
      ],
    }),) image: Express.Multer.File,
  ): Promise<TaskSchema> {
    const originalPath = this.imagesService.getKey(image.originalname);
    const task: TaskSchema = await this.tasksService.create(originalPath);
    await this.imagesService.upload(
      image.originalname,
      image.buffer,
      image.mimetype,
      {
        taskId: task.id,
      },
    );
    await this.imagesService.create(originalPath, true);
    return this.tasksService.updateById(task.id, TaskState.UPLOADED);
  }

  @Get('/:taskId')
  @ApiOperation({ description: 'Get current state of a task by ID' })
  getTaskById(@Param('taskId') taskId: string): Promise<TaskSchema> {
    return this.tasksService.getById(taskId);
  }
}
