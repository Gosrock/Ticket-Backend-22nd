import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import Bull, { Job } from "bull";
import { SlackTicketStateChangeDto } from "src/slack/dtos";
import { SlackService } from "src/slack/slack.service";

@Processor('slackAlarmQ')
export class QueueConsumer {
    constructor(private slackService: SlackService) {}

    @Process('updateTicketStatus')
    async handleUpdateTicketStatus(job: Job) {
        const ticketStatusChangeDto = job.data;
        await this.slackService.ticketQREnterEvent(ticketStatusChangeDto);
    }
}