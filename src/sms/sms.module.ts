import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmsService } from './sms.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://sens.apigw.ntruss.com/sms/v2/services',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          'x-ncp-iam-access-key': '' + configService.get('NAVER_ACCESS_KEY')
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [SmsService],
  exports: [SmsService]
})
export class SmsModule {}
