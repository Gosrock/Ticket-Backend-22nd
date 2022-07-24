import { Expose } from 'class-transformer';
import { OrderStatus } from 'src/common/consts/enum';

/**
 * 주문 상태가 변경되면 슬랙으로 로그를 남기기 위한 함수의 dto
 */
export class SlackOrderStateChangeDto {
  /**
   * 주문 상태가 변경되면 슬랙으로 로그를 남기기 위해서 만들었습니다.
   * @param orderId
   * @param orderTicketCount
   * @param orderStatus
   * @param adminName
   */
  constructor(
    orderId: number,
    orderTicketCount: string,
    orderStatus: OrderStatus,
    adminName: string
  ) {
    this.orderId = orderId;
    this.orderTicketCount = orderTicketCount;
    this.orderStatus = orderStatus;
    this.adminName = adminName;
  }

  /**
   * 주문 아이디
   */
  @Expose()
  orderId: number;

  /**
   * 티켓의 수량
   */
  @Expose()
  orderTicketCount: string;

  /**
   * 주문 상태
   */
  @Expose()
  orderStatus: OrderStatus;

  /**
   * 관리자 이름
   */
  @Expose()
  adminName: string;
}
