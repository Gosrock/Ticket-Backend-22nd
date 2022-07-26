import { HttpModule, HttpService } from '@nestjs/axios';
import { Global, Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ADMIN_CHANNELID,
  BACKEND_CHANNELID,
  ORDER_CHANNELID
} from './config/slack.const';
import { SlackService } from './slack.service';
import { SlackFakeService } from './slackFake.service';

// 에러 필터에서도 사용하기 위해 글로벌 추가
@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://slack.com/api',
        headers: {
          Authorization: 'Bearer ' + configService.get('SLACK_BOT_TOKEN')
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    {
      provide: SlackService,
      useClass: process.env.NODE_ENV === 'dev' ? SlackService : SlackService
    },
    {
      provide: ADMIN_CHANNELID,
      useFactory: (configService: ConfigService) => {
        return configService.get('SLACK_ADMIN_CHANNELID');
      },
      inject: [ConfigService]
    },
    {
      provide: ORDER_CHANNELID,
      useFactory: (configService: ConfigService) => {
        return configService.get('SLACK_ORDER_CHANNELID');
      },
      inject: [ConfigService]
    },
    {
      provide: BACKEND_CHANNELID,
      useFactory: (configService: ConfigService) => {
        return configService.get('SLACK_BACKEND_CHANNELID');
      },
      inject: [ConfigService]
    }
  ],
  exports: [
    {
      provide: SlackService,
      useClass: process.env.NODE_ENV === 'dev' ? SlackService : SlackService
    }
  ]
})
export class SlackModule {}
