import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { NaverError } from 'src/sms/SMSError';
@Injectable()
export class SlackService {
  constructor(private readonly httpService: HttpService) {}

  async findSlackUserIdByEmail(email: string): Promise<string | null> {
    try {
      const data = await lastValueFrom(
        this.httpService
          .get('/users.lookupByEmail', {
            params: { email }
          })
          .pipe(map(response => response.data))
      );
      // Logger.log(data);

      if (data.ok !== true) {
        return null;
      }

      return data.user.id;
    } catch (error) {
      Logger.log(error.response.data);
      throw new NaverError('문자발송실패', error.response.data);
    }
  }

  async sendDMwithValidationNumber(id: string, validationNumber: string) {
    try {
      const value = await lastValueFrom(
        this.httpService
          .post('/chat.postMessage', {
            channel: id,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `어드민 인증번호`,
                  emoji: true
                }
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*인증번호:*\n${validationNumber}`
                  }
                ]
              }
            ],
            icon_emoji: ':ghost:'
          })
          .pipe(map(response => response.data))
      );
      console.log(value);
    } catch (error) {
      Logger.log(error);
    }
  }
}
