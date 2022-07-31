import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Err } from 'joi';
import { SlackService } from 'src/slack/slack.service';

@Processor('slackAlarmQ')
export class QueueConsumer {
  constructor(private slackService: SlackService) {}

  @OnQueueFailed()
  errHandler(job: Job, err: Err) {
    //console.log('error: ' + err);
    throw err;
  }

  @Process('updateTicketStatus')
  async handleUpdateTicketStatus(job: Job) {
    const ticketStatusChangeDto = job.data;
    await this.slackService.ticketQREnterEvent(ticketStatusChangeDto);
  }

  @Process('createNewOrder')
  async handleCreateNewOrder(job: Job) {
    const newOrderDto = job.data;
    await this.slackService.newOrderAlarm(newOrderDto);
  }
}
