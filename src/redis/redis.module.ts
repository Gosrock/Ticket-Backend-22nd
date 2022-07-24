import {
  DynamicModule,
  Global,
  Logger,
  LoggerService,
  Module,
  Provider
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, RedisClientOptions } from 'redis';
import { FakeLogger } from './FakeLogger';
import { RedisService } from './redis.service';
import { RedisAsyncConfig } from './config/RedisAsyncConfig.interface';
import { RedisOption } from './config/RedisOption.interface';
import {
  REDIS_CLIENT_PROVIDER,
  REDIS_MODULE_OPTIONS
} from './config/Redis.const';
import { RedisTestService } from './redisTest.service';

export type RedisClientType = ReturnType<typeof createClient>;
/**
 * 레디스 관련 모듈
 * 인증 관련 휴대전화번호 저장이나 간단한 캐시등을 사용하는 모듈
 * 2022-07-13 이찬진
 */

@Global()
@Module({})
export class RedisModule {
  static forRootAsync(redisAsyncConfig: RedisAsyncConfig): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_MODULE_OPTIONS,
          useFactory: redisAsyncConfig.useFactory,
          inject: redisAsyncConfig.inject || []
        },
        {
          provide: REDIS_CLIENT_PROVIDER,
          useFactory: async (options: RedisOption) => {
            const client = createClient(options.redisConnectOption);
            client.on('error', err => console.log('Redis Client Error', err));
            await client.connect();
            return client;
          },
          inject: [REDIS_MODULE_OPTIONS]
        },
        {
          provide: Logger,
          useFactory: (options: RedisOption) => {
            return options.logging
              ? new Logger('RedisService')
              : new FakeLogger();
          },
          inject: [REDIS_MODULE_OPTIONS]
        },
        RedisService
      ],
      exports: [RedisService]
    };
  }
}
