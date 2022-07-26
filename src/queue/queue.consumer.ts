import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import Bull, { Job } from "bull";
import { SlackTicketStateChangeDto } from "src/slack/dtos";
import { SlackService } from "src/slack/slack.service";

@Processor('updateTicketStatusQ')
export class QueueConsumer {
    constructor(private slackService: SlackService) {}

    @Process('updateTicketStatus')
    async handleUpdateTicketStatus(job: Job) {
        const ticketStatusChangeDto = job.data;
        console.log(job.data);
        console.log("slackService:" + this.slackService.ticketStateChangedByAdminEvent)
        await this.slackService.ticketStateChangedByAdminEvent(ticketStatusChangeDto);
    }

    // @OnQueueActive()
    // onActive(job: Job) {
    //     const ticketStatusChangeDto: SlackTicketStateChangeDto = job.data;
    //     console.log("통과");
    //     const result = this.slackService.ticketStateChangedByAdminEvent(ticketStatusChangeDto);
    // }
}