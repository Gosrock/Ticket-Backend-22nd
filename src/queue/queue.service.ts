import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { create } from 'domain';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { SlackTicketStateChangeDto } from 'src/slack/dtos';

@Injectable()
export class QueueService {
    constructor(@InjectQueue('updateTicketStatusQ') private updateTicketStatusQ: Queue) {}

    async updateTicketStatusJob(ticket: Ticket, admin: User) {
        console.log("admin: " + admin.name);
        console.log(ticket);
        const job = await this.updateTicketStatusQ.add('updateTicketStatus', {
            adminName: admin.name,
            ticketId: ticket.id,
            ticketStatus: ticket.status,
            userName: ticket.user.name,
        })
    }

}
