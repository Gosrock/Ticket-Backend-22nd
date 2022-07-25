import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/AccessToken.guard';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { Order } from 'src/database/entities/order.entity';
import { User } from 'src/database/entities/user.entity';
import { OrdersService } from './orders.service';
import { RequestOrderDto } from 'src/orders/dtos/request-order.dto';

@ApiTags('orders')
@ApiBearerAuth('accessToken')
@Controller('orders')
@UseGuards(AccessTokenGuard)
export class OrdersController {
	constructor(
		private orderService: OrdersService) {}

	@ApiOperation({
		summary: '주문을 생성하고, 해당 주문의 티켓을 생성한다.'
	})
	@ApiResponse({
		status: 200,
		description: '요청 성공시',
    	type: Order
	})
	@ApiUnauthorizedResponse({
		status: 401,
		description: 'AccessToken 권한이 없을 경우'
	})
	@Post('')
	createOrder(@Body() requestOrderDto: RequestOrderDto,
	@ReqUser() user: User): Promise <Order> {
		return this.orderService.createOrder(requestOrderDto, user);
	}

}

