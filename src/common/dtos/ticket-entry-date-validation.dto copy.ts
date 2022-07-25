import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { PerformanceDate } from '../consts/enum';

/**
 * @param date 티켓 날짜
 */
export class TicketEntryDateValidationDto {
  @ApiProperty({ description: '공연 날짜', enum: PerformanceDate })
  @IsEnum(PerformanceDate)
  @Expose()
  date: PerformanceDate;
}
