import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PerformanceDate } from 'src/common/consts/enum';

export class CreateTicketDto {
  @ApiProperty({
    description: '공연일자',
    enum: PerformanceDate
  })
  @Expose()
  date: PerformanceDate;
}
