import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test', 'provision')
          .default('dev'),
        PORT: Joi.number().default(8080),
        ACCESS_SECRET: Joi.string(),
        REGISTER_SECRET: Joi.string(),
        SWAGGER_USER: Joi.string(),
        SWAGGER_PASSWORD: Joi.string(),
        REDIS_HOST: Joi.string(),
        REDIS_PORT: Joi.number(),
        POSTGRES_HOST: Joi.string().default('localhost'),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USER: Joi.string().default('gosrock'),
        POSTGRES_PASSWORD: Joi.string().default('gosrock22th'),
        POSTGRES_DB: Joi.string().default('ticket'),
        SLACK_ORDER_CHANNELID: Joi.string(),
        SLACK_ADMIN_CHANNELID: Joi.string(),
        SLACK_BOT_TOKEN: Joi.string(),
        SLACK_BACKEND_CHANNELID: Joi.string(),
        NAVER_SERVICE_ID: Joi.string(),
        NAVER_ACCESS_KEY: Joi.string(),
        NAVER_SECRET_KEY: Joi.string(),
        NAVER_CALLER: Joi.string()
      })
    })
  ]
})
export class CustomConfigModule {}
