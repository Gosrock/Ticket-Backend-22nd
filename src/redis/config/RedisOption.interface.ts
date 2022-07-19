import { RedisClientOptions } from 'redis';

/**
 * 레디스 모듈을 import 할때 설정하는 옵션들
 * 2022-07-13 이찬진
 */
export interface RedisOption {
  // 실제 레디스에 연결하지 않고 테스트를 원하면
  isTest: boolean;
  // 로깅을 원하면 true로
  logging: boolean;

  redisConnectOption: RedisClientOptions;
}
