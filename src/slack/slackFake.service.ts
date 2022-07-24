import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { ADMIN_CHANNELID, ORDER_CHANNELID } from './config/slack.const';
import {
  SlackNewOrderDto,
  SlackOrderStateChangeDto,
  SlackTicketQREnterEventDto,
  SlackTicketStateChangeDto,
  SlackValidationNumberDMDto
} from './dtos';

@Injectable()
export class SlackFakeService {
  constructor() {}

  async findSlackUserIdByEmail(email: string) {}

  async sendDMwithValidationNumber(
    slackValidationNumberDMDto: SlackValidationNumberDMDto
  ) {}

  async orderStateChangedByAdminEvent(
    slackOrderStateChangeDto: SlackOrderStateChangeDto
  ) {}

  async newOrderAlarm(slackNewOrderDto: SlackNewOrderDto) {}

  async ticketStateChangedByAdminEvent(
    slackTicketStateChangeDto: SlackTicketStateChangeDto
  ) {}

  async ticketQREnterEvent(
    slackTicketQREnterEventDto: SlackTicketQREnterEventDto
  ) {}

  async backendInternelServerError(
    path: string,
    body: string,
    errorStack: string | undefined
  ) {}
}
