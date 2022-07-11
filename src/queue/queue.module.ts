import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'test'
      },
      {
        name: 'test2'
      }
    )
  ],
  providers: [QueueService]
})
export class QueueModule {}
