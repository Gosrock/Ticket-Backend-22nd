import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockType } from 'src/common/funcs/mockType';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RedisService } from 'src/redis/redis.service';
import { RedisTestService } from 'src/redis/redisTest.service';
import { SlackService } from 'src/slack/slack.service';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import * as Joi from 'joi';
import { SlackModule } from 'src/slack/slack.module';

export const repositoryMockFactory: () => MockType<UserRepository> = jest.fn(
  () => ({
    findAll: jest.fn(entity => entity)
    // ...
  })
);

const dataSourceFactory: () => MockType<DataSource> = jest.fn(() => ({
  // ...
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // envFilePath: process.env.NODE_ENV === 'test' ? '.env.local' : '.env',
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
            SLACK_ADMIN_CHANNELID: Joi.string()
          })
        }),
        SlackModule
      ],
      // imports: [TypeOrmModule.forFeature([User])],
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useFactory: repositoryMockFactory
        },
        {
          provide: DataSource,
          useFactory: dataSourceFactory
        },
        {
          provide: RedisService,
          useClass: RedisTestService
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
