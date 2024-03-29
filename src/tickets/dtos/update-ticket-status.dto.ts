import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { TicketStatus } from 'src/common/consts/enum';

export class UpdateTicketStatusDto {
  @ApiProperty({ description: '티켓 아이디', type: Number })
  @IsNumber()
  @Expose()
  ticketId: number;

  @ApiProperty({ description: '티켓 상태', enum: TicketStatus })
  @IsEnum(TicketStatus)
  @Expose()
  status: TicketStatus;
}
