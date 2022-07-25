import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsBoolean, IsString } from 'class-validator';
import { PerformanceDate, TicketStatus } from 'src/common/consts/enum';
import { Ticket } from 'src/database/entities/ticket.entity';

/**
 * @param uuid 티켓의 uuid
 * @param success 입장 시도 성공 여부
 * @param status 티켓 상태
 * @param message 메세지
 * @param admin 티켓 입장 처리한 어드민
 */
export class TicketEntryResponseDto {
  @ApiProperty({ description: '티켓 uuid', type: String })
  @IsString()
  @Expose()
  uuid: string;

  @ApiProperty({ description: '입장 성공 여부', type: Boolean })
  @IsBoolean()
  @Expose()
  success: boolean;

  @ApiProperty({ description: '공연 날짜', enum: PerformanceDate })
  @IsEnum(PerformanceDate)
  @Expose()
  date: PerformanceDate;

  @ApiProperty({ description: '티켓 상태', enum: TicketStatus })
  @IsEnum(TicketStatus)
  @Expose()
  ticketStatus: TicketStatus;

  @ApiProperty({ description: '메세지', type: String })
  @IsString()
  @Expose()
  message: string;

  @ApiProperty({ description: '유저 이름', type: String })
  @IsString()
  @Expose()
  name?: string;

  @ApiProperty({ description: '유저 휴대폰 번호', type: String })
  @IsString()
  @Expose()
  phoneNumber?: string;

  @ApiProperty({ description: '처리한 어드민 정보', type: String })
  @IsString()
  @Expose()
  adminName: string;

  constructor(
    ticket: Ticket,
    adminName: string,
    success: boolean,
    message?: string
  ) {
    this.success = success;
    this.message = message ?? '';
    this.uuid = ticket.uuid;
    this.date = ticket.date;
    this.ticketStatus = ticket.status;
    this.name = ticket?.user.name;
    this.phoneNumber = ticket?.user.phoneNumber;
    this.adminName = adminName;
  }
}
