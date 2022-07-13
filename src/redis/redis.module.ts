import { DynamicModule, Logger, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { FakeLogger } from './FakeLogger';
import { RedisService } from './redis.service';
import { RedisAsyncConfig } from './RedisAsyncConfig.interface';
import { RedisOption } from './RedisOption.interface';
import { RedisClientProvider } from './RedisProvider.const';
import { RedisTestService } from './redisTest.service';

export type RedisClientType = ReturnType<typeof createClient>;
/**
 * 레디스 관련 모듈
 * 인증 관련 휴대전화번호 저장이나 간단한 캐시등을 사용하는 모듈
 * 2022-07-13 이찬진
 */
@Module({
  providers: [RedisService]
})
export class RedisModule {
  static async forRootAsync(
    redisAsyncConfig: RedisAsyncConfig
  ): Promise<DynamicModule> {
    const redisOption: RedisOption = await redisAsyncConfig.useFactory();
    const redisConnectFactory = {
      provide: RedisClientProvider,
      useFactory: async (): Promise<RedisClientType> => {
        //error can be occur in this section

        return createClient(redisOption.redisConnectOption);
      }
    };
    return {
      module: RedisModule,
      providers: [
        // 옵션에 로깅설정이 켜져있으면 logging 킴
        // 꺼져있으면 끔
        {
          provide: Logger,
          useValue: redisOption.logging
            ? new Logger('RedisService')
            : new FakeLogger()
        },
        {
          provide: RedisService,
          useValue: redisOption.isTest ? RedisTestService : RedisService
        },
        redisConnectFactory
      ],
      exports: [RedisService]
    };
  }
}
