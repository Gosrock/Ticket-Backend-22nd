import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/AccessToken.guard';
import { PerformanceDate, Role } from 'src/common/consts/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiPaginatedDto } from 'src/common/decorators/test.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { TicketFindDto } from 'src/common/dtos/ticket-find.dto';
import { UpdateTicketStatusDto } from 'src/common/dtos/update-ticket-status.dto';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@ApiBearerAuth('accessToken')
@Controller('tickets')
@UseGuards(AccessTokenGuard)
export class TicketsController {
  constructor(
    private ticketService: TicketsService,
    private usersService: UsersService //삭제예정
  ) {}

  //실제 사용
  // @Get()
  // getTicketsByUser(@ReqUser() user: User) {
  //   return this.ticketService.findAllByUserId(user.id);
  // }

  @ApiOperation({
    summary: '해당 유저의 모든 티켓을 불러온다'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket,
    isArray: true
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'AccessToken이 없을 경우'
  })
  @Get('')
  getAllTicketsById(@ReqUser() user: User) {
    return this.ticketService.findAllByUserId(user.id);
  }

  /* 테스트용 라우팅 */
  @ApiOperation({
    summary: '[테스트용, 삭제예정]조건없이 모든 티켓을 불러온다'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'AccessToken이 없거나 어드민이 아닐 경우'
  })
  @Get('all')
  @Roles(Role.Admin)
  getAllTickets() {
    return this.ticketService.findAll();
  }

  @ApiOperation({
    summary: '[어드민]해당 조건의 티켓을 모두 불러온다, querystring으로 전달'
  })
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: PageDto<Ticket>
  // })
  @ApiPaginatedDto({ model: Ticket, description: '페이지네이션' })
  @Get('/find')
  @Roles(Role.Admin)
  getTicketsWith(
    @Query() ticketFindDto: TicketFindDto,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return this.ticketService.findAllWith(ticketFindDto, pageOptionsDto);
  }

  @ApiOperation({ summary: '임시 티켓 생성 (db 저장 테스트용)' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @Get('/create')
  async testCreateTicket(@ReqUser() user: User) {
    const createTicketDto = {
      date: PerformanceDate.YB,
      order: new Order(),
      user: user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.ticketService.createTicket(createTicketDto);
  }

  @ApiOperation({
    summary: '해당 uuid를 포함하는 티켓을 가져온다, req.user 필요'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'AccessToken 권한이 없을 경우'
  })
  @Get('/:uuid')
  getTicketByUuid(
    @Param('uuid')
    uuid: string,
    @ReqUser() user: User
  ) {
    console.log(user);
    return this.ticketService.findByUuid(uuid, user);
  }

  // @Get('/createTest')
  // createTicketTest() {
  // }

  @ApiOperation({ summary: '[어드민] 티켓 하나의 status를 변경한다' })
  @ApiBody({ type: UpdateTicketStatusDto })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '어드민이 아닐 경우'
  })
  @Roles(Role.Admin)
  @Patch('/status')
  updateTicketStatus(
    @Body('') updateTicketStatusDto: UpdateTicketStatusDto,
    @ReqUser() user: User
  ) {
    return this.ticketService.updateTicketStatus(updateTicketStatusDto, user);
  }

  @ApiOperation({ summary: '[어드민] 해당 id의 티켓을 제거한다' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '어드민이 아닐 경우'
  })
  @Roles(Role.Admin)
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
