import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as Joi from 'joi';
import { OrderStatus, TicketStatus } from 'src/common/consts/enum';
import { CustomConfigModule } from 'src/config/customConfig.module';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { ADMIN_CHANNELID, ORDER_CHANNELID } from './config/slack.const';
import { SlackService } from './slack.service';

describe('SlackService', () => {
  let service: SlackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CustomConfigModule,
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            baseURL: 'https://slack.com/api',
            headers: {
              Authorization: 'Bearer ' + configService.get('SLACK_BOT_TOKEN')
            }
          }),
          inject: [ConfigService]
        })
      ],
      providers: [
        SlackService,
        {
          provide: ADMIN_CHANNELID,
          useValue: 'C03MKF0DRRV'
        },
        {
          provide: ORDER_CHANNELID,
          useValue: 'C03MKF2JJ4X'
        }
      ]
    }).compile();

    service = module.get<SlackService>(SlackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('발생한 주문에 대해 슬랙 알림 메시지가 가야합니다.', async () => {
    const order = new Order();
    const user = new User();
    user.id = 1;
    user.name = '테스트';
    user.phoneNumber = '테스트';
    order.id = 10001;
    order.user = user;
    order.ticketCount = 3;
    order.price = 5000;

    const value = await service.newOrderAlarm(order);
    console.log(value);
    expect(value).toBeDefined();
  });

  it('관리자가 주문의 상태를 변경하면 슬랙 알림 메시지가 가야합니다.', async () => {
    const order = new Order();
    const adminUser = new User();
    adminUser.id = 1;
    adminUser.name = '테스트';
    adminUser.phoneNumber = '테스트';
    order.id = 10001;
    order.admin = adminUser;
    order.ticketCount = 3;
    order.price = 5000;
    order.status = OrderStatus.DONE;

    const value = await service.orderStateChangedByAdminEvent(order);
    console.log(value);
    expect(value).toBeDefined();
  });

  it('관리자가 티켓의 상태를 변경하면 알림이 가야합니다.', async () => {
    const ticket = new Ticket();
    const adminUser = new User();
    const orderUser = new User();
    adminUser.id = 1;
    adminUser.name = '테스트';
    adminUser.phoneNumber = '테스트';
    orderUser.id = 1;
    orderUser.name = '손님';
    orderUser.phoneNumber = '테스트';
    ticket.id = 10001;
    ticket.admin = adminUser;
    ticket.user = orderUser;
    ticket.status = TicketStatus.WAIT;

    const value = await service.ticketStateChangedByAdminEvent(ticket);
    console.log(value);
    expect(value).toBeDefined();
  });

  it('티켓 입장 알림 이벤트가 가야합니다.', async () => {
    const ticket = new Ticket();
    const adminUser = new User();
    const orderUser = new User();
    adminUser.id = 1;
    adminUser.name = '테스트';
    adminUser.phoneNumber = '테스트';
    orderUser.id = 1;
    orderUser.name = '손님';
    orderUser.phoneNumber = '테스트';
    ticket.id = 10001;
    ticket.admin = adminUser;
    ticket.user = orderUser;
    ticket.status = TicketStatus.DONE;

    const value = await service.ticketEnterEvent(ticket);
    console.log(value);
    expect(value).toBeDefined();
  });
});
