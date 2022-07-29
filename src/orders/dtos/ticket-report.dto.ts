import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class TicketReportDto {
  @ApiProperty({
    description: '링크 발급된 총 티켓 수',
    type: Number
  })
  @IsNumber()
  @Expose()
  totalTicket: number;

  @ApiProperty({
    description: '입금 확인된 티켓',
    type: Number
  })
  @IsNumber()
  @Expose()
  depositedTicket: number;
}
