import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards
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
import { Role } from 'src/common/consts/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { TicketEntryDateValidationDto } from 'src/tickets/dtos/ticket-entry-date-validation.dto copy';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { TicketsService } from './tickets.service';
import { TicketFindDto } from './dtos/ticket-find.dto';
import { UpdateTicketStatusDto } from './dtos/update-ticket-status.dto';
import { SuccessResponse } from 'src/common/decorators/SuccessResponse.decorator';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { NoAuth } from 'src/auth/guards/NoAuth.guard';
import { TicketCountDto } from './dtos/ticket-count.dto';
import { ErrorResponse } from 'src/common/decorators/ErrorResponse.decorator';
import { TicketEntryResponseDto } from './dtos/ticket-entry-response.dto';
import { AccessJwtPayload } from 'src/auth/auth.interface';

@ApiTags('tickets')
@ApiBearerAuth('accessToken')
@Controller('tickets')
@UseGuards(AccessTokenGuard)
export class TicketsController {
  constructor(private ticketService: TicketsService) {}

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

  @ApiOperation({
    summary: '[어드민]해당 조건의 티켓을 모두 불러온다'
  })
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: PageDto<Ticket>
  // })
  // @ApiPaginatedDto({ model: Ticket, description: '페이지네이션' })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: PageDto,
      exampleDescription: '페이지가 끝일때',
      exampleTitle: '페이지가 끝일때',
      generic: Ticket,
      overwriteValue: {
        meta: { hasNextPage: false }
      }
    },
    {
      model: PageDto,
      exampleDescription: '예시',
      exampleTitle: '예시',
      generic: Ticket
    }
  ])
  @Get('/find')
  @Roles(Role.Admin)
  getTicketsWith(
    @Query() ticketFindDto: TicketFindDto,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return this.ticketService.findAllWith(ticketFindDto, pageOptionsDto);
  }

  @ApiOperation({
    summary: '[랜딩페이지] 티켓 개수를 반환한다'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: TicketCountDto
  })
  @NoAuth()
  @Get('/count')
  async getTicketCount() {
    const count = await this.ticketService.countTicket();
    return { count: count };
  }

  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    {
      model: BadRequestException,
      exampleDescription: 'Body 파라미터 검증 오류입니다',
      exampleTitle: 'status:400 BadRequestException',
      message: '검증 오류'
    }
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    {
      model: UnauthorizedException,
      exampleDescription: '권한 없는 유저가 접근했을때 생기는 오류입니다',
      exampleTitle: 'status:401 UnauthorizedException',
      message: '잘못된 헤더 요청'
    }
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [
    {
      model: NotFoundException,
      exampleDescription: 'Ticket Id 입력 오류입니다',
      exampleTitle: 'status:404 NotFoundException',
      message: "Can't find Ticket with id {ticketId}"
    }
  ])
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
    @Body('') updateTicketStatusDto: UpdateTicketStatusDto,
    @ReqUser() user: AccessJwtPayload
  ) {
    return this.ticketService.updateTicketStatus(updateTicketStatusDto, user);
  }

  @ApiOperation({
    summary: '해당 uuid를 포함하는 자신의 티켓을 가져온다'
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
    @ReqUser() user: AccessJwtPayload
  ) {
    //console.log(user);
    return this.ticketService.findByUuid(uuid, user);
  }

  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    {
      model: BadRequestException,
      exampleDescription: '이미 입장 완료된 티켓',
      exampleTitle: 'status:400 BadRequestException DONE',
      message: '이미 입장 완료된 티켓입니다'
    },
    {
      model: BadRequestException,
      exampleDescription: '입금 기한이 만료된 티켓',
      exampleTitle: 'status:400 BadRequestException EXPIRE',
      message: '입금 기한이 만료된 티켓입니다'
    },
    {
      model: BadRequestException,
      exampleDescription: '입금 대기중인 티켓',
      exampleTitle: 'status:400 BadRequestException ORDERWAIT',
      message: '입금 대기중인 티켓입니다'
    },
    {
      model: BadRequestException,
      exampleDescription: 'Body 파라미터와 타켓 공연 날짜가 일치하지 않음',
      exampleTitle: 'status:400 BadRequestException Date',
      message: '공연 날짜가 일치하지 않습니다'
    },
    {
      model: BadRequestException,
      exampleDescription: 'Body 파라미터와 타켓 공연 날짜가 일치하지 않음',
      exampleTitle: 'status:400 BadRequestException Date',
      message: '공연 날짜가 일치하지 않습니다'
    },
    {
      model: BadRequestException,
      exampleDescription: 'Body 파라미터 검증 오류',
      exampleTitle: 'status:400 BadRequestException Validation',
      message: '검증 오류'
    }
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    {
      model: UnauthorizedException,
      exampleDescription: '엑세스 토큰이 없거나 어드민이 아닐 경우 접근 제어',
      exampleTitle: 'status:401 UnauthorizedException',
      message: '잘못된 헤더 요청'
    }
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [
    {
      model: NotFoundException,
      exampleDescription: 'Ticket uuid 입력 오류입니다',
      exampleTitle: 'status:404 NotFoundException',
      message: "Can't find Ticket with uuid {ticketId}"
    }
  ])
  @ApiOperation({
    summary: '[어드민] 티켓 QR코드 찍었을 때 uuid를 받아 소켓 이벤트를 전송한다'
  })
  @ApiBody({ type: TicketEntryDateValidationDto })
  @ApiResponse({
    status: 201,
    description: '요청 성공시',
    type: TicketEntryResponseDto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'AccessToken 어드민 권한이 없을 경우'
  })
  @Roles(Role.Admin)
  @Post('/:uuid/enter')
  postTicketEntryValidation(
    @Param('uuid') uuid: string,
    @Body('') ticketEntryDateValidationDto: TicketEntryDateValidationDto,
    @ReqUser() admin: User
  ) {
    return this.ticketService.entryValidation(
      ticketEntryDateValidationDto,
      uuid,
      admin
    );
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
  @Delete('/:uuid/delete')
  deleteTicketByUuid(@Param('uuid') ticketUuid: string) {
    return this.ticketService.deleteTicketByUuid(ticketUuid);
  }

  // /* 테스트용 라우팅 */
  // @ApiOperation({
  //   summary: '[테스트용, 삭제예정]조건없이 모든 티켓을 불러온다'
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: Ticket
  // })
  // @ApiUnauthorizedResponse({
  //   status: 401,
  //   description: 'AccessToken이 없거나 어드민이 아닐 경우'
  // })
  // @Get('all')
  // @Roles(Role.Admin)
  // getAllTickets() {
  //   return this.ticketService.findAll();
  // }

  // @ApiOperation({ summary: '[테스트용] 임시 티켓 생성' })
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: Ticket
  // })
  // @Post('/create')
  // async testCreateTicket(@ReqUser() user: User) {
  //   const createTicketDto = {
  //     date: PerformanceDate.YB,
  //     order: new Order(),
  //     user: user,
  //     createdAt: new Date(),
  //     updatedAt: new Date()
  //   };
  //   return this.ticketService.createTicket(createTicketDto);
  // }

  // @ApiOperation({ summary: '[테스트용] 티켓 모두 제거' })
  // @Delete('/deleteAll')
  // deleteAllTickets() {
  //   return this.ticketService.deleteAllTickets();
  // }
}
