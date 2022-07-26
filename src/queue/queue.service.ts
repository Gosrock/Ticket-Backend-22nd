import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { OrderDate, PerformanceDate } from 'src/common/consts/enum';
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
    console.log('admin: ' + admin.name);
    console.log(ticket);
    const job = await this.slackAlarmQ.add('updateTicketStatus', {
      adminName: admin.name,
      ticketId: ticket.id,
      userName: ticket.user.name
    });
    return job;
  }

  async createNewOrderJob(order: Order) {
    console.log('order: ' + order.id);
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
    let obIdx = 1;
    let ybIdx = 1;
    const totalTicketCnt = order.selection == OrderDate.BOTH ? order.ticketCount/2 : order.ticketCount
    const messageDtoList = ticketList.map(ticket => {
      switch (ticket.date) {
        case PerformanceDate.OB:
          return {
            to: order.user.phoneNumber,
            content: `[${ticket.date}] 고티켓 (${obIdx++}/${totalTicketCnt}) \n\n ${url}${ticket.uuid}`
          };
        case PerformanceDate.YB:
          return {
            to: order.user.phoneNumber,
            content: `[${ticket.date}] 고티켓 (${ybIdx++}/${totalTicketCnt}) \n\n ${url}${ticket.uuid}`
          };
      }
    });
    this.naverSmsQ.add('sendNaverSmsForOrder', messageDtoList);
  }
}
