import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { OrderDate, PerformanceDate, EnterDate } from 'src/common/consts/enum';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('slackAlarmQ') private slackAlarmQ: Queue,
    @InjectQueue('naverSmsQ') private naverSmsQ: Queue
  ) {}

  async updateTicketStatusJob(ticket: Ticket, admin: User) {
    //console.log('admin: ' + admin.name);
    //console.log(ticket);
    const job = await this.slackAlarmQ.add('updateTicketStatus', {
      adminName: admin.name,
      ticketId: ticket.id,
      userName: ticket.user.name
    });
    return job;
  }

  async createNewOrderJob(order: Order) {
    //console.log('order: ' + order.id);
    const job = await this.slackAlarmQ.add('createNewOrder', {
      orderId: order.id,
      userName: order.user.name,
      orderTicketCount: order.ticketCount,
      orderPrice: order.price
    });
    return job;
  }

  async sendNaverSmsForOrderJob(order: Order, ticketList: Ticket[]) {
    const url = 'https://gosrock.band/tickets/';
    const totalTicketCnt =
      order.selection == OrderDate.BOTH
        ? order.ticketCount / 2
        : order.ticketCount;
    const messageDtoYBList = ticketList
      .filter(ticket => ticket.date == PerformanceDate.YB)
      .map((ticket, idx) => {
        return {
          to: order.user.phoneNumber,
          content: `♬고티켓♬ (${++idx}/${totalTicketCnt})\n\n▶주문자명: ${
            order.user.name
          }\n▶관람일: ${EnterDate.YB}(${PerformanceDate.YB})\n\n${url}${
            ticket.uuid
          }`
        };
      });
    if (messageDtoYBList.length) {
      await this.naverSmsQ.add('sendNaverSmsForOrder', messageDtoYBList);
    }
    const messageDtoOBList = ticketList
      .filter(ticket => ticket.date == PerformanceDate.OB)
      .map((ticket, idx) => {
        return {
          to: order.user.phoneNumber,
          content: `♬고티켓♬ (${++idx}/${totalTicketCnt})\n\n▶주문자명: ${
            order.user.name
          }\n▶관람일: ${EnterDate.OB}(${PerformanceDate.OB})\n\n${url}${
            ticket.uuid
          }`
        };
      });
    if (messageDtoOBList.length) {
      await this.naverSmsQ.add('sendNaverSmsForOrder', messageDtoOBList);
    }
  }
}
