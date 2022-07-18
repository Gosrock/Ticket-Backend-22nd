import { PickType, PartialType, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Ticket } from 'src/database/entities/ticket.entity';
import { PerformanceDate, TicketStatus } from '../consts/enum';

export class FindTicketDto {
  @ApiProperty({
    description: '티켓 상태',
    enum: TicketStatus,
    required: false
  })
  @IsOptional()
  @Expose()
  readonly status: TicketStatus;

  @ApiProperty({
    description: '공연 날짜',
    enum: PerformanceDate,
    required: false
  })
  @IsOptional()
  @Expose()
  readonly date: PerformanceDate;
}
