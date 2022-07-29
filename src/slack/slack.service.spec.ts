import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus, TicketStatus } from 'src/common/consts/enum';
import { CustomConfigModule } from 'src/config/customConfig.module';
import {
  ADMIN_CHANNELID,
  BACKEND_CHANNELID,
  ORDER_CHANNELID
} from './config/slack.const';
import {
  SlackNewOrderDto,
  SlackOrderStateChangeDto,
  SlackTicketQREnterEventDto,
  SlackTicketStateChangeDto
} from './dtos';
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
        //C03R59C216Y test channel
        {
          provide: ADMIN_CHANNELID,
          useValue: 'C03R59C216Y'
        },
        {
          provide: ORDER_CHANNELID,
          useValue: 'C03R59C216Y'
        },
        {
          provide: BACKEND_CHANNELID,
          useValue: 'C03R59C216Y'
        }
      ]
    }).compile();

    service = module.get<SlackService>(SlackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('발생한 주문에 대해 슬랙 알림 메시지가 가야합니다.', async () => {
    const value = await service.newOrderAlarm(
      new SlackNewOrderDto(1, '테스트', 1, 5000)
    );
    //console.log(value);
    expect(value).toBeDefined();
  });

  it('관리자가 주문의 상태를 변경하면 슬랙 알림 메시지가 가야합니다.', async () => {
    const value = await service.orderStateChangedByAdminEvent(
      new SlackOrderStateChangeDto(1, 2, OrderStatus.DONE, '테스트')
    );
    //console.log(value);
    expect(value).toBeDefined();
  });

  it('관리자가 티켓의 상태를 변경하면 알림이 가야합니다.', async () => {
    const value = await service.ticketStateChangedByAdminEvent(
      new SlackTicketStateChangeDto(
        1,
        '테스트',
        TicketStatus.ENTERWAIT,
        '테스트2'
      )
    );
    //console.log(value);
    expect(value).toBeDefined();
  });

  it('티켓 입장 알림 이벤트가 가야합니다.', async () => {
    const value = await service.ticketQREnterEvent(
      new SlackTicketQREnterEventDto(1, 'test', '테스트')
    );
    //console.log(value);
    expect(value).toBeDefined();
  });
});
