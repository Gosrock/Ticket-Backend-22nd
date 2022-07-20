import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SMSOption } from './config/sms.config.interface';
import { SMS_MODULE_OPTIONS } from './config/SMS.const';
import { SMSAsyncConfig } from './config/SMSAsyncConfig.interface';

import { SmsService } from './sms.service';
import { SmsFakeService } from './smsFake.service';

@Module({})
export class SmsModule {
  /**
   * 문자인증모듈의 forRoot 함수를 통해 실 문자 보낼지를 정할 수있습니다.
   * @param smsOption 실제로 문자를 보낼지 안보낼지에 true false 로 껏다킵니다. 개발환경과,테스팅환경은 초기 확인 이후 꺼놓아주시길 바랍니다.
   * @returns
   */
  static forRoot(smsOption: SMSOption): DynamicModule {
    return {
      module: SmsModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            baseURL: 'https://sens.apigw.ntruss.com/sms/v2/services/',
            headers: {
              'Content-type': 'application/json; charset=utf-8',
              'x-ncp-iam-access-key': '' + configService.get('NAVER_ACCESS_KEY')
            }
          }),
          inject: [ConfigService]
        })
      ],
      providers: [
        {
          provide: SmsService,
          useClass: smsOption.isProd ? SmsService : SmsFakeService
        }
      ],
      exports: [SmsService]
    };
  }

  /**
   * configService 주입을 통해서 문자 모듈을 임포트 시킬 수있습니다.
   * SMSoption 을 설정해 주시면 됩니다.
   * @param smsAsyncConfig
   * @returns
   */
  static forRootAsync(smsAsyncConfig: SMSAsyncConfig): DynamicModule {
    return {
      module: SmsModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            baseURL: 'https://sens.apigw.ntruss.com/sms/v2/services/',
            headers: {
              'Content-type': 'application/json; charset=utf-8',
              'x-ncp-iam-access-key': '' + configService.get('NAVER_ACCESS_KEY')
            }
          }),
          inject: [ConfigService]
        })
      ],
      providers: [
        {
          provide: SMS_MODULE_OPTIONS,
          useFactory: smsAsyncConfig.useFactory,
          inject: smsAsyncConfig.inject || []
        },
        {
          provide: SmsService,
          useFactory: async (
            options: SMSOption,
            configService: ConfigService,
            httpService: HttpService
          ) => {
            return options.isProd
              ? new SmsService(configService, httpService)
              : new SmsFakeService();
          },
          inject: [SMS_MODULE_OPTIONS, ConfigService, HttpService]
        }
      ],
      exports: [SmsService]
    };
  }
}
