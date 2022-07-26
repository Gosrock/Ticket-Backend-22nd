import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestOrderDto } from "src/orders/dtos/request-order.dto";
import { Repository } from "typeorm";
import { Order } from "../entities/order.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  /**
   * 주문을 생성한다
   * @param requestOrderDto {selection, ticketCount}
   * @param user Request User
   * @param totalPrice 총 입금할 금액
   * @returns 생성된 주문
   */
  async createOrder(requestOrderDto: RequestOrderDto, user: User, totalPrice: number): Promise <Order> {
	  const {selection, ticketCount} = requestOrderDto;
	  const order = this.orderRepository.create({
		  selection,
		  ticketCount,
		  price: totalPrice,
		  user: user,
		  isFree: false
	});
	await this.orderRepository.save(order);
	return order;
  }

  /**
   * 
   * @param userId 해당 유저의 주문 목록을 가져온다
   * @returns Order배열
   */
  async findAllByUserId(userId: number): Promise <Order[]> {
	  return await this.orderRepository
	  .createQueryBuilder('order')
	  .where({ user: userId })
	  .getMany();
	  
  }


}