import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Query,
  UnauthorizedException,
  UseGuards,
  UseInterceptors
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
import { PerformanceDate, Role, TicketStatus } from 'src/common/consts/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PagingDto } from 'src/common/dtos/paging.dto';
import { TicketFindDto } from 'src/common/dtos/ticket-find.dto';
import { UpdateTicketStatusDto } from 'src/common/dtos/update-ticket-status.dto';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';
import { PerformanceDateValidationPipe } from 'src/common/pipes/performance-date-validation.pipe';
import { TicketStatusValidationPipe } from 'src/common/pipes/ticket-status-validation.pipe';
import { TicketUuidValidationPipe } from 'src/common/pipes/ticket-uuid-validation.pipe';
import { Order } from 'src/database/entities/order.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@ApiBearerAuth('accessToken')
@Controller('tickets')
//@UseGuards(AccessTokenGuard)
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
    summary: '[어드민]모든 티켓을 불러온다'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @ApiUnauthorizedResponse({
    status: 400,
    description: 'AccessToken이 없거나 어드민이 아닐 경우'
  })
  @Get('')
  //@Roles(Role.Admin)
  getAllTickets() {
    return this.ticketService.findAll();
  }

  @ApiOperation({
    summary: '[어드민]해당 조건의 티켓을 모두 불러온다, querystring으로 전달'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
  })
  @Get('/find')
  @Roles(Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor) //json 직렬화
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
  @Get('/create/:userId')
  async testCreateTicket(@Param('userId') userId: number) {
    const user = (await this.usersService.findUserById(userId)) as User;

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
    type: User
  })
  @Get('/:uuid')
  getTicketByUuid(
    @Param('uuid', TicketUuidValidationPipe)
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
  @Roles(Role.Admin)
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

  @ApiOperation({ summary: '[어드민] 해당 id의 티켓을 제거한다' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Ticket
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
