import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MessageDto } from './dtos/message.dto';

@Injectable()
export class SmsFakeService {
  /**
   * fake 서비스의 메시지보내는 모듈 아무일도 안한다.
   * @param messages
   * @returns
   */
  async sendMessages(messages: MessageDto[]) {
    Logger.log(
      '가짜 문자메시지 전송' + JSON.stringify(messages),
      'SmsFakeService'
    );
    return;
  }
}
