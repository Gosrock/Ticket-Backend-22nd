import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PerformanceDate, Role } from 'src/common/consts/enum';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { CreateTicketDto } from 'src/common/dtos/create-ticket.dto';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
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

  @Get('/test')
  testUserProfileDto() {
    // userprofiledto
    //
    const user = {
      id: 1,
      name: '노경민',
      phoneNumber: '01012345678',
      role: Role.User,
      order: [],
      ticket: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const dto = UserProfileDto.convertFrom(user);

    console.log(dto);
    // return dto;

    const createTicketDto = {
      date: PerformanceDate.YB,
      order: new Order(),
      user: dto,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.ticketService.createTicket(createTicketDto);
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
