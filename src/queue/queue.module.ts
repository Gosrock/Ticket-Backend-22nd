import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SlackModule } from 'src/slack/slack.module';
import { SlackService } from 'src/slack/slack.service';
import { QueueConsumer } from './queue.consumer';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'slackAlarmQ'
      },
      {
        name: 'naverSmsQ'
      },
    ),
  ],
  providers: [QueueService, QueueConsumer,],
  exports: [QueueService],
})
export class QueueModule {}
