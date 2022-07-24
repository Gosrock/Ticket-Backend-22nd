import { Expose } from 'class-transformer';

/**
 * 티켓의 상태가 변경되면 알림을 주기위한 함수의 DTO
 */
export class SlackTicketStateChangeDto {
  /**
   * 생성자
   * @param ticketId  ticket.id
   * @param userName  ticket.user.name
   * @param ticketStatus ticket.status
   * @param adminName ticket.admin?.name
   */
  constructor(
    ticketId: number,
    userName: string,
    ticketStatus: number,
    adminName: string | null
  ) {
    this.ticketId = ticketId;
    this.userName = userName;
    this.ticketStatus = ticketStatus;
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
   * 티켓 상태
   */
  @Expose()
  ticketStatus: number;

  /**
   * 관리자 명
   */
  @Expose()
  adminName: string | null;
}
