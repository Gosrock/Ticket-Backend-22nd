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

  async findSlackUserIdByEmail(email: string) {
    Logger.log(
      'findSlackUserIdByEmail' + JSON.stringify(email),
      'SlackFakeService'
    );
  }

  async sendDMwithValidationNumber(
    slackValidationNumberDMDto: SlackValidationNumberDMDto
  ) {
    Logger.log(
      'sendDMwithValidationNumber' + JSON.stringify(slackValidationNumberDMDto),
      'SlackFakeService'
    );
  }

  async orderStateChangedByAdminEvent(
    slackOrderStateChangeDto: SlackOrderStateChangeDto
  ) {
    Logger.log(
      'orderStateChangedByAdminEvent' +
        JSON.stringify(slackOrderStateChangeDto),
      'SlackFakeService'
    );
  }

  async newOrderAlarm(slackNewOrderDto: SlackNewOrderDto) {
    Logger.log(
      'newOrderAlarm' + JSON.stringify(slackNewOrderDto),
      'SlackFakeService'
    );
  }

  async ticketStateChangedByAdminEvent(
    slackTicketStateChangeDto: SlackTicketStateChangeDto
  ) {
    Logger.log(
      'ticketStateChangedByAdminEvent' +
        JSON.stringify(slackTicketStateChangeDto),
      'SlackFakeService'
    );
  }

  async ticketQREnterEvent(
    slackTicketQREnterEventDto: SlackTicketQREnterEventDto
  ) {
    Logger.log(
      'ticketQREnterEvent' + JSON.stringify(slackTicketQREnterEventDto),
      'SlackFakeService'
    );
  }

  async backendInternelServerError(
    path: string,
    body: string,
    errorStack: string | undefined
  ) {
    Logger.log(
      'backendInternelServerError' +
        JSON.stringify(path) +
        JSON.stringify(body) +
        JSON.stringify(errorStack),
      'SlackFakeService'
    );
  }
}
