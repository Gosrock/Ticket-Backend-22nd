import { Expose } from 'class-transformer';

/**
 * 티켓의 상태가 변경되면 알림을 주기위한 함수의 DTO
 */
export class SlackTicketQREnterEventDto {
  /**
   * 생성자
   * @param ticketId  ticket.id
   * @param userName  ticket.user.name
   * @param adminName ticket.admin?.name
   */
  constructor(ticketId: number, userName: string, adminName: string | null) {
    this.ticketId = ticketId;
    this.userName = userName;
    this.adminName = adminName;
  }

  /**
   * 티켓 아이디
   */
  @Expose()
  ticketId: number;

  /**
   * 티켓 주문자 명
   */
  @Expose()
  userName: string;

  /**
   * 관리자 명
   */
  @Expose()
  adminName: string | null;
}
