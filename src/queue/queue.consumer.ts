import { OnQueueActive, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import Bull, { Job } from "bull";
import e from "express";
import { Err } from "joi";
import { SlackTicketStateChangeDto } from "src/slack/dtos";
import { SlackService } from "src/slack/slack.service";

@Processor('slackAlarmQ')
export class QueueConsumer {
    constructor(private slackService: SlackService) {}

    @OnQueueFailed()
    errHandler(job: Job, err: Err) {
        console.log("error: " + err);
        throw err;
    }

    @Process('updateTicketStatus')
    async handleUpdateTicketStatus(job: Job) {
        const ticketStatusChangeDto = job.data;
        await this.slackService.ticketQREnterEvent(ticketStatusChangeDto);
    }
}