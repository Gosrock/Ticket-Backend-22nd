import { DynamicModule, Logger, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisOption } from './RedisOption.interface';

@Module({
  providers: [RedisService]
})
export class RedisModule {
  static forRoot(options: RedisOption): DynamicModule {
    options.
    const credentialFactory = {
      provide: FCM_ADMIN,
      useFactory: () => {
        //error can be occur in this section
        return firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(options.credentialPath)
        });
      }
    };
    const logger = options.logger ? options.logger : new Logger('FcmService');

    return {
      module: FcmModule,
      providers: [
        { provide: Logger, useValue: logger },
        FcmService,
        credentialFactory
      ],
      exports: [FcmService]
    };
  }
}
