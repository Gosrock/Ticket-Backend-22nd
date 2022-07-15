import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
  providers: [SlackService],
  exports: [SlackService]
})
export class SlackModule {}
