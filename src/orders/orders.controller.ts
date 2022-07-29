import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { PageDto } from 'src/common/dtos/page/page.dto';
import { ApiPaginatedDto } from 'src/common/decorators/ApiPaginatedDto.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/consts/enum';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { OrderFindDto } from './dtos/order-find.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

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
    type: ResponseOrderListDto,
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
    summary: '[어드민] 해당 조건의 주문을 모두 불러온다'
  })
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: PageDto
  // })
  @ApiPaginatedDto({ model: Order, description: '페이지네이션' })
  @Get('/find')
  @Roles(Role.Admin)
  getOrdersWith(
    @Query() orderFindDto: OrderFindDto,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Order>> {
    return this.orderService.findAllWith(orderFindDto, pageOptionsDto);
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

  @ApiOperation({
    summary: '[어드민] 해당 주문의 status를 변경한다'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Order
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '어드민이 아닐 경우'
  })
  @Roles(Role.Admin)
  @Patch('/status')
  updateOrderStatus(
    @Body(OrderIdValidationPipe) updateOrderStatusDto: UpdateOrderStatusDto,
    @ReqUser() admin: User
  ) {
    console.log(typeof updateOrderStatusDto);
    return this.orderService.updateOrderStatus(updateOrderStatusDto, admin);
  }

  @ApiOperation({
    summary: '[어드민] 해당 주문을 공짜로 변경한다'
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Order
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '어드민이 아닐 경우'
  })
  @Roles(Role.Admin)
  @Patch('/free/:orderId')
  makeOrderFree(
    @Param('orderId', OrderIdValidationPipe) orderId: number
  ): Promise<Order> {
    return this.orderService.makeOrderFree(orderId);
  }
}
