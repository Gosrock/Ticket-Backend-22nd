import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SMSOption } from './sms.config.interface';
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
}
