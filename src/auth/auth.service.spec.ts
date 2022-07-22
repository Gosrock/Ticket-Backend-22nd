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
import { SmsFakeService } from 'src/sms/smsFake.service';
import { SmsService } from 'src/sms/sms.service';
import { CustomConfigModule } from 'src/config/customConfig.module';

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
      imports: [CustomConfigModule, SlackModule],
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
        },
        {
          provide: SmsService,
          useClass: SmsFakeService
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
