import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { ADMIN_CHANNELID, ORDER_CHANNELID } from './config/slack.const';
@Injectable()
export class SlackFakeService {
  constructor() {}

  async findSlackUserIdByEmail(email: string) {}

  async sendDMwithValidationNumber(id: string, validationNumber: string) {}

  async orderStateChangedByAdminEvent(order: Order) {}

  async newOrderAlarm(order: Order) {}

  async ticketStateChangedByAdminEvent(ticket: Ticket) {}

  async ticketQREnterEvent(ticket: Ticket) {}

  async backendInternelServerError(
    path: string,
    body: string,
    errorStack: string | undefined
  ) {}
}
