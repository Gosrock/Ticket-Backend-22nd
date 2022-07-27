import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { MessageDto } from './dtos/message.dto';
import { SendSMSDto } from './dtos/sendSMS.dto';
import * as CryptoJS from 'crypto-js';
import { NaverError } from './SMSError';
@Injectable()
export class SmsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  /**
   * 문자를 보내기위한 함수입니다.
   * @param messages  MessageDto[]를 인자로 받습니다. 단건 메시지인경우 [MessageDto] 로 보내시면됩니다.
   * @returns 리턴값이 없습니다.
   */
  async sendMessages(messages: MessageDto[]): Promise<void> {
    const serviceId = this.configService.get('NAVER_SERVICE_ID');
    const caller = this.configService.get('NAVER_CALLER');
    const sendSmsDto = new SendSMSDto(caller, messages);
    const date = Date.now().toString();
    const signature = this.makeSignature(serviceId, 'POST', date);

    Logger.log('실제 문자메시지 전송' + JSON.stringify(messages), 'SmsService');
    try {
      const data = await lastValueFrom(
        this.httpService
          .post(`/${serviceId}/messages`, sendSmsDto, {
            headers: {
              'x-ncp-apigw-signature-v2': signature, //401
              'x-ncp-apigw-timestamp': date //401
            }
          })
          .pipe(map(response => response.data))
      );
    } catch (error) {
      Logger.log(error.response.data);
      throw new NaverError('문자발송실패', error.response.data);
    }
  }

  private makeSignature(
    serviceId: string,
    method: string,
    date: string
  ): string {
    const secretKey = this.configService.get('NAVER_SECRET_KEY'); // Secret Key
    const accessKey = this.configService.get('NAVER_ACCESS_KEY'); //Access Key
    const space = ' ';
    const newLine = '\n';
    const url = `/sms/v2/services/${serviceId}/messages`;
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    return signature;
  }
}
