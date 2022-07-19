import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { SMSOption } from './sms.config.interface';

export interface SMSAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Factory function that returns an instance of the provider to be injected.
   */
  useFactory: (...args: any[]) => Promise<SMSOption>;
  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject: FactoryProvider['inject'];
}
