import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PerformanceDate, TicketStatus } from '../consts/enum';

export class TicketFindDto {
  @ApiProperty({
    description: '티켓 상태',
    enum: TicketStatus,
    required: false
  })
  @IsEnum(TicketStatus)
  @IsOptional()
  @Expose()
  readonly status: TicketStatus;

  @ApiProperty({
    description: '공연 날짜',
    enum: PerformanceDate,
    required: false
  })
  @IsEnum(PerformanceDate)
  @IsOptional()
  @Expose()
  readonly date: PerformanceDate;
}
