import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { EnterReportDto } from './enter-report.dto';
import { OrderReportDto } from './order-report.dto';
import { TicketReportDto } from './ticket-report.dto';

export class ReportDto {
  @ApiProperty({
    description: '주문 입금 관련 현황',
    type: OrderReportDto
  })
  @Type(() => OrderReportDto)
  @Expose()
  orderReport: OrderReportDto;

  @ApiProperty({
    description: '티켓 관련 현황',
    type: TicketReportDto
  })
  @Type(() => TicketReportDto)
  @Expose()
  ticketReport: TicketReportDto;

  @ApiProperty({
    description: '입장 관련 현황',
    type: EnterReportDto
  })
  @Type(() => EnterReportDto)
  @Expose()
  enterReport: EnterReportDto;

  @ApiProperty({
    description: '판매 대금',
    type: Number
  })
  @Expose()
  income: number;

  @ApiProperty({
    description: '공짜 티켓 갯수',
    type: Number
  })
  @Expose()
  freeTicket: number;
}
