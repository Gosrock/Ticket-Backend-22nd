import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class EnterReportDto {
  @ApiProperty({
    description: '입장 확인된 티켓',
    type: Number
  })
  @IsNumber()
  @Expose()
  enteredTicket: number;

  @ApiProperty({
    description: '입장 확인 안된 티켓',
    type: Number
  })
  @IsNumber()
  @Expose()
  nonEnteredTicket: number;
}
