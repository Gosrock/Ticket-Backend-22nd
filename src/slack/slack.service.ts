import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { Order } from 'src/database/entities/order.entity';
import { ADMIN_CHANNELID, ORDER_CHANNELID } from './config/slack.const';
@Injectable()
export class SlackService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(ADMIN_CHANNELID) private adminChannelId: string,
    @Inject(ORDER_CHANNELID) private orderChannelId: string
  ) {}

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
      Logger.log(error);
      return null;
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

  async newOrderAlarm(order: Order) {
    try {
      const value = await lastValueFrom(
        this.httpService
          .post('/chat.postMessage', {
            channel: this.orderChannelId,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `새 주문 알람`,
                  emoji: true
                }
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*주문자 정보:*\n${order.user.phoneNumber}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*주문매수:*\n${order.ticketCount}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*주문금액:*\n${order.price}`
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
