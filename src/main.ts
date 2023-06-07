/* eslint-disable @typescript-eslint/no-var-requires */
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as dotenv from 'dotenv';
import { join } from 'path';

import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import {
  customCss,
  description,
  titleApi,
  version,
} from './common/constants/common-api.constants';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const configService = app.get(ConfigService);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

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
