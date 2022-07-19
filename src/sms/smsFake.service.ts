import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageDto } from './dtos/message.dto';

@Injectable()
export class SmsFakeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  /**
   * fake 서비스의 메시지보내는 모듈 아무일도 안한다.
   * @param messages
   * @returns
   */
  async sendMessages(messages: MessageDto[]) {
    return;
  }
}
