import { Expose } from 'class-transformer';

/**
 * 주문이 생성되면 알림을 보내기 위한 함수의 DTO
 */
export class SlackNewOrderDto {
  /**
   * 생성자
   * @param orderId  order.id
   * @param userName  order.user.name
   * @param orderTicketCount order.TicketCount
   * @param orderPrice order.price
   */
  constructor(
    orderId: number,
    userName: string,
    orderTicketCount: number,
    orderPrice: number
  ) {
    this.orderId = orderId;
    this.userName = userName;
    this.orderTicketCount = orderTicketCount;
    this.orderPrice = orderPrice;
  }

  /**
   * 주문 아이디
   */
  @Expose()
  orderId: number;

  /**
   * 주문자명
   */
  @Expose()
  userName: string;

  /**
   * 티켓의 수량
   */
  @Expose()
  orderTicketCount: number;

  /**
   * 주문 가격
   */
  @Expose()
  orderPrice: number;
}
