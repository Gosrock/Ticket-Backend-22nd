import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
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
      return value;
    } catch (error) {
      Logger.log(error);
    }
  }

  async orderStateChangedByAdminEvent(order: Order) {
    try {
      const value = await lastValueFrom(
        this.httpService
          .post('/chat.postMessage', {
            channel: this.adminChannelId,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `어드민 주문 상태 변경 알람`,
                  emoji: true
                }
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*주문 아이디:*\n${order.id}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*주문 금액:*\n${order.ticketCount}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*주문 상태:*\n${order.status}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*관리자 정보:*\n${order.admin.name}`
                  }
                ]
              }
            ]
          })
          .pipe(map(response => response.data))
      );
      return value;
    } catch (error) {
      Logger.log(error);
      // throw new Error(error);
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
                    text: `*주문 아이디:*\n${order.id}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*주문자 입금자명:*\n${order.user.name}`
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
            ]
          })
          .pipe(map(response => response.data))
      );
      return value;
    } catch (error) {
      Logger.log(error);
      // throw new Error(error);
    }
  }

  async ticketStateChangedByAdminEvent(ticket: Ticket) {
    try {
      const value = await lastValueFrom(
        this.httpService
          .post('/chat.postMessage', {
            channel: this.adminChannelId,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `어드민 티켓 상태 변경 알람`,
                  emoji: true
                }
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*티켓 아이디:*\n${ticket.id}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*티켓 주문자:*\n${ticket.user.name}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*티켓 상태:*\n${ticket.status}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*관리자:*\n${ticket.admin?.name}`
                  }
                ]
              }
            ]
          })
          .pipe(map(response => response.data))
      );
      return value;
    } catch (error) {
      Logger.log(error);
      // throw new Error(error);
    }
  }

  async ticketEnterEvent(ticket: Ticket) {
    try {
      const value = await lastValueFrom(
        this.httpService
          .post('/chat.postMessage', {
            channel: this.adminChannelId,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `티켓 입장 알람`,
                  emoji: true
                }
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*티켓 아이디:*\n${ticket.id}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*티켓 주문자:*\n${ticket.user.name}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*관리자:*\n${ticket.admin?.name}`
                  }
                ]
              }
            ]
          })
          .pipe(map(response => response.data))
      );
      return value;
    } catch (error) {
      Logger.log(error);
      // throw new Error(error);
    }
  }
}
