import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestOrderDto } from 'src/orders/dtos/request-order.dto';
import { Order } from 'src/database/entities/order.entity';
import { User } from 'src/database/entities/user.entity';
import { OrderRepository } from 'src/database/repositories/order.repository';

@Injectable()
export class OrdersService {
	constructor(private orderRepository: OrderRepository) {}

	// 가격 책정 함수 : 단지 가독성을 위해 함수로 뺌
	getTotalPrice(requestOrderDto: RequestOrderDto): number {
		const {selection, ticketCount} = requestOrderDto;
		const pricePerTicket = 3000;   // 티켓 한 장 가격 
		const discountForBoth = 1000;  // 양일권에 대한 할인 가격

		let totalPrice = pricePerTicket * ticketCount;

		if (selection === 'BOTH') {
			// ticketCount = 양일권 개수
			totalPrice = (totalPrice * 2) - (discountForBoth * ticketCount);
		}
		return totalPrice;
	}

	/**
	 * selection과 ticketCount를 요청받아서 가격 책정 후 주문을 생성하고,
	 * 해당 주문에 포함되는 모든 티켓을 각각 생성한다.
	 * @param requestOrderDto {selection, ticketCount}
	 * @param user Request User
	 */
	async createOrder(requestOrderDto: RequestOrderDto, user: User): Promise <Order> {
		const {selection, ticketCount} = requestOrderDto;
		const totalPrice = this.getTotalPrice(requestOrderDto); // 가격 책정
		const order = await this.orderRepository.createOrder(requestOrderDto, user, totalPrice);

		for (let i = 0; i < ticketCount; i++) {
			if (selection === 'BOTH') {
				
			} else {

			}
		}

		/*
		switch(selection) {
			case 'BOTH':
				break;
			case 'YB':
				break;
			case 'OB':
				break;
			default:
				throw new BadRequestException(`${selection} 값을 확인해주세요`)
		}
		*/
		return order;
	}
}
