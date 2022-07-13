import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';
import { ValidationNumberDto } from './dtos/ValidationNumber.dto';
import { RedisClientProvider } from './RedisProvider.const';

@Injectable()
export class RedisService {
  constructor(
    private logger: LoggerService,
    @Inject(RedisClientProvider) private redisClient: RedisClientType
  ) {}

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
