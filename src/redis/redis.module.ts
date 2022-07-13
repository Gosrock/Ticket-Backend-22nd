import {
  DynamicModule,
  Logger,
  LoggerService,
  Module,
  Provider
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, RedisClientOptions } from 'redis';
import { FakeLogger } from './FakeLogger';
import { RedisService } from './redis.service';
import { RedisAsyncConfig } from './RedisAsyncConfig.interface';
import { RedisOption } from './RedisOption.interface';
import { REDIS_CLIENT_PROVIDER, REDIS_MODULE_OPTIONS } from './Redis.const';
import { RedisTestService } from './redisTest.service';

export type RedisClientType = ReturnType<typeof createClient>;
/**
 * 레디스 관련 모듈
 * 인증 관련 휴대전화번호 저장이나 간단한 캐시등을 사용하는 모듈
 * 2022-07-13 이찬진
 */
@Module({
  imports: [ConfigModule]
})
export class RedisModule {
  static forRootAsync(redisAsyncConfig: RedisAsyncConfig): DynamicModule {
    return {
      module: RedisModule,
      imports: redisAsyncConfig.imports,
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

// export const getHttpClientModuleOptions = (
//   options: RedisAsyncConfig
// ): RedisService => new RedisService(options);
// const provider: Provider = {
//   inject: [REDIS_MODULE_OPTIONS],
//   provide: RedisClientProvider,
//   useFactory: async (options: RedisAsyncConfig) => {
//     new RedisService(options);
//   }
// };

// return {
//   module: RedisModule,
//   imports: redisAsyncConfig.imports,
//   providers: [provider],
//   exports: [provider]
// };

// const redisOption = await redisAsyncConfig.useFactory.call();
// return {
//   module: RedisModule,
//   imports: redisAsyncConfig.imports,

//   providers: [
//     ConfigService,
//     // 옵션에 로깅설정이 켜져있으면 logging 킴
//     // 꺼져있으면 끔
//     {
//       provide: Logger,
// useValue: redisOption.logging
//   ? new Logger('RedisService')
//   : new FakeLogger()
//     },
//     {
//       provide: RedisService,
//       useValue: redisOption.isTest ? RedisTestService : RedisService
//     },
//     {
//       provide: RedisClientProvider,
//       useFactory: async (configService: ConfigService) => {
//         const test = await redisAsyncConfig.useFactory(configService);
//         console.log('testset', test.redisConnectOption.url);
//       }
//     }
//   ],
//   exports: [RedisService]
// };
