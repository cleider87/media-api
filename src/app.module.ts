import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GlobalModule } from './common/global.module';
import { HealthModule } from './health/health.module';
import { TasksModule } from './tasks/tasks.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ThrottlerModule } from '@nestjs/throttler';

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
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
