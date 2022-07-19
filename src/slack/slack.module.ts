import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ADMIN_CHANNELID, ORDER_CHANNELID } from './config/slack.const';
import { SlackService } from './slack.service';

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
    SlackService,
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
    }
  ],
  exports: [SlackService]
})
export class SlackModule {}
