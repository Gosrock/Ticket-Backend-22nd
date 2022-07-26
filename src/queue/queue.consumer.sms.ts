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
    console.log(`error: ` + err);
    throw err;
  }

  @Process('sendNaverSmsForOrder')
  async handleSmsForOrder(job: Job) {
    const data = job.data;
    const messageDtoList = plainToInstance(MessageDto, data as MessageDto[]);
    await this.smsService.sendMessages(messageDtoList);
  }
}
