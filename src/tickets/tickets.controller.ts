import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PerformanceDate, Role, TicketStatus } from 'src/common/consts/enum';
import { FindTicketDto } from 'src/common/dtos/find-ticket.dto';
import { UpdateTicketStatusDto } from 'src/common/dtos/update-ticket-status.dto';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';
import { PerformanceDateValidationPipe } from 'src/common/pipes/performance-date-validation.pipe';
import { TicketStatusValidationPipe } from 'src/common/pipes/ticket-status-validation.pipe';
import { TicketUuidValidationPipe } from 'src/common/pipes/ticket-uuid-validation.pipe';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
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
  getAllTickets() {
    return this.ticketService.findAll();
  }

  @ApiOperation({
    summary: '해당 조건의 티켓을 모두 불러온다, querystring으로 전달'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @Get('/find')
  getTicketsWith(@Query() findTicketDto: FindTicketDto) {
    console.log(findTicketDto);
    //어드민 전용 가드 필요
    return this.ticketService.findAllWith(findTicketDto);
  }

  @ApiOperation({ summary: '임시 티켓 생성 (db 저장 테스트용)' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @Get('/create')
  testCreateTicket() {
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

    // const order = {
    //   id: 10050,
    //   selection: OrderDate.YB,
    //   ticketCount: 1,
    //   status: OrderStatus.DONE,
    //   price: 5000,
    //   isFree: false,
    //   user,
    //   admin: user,
    //   ticket: [],
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // };
    const dto = new UserProfileDto(user);

    const createTicketDto = {
      date: PerformanceDate.YB,
      order: new Order(),
      user: user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.ticketService.createTicket(createTicketDto);
  }

  @ApiOperation({ summary: '해당 uuid를 포함하는 티켓을 가져온다' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Get('/:uuid')
  getTicketByUuid(
    @Param('uuid', TicketUuidValidationPipe)
    uuid: string
  ) {
    return this.ticketService.findByUuid(uuid);
  }

  // @Get('/createTest')
  // createTicketTest() {
  // }

  @ApiOperation({ summary: '티켓 하나의 status를 변경한다' })
  @ApiBody({ type: UpdateTicketStatusDto })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @Patch('/status')
  updateTicketStatus(
    @Body('', TicketStatusValidationPipe)
    updateTicketStatusDto: UpdateTicketStatusDto
  ) {
    const user = {
      id: 1,
      name: '노경민',
      phoneNumber: '01012345678',
      role: Role.Admin,
      order: [],
      ticket: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    //테스트용

    return this.ticketService.updateTicketStatus(updateTicketStatusDto, user);
  }

  @ApiOperation({ summary: '해당 id의 티켓을 제거한다' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @Delete('/delete/:uuid')
  deleteTicketByUuid(@Param('uuid') ticketUuid: string) {
    return this.ticketService.deleteTicketByUuid(ticketUuid);
  }

  @ApiOperation({ summary: '티켓 모두 제거 (테스트용)' })
  @Delete('/deleteAll')
  deleteAllTickets() {
    return this.ticketService.deleteAllTickets();
  }
}
