import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import {
  ADMIN_CHANNELID,
  BACKEND_CHANNELID,
  ORDER_CHANNELID
} from './config/slack.const';
@Injectable()
export class SlackService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(ADMIN_CHANNELID) private adminChannelId: string,
    @Inject(ORDER_CHANNELID) private orderChannelId: string,
    @Inject(BACKEND_CHANNELID) private backendChannelId: string
  ) {}

  /**
   * 슬랙에 등록된 유저의 이메일을 조회해서 해당 유저의 id(channelId)값을 알아옵니다.
   * @param email 슬랙에 등록된 유저의 이메일 값
   * @returns 등록된 유저가 없거나 찾을수 없으면 null 을 리턴합니다.
   */
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

  /**
   * 유저한테 고스락 알림봇이 인증번호를 슬랙으로 보냅니다. 개인 디엠 채널로 옵니다.
   * @param id  채널 아이디( 슬랙 유저의 고유 아이디 )
   * @param validationNumber 보낼 검증 번호
   * @returns 202 입니다 리턴값이 없습니다.
   */
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

  /**
   * 주문이 업데이트 된 이후에 주문 객체를 받습니다.
   * 관리자 채널에 해당 변경 알림을 전송합니다.
   * @param order 주문 엔티티를 받습니다.
   * @returns
   */
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

  /**
   * 새로 생성된 주문을 인자로 받습니다
   * 티켓예매 알림 채널에 알림을 전송합니다.
   * @param order 새로 생성된주문
   * @returns 리턴값이 없습니다.
   */
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

  /**
   * 변경된 정보를 가지고있는 티켓 객체를 인자로 받습니다
   * 관리자 채널에 어드민티켓 상태 변경알림을 전송합니다.
   * @param ticket 변경된 정보를 가지고있는 티켓 객체
   * @returns 리턴값이 없습니다.
   */
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

  /**
   * 입장 이벤트가 발생하면 관리자채널에 입장알림을 전송합니다.
   * @param ticket 입장처리가 된 티켓객체
   * @returns 리턴값이 없습니다.
   */
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

  /**
   * 슬랙으로 500번대 백엔드 알림을 주기위한 메소드입니다.
   * @param path url (쿼리스트링 포함 )
   * @param body 요청 바디 ( get일경우 {} 로 출력됨)
   * @param errorStack exception filter에서 정의내린 에러 스택
   * @returns 리턴값은 없습니다.
   */
  async backendInternelServerError(
    path: string,
    body: string,
    errorStack: string | undefined
  ) {
    try {
      const value = await lastValueFrom(
        this.httpService
          .post('/chat.postMessage', {
            channel: this.backendChannelId,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `백엔드 에러 로그`,
                  emoji: true
                }
              },

              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*메소드:*\n${path}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*요청바디:*\n${body}`
                  }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*에러스택:*\n' + '`' + errorStack + '`'
                }
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
