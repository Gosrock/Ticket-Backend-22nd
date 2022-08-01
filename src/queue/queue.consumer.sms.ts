import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { plainToInstance } from 'class-transformer';
import { Err } from 'joi';
import { MessageDto } from 'src/sms/dtos/message.dto';
import { SmsService } from 'src/sms/sms.service';

@Processor('naverSmsQ')
export class QueueConsumerSms {
  constructor(private smsService: SmsService) {}

  @OnQueueFailed()
  errHandler(job: Job, err: Err) {
    //console.log(`error: ` + err);
    throw err;
  }

  @Process('sendNaverSmsForOrder')
  async handleSmsForOrder(job: Job) {
    const data = job.data;
    const messageDtoList = plainToInstance(MessageDto, data as MessageDto[]);
    for (const messageDto of messageDtoList) {
      await this.smsService.sendMessages([messageDto]);
      await sleep(2000);
    }
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
