import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { RedisOption } from './RedisOption.interface';

export interface RedisAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Factory function that returns an instance of the provider to be injected.
   */
  useFactory: (...args: any[]) => Promise<RedisOption>;
  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject: FactoryProvider['inject'];
}
