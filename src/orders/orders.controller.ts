import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/AccessToken.guard';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { Order } from 'src/database/entities/order.entity';
import { User } from 'src/database/entities/user.entity';
import { OrdersService } from './orders.service';
import { RequestOrderDto } from 'src/orders/dtos/request-order.dto';
import { Ticket } from 'src/database/entities/ticket.entity';
import { TicketsService } from 'src/tickets/tickets.service';
import { OrderIdValidationPipe } from 'src/common/pipes/orderId-validation.pipe';
import { ResponseOrderDto } from './dtos/response-order.dto';
import { ResponseOrderListDto } from './dtos/response-orderlist.dto';

@ApiTags('orders')
@ApiBearerAuth('accessToken')
@Controller('orders')
@UseGuards(AccessTokenGuard)
export class OrdersController {
  constructor(
    private orderService: OrdersService,
    private ticketService: TicketsService
  ) {}

  @ApiOperation({
    summary: '주문을 생성하고, 해당 주문의 티켓을 생성한다.'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResponseOrderDto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'AccessToken 권한이 없을 경우'
  })
  @Post('')
  createOrder(
    @Body() requestOrderDto: RequestOrderDto,
    @ReqUser() user: User
  ): Promise<ResponseOrderDto> {
    return this.orderService.createOrder(requestOrderDto, user);
  }

  @ApiOperation({
    summary: '접근한 유저의 주문 목록을 불러온다'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: [ResponseOrderListDto],
    isArray: true
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'AccessToken이 없을 경우'
  })
  @Get('')
  getUserOrderList(@ReqUser() user: User): Promise<ResponseOrderListDto[]> {
    return this.orderService.findAllByUserId(user.id);
  }

  @ApiOperation({
    summary: '해당 주문에 속한 티켓 목록을 불러온다'
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
  @Get('/:orderId')
  getTicketListByOrderId(
    @Param('orderId', OrderIdValidationPipe) orderId: number
  ): Promise<Ticket[]> {
    return this.ticketService.findAllByOrderId(orderId);
  }
}
