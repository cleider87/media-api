/* eslint-disable @typescript-eslint/no-var-requires */
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import {
  customCss,
  description,
  titleApi,
  version,
} from './common/constants/common-api.constants';
import { ConfigService } from '@nestjs/config';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle(titleApi)
      .setDescription(description)
      .setVersion(version)
      .build();

    SwaggerModule.setup(
      'api/docs',
      app,
      SwaggerModule.createDocument(app, config),
      {
        customCss,
        customSiteTitle: titleApi,
      },
    );
  }

  app.use(compression());

  app.use((req: Request, _res: Response, next) => {
    Logger.log(`${req.method} ${req.url}`);
    next();
  });

  await app.listen(configService.get('PORT'));
}
bootstrap();
