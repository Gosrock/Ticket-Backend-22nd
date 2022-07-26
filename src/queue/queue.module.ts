import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SlackModule } from 'src/slack/slack.module';
import { SmsModule } from 'src/sms/sms.module';

import { QueueConsumer } from './queue.consumer';
import { QueueConsumerSms } from './queue.consumer.sms';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'slackAlarmQ'
      },
      {
        name: 'naverSmsQ'
      }
    ),
    SmsModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isProd: configService.get('NODE_ENV') === 'prod' ? true : false
      }),
      inject: [ConfigService]
    }),
    SlackModule
  ],
  providers: [QueueService, QueueConsumer, QueueConsumerSms],
  exports: [QueueService]
})
export class QueueModule {}
