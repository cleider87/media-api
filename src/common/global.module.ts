import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

const configuration = ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development'),
    PORT: Joi.number().default(3000),
    AWS_ACCESS_KEY: Joi.string().default('localhost'),
    AWS_SECRET_KEY: Joi.string().default('localhost'),
    AWS_REGION: Joi.string(),
    AWS_BUCKET: Joi.string(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  isGlobal: true,
  cache: true,
});

@Global()
@Module({
  imports: [configuration],
  exports: [configuration],
})
export class GlobalModule {}
