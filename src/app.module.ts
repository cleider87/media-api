import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { GlobalModule } from './common/global.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { DynamoDBProvider } from './common/providers/dynamo-db.provider';
import { StorageProvider } from './common/providers/storage.provider';
import { HealthModule } from './health/health.module';
import { ImagesService } from './tasks/services/image.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    GlobalModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    HealthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [ImagesService, StorageProvider, DynamoDBProvider],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
