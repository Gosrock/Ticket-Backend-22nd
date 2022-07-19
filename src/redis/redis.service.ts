import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';
import { ValidationNumberDto } from './dtos/ValidationNumber.dto';
import { REDIS_CLIENT_PROVIDER } from './config/Redis.const';

@Injectable()
export class RedisService {
  constructor(
    // private logger: LoggerService,
    @Inject(Logger) private logger: LoggerService,
    @Inject(REDIS_CLIENT_PROVIDER) private redisClient: RedisClientType
  ) {
    console.log(redisClient);
  }

  async setWithTTLValidationNumber(
    key: string,
    validationNumber: string,
    ttlSecond: number
  ) {
    await this.redisClient.set(key, validationNumber, {
      EX: ttlSecond
    });
    this.logger.log(`set ${key} to ${validationNumber} TTL is ${ttlSecond}`);
  }

  async getByKeyValidationNumber(key: string): Promise<string | null> {
    this.logger.log(`get ${key}`);
    const validationNumber = await this.redisClient.get(key);
    return validationNumber;
  }
}
