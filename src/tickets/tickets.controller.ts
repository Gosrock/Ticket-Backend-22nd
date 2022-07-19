import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketService: TicketsService) {}

  //실제 사용
  // @Get()
  // getTicketsByUser(@ReqUser() user: User) {
  //   return this.ticketService.findAllByUserId(user.id);
  // }

  //테스트용
  @Get()
  getTicketsByUser() {
    return this.ticketService.findAll();
  }

  @Get('/:uuid')
  getTicketByUuid(@Param('uuid') uuid: string) {
    return this.ticketService.findByUuid(uuid);
  }

  // @Get('/createTest')
  // createTicketTest() {
  // }

  // @Delete('/deleteTest')
  // deleteTicketTest() {
  //   return this.ticketService.findAll();
  // }
}
