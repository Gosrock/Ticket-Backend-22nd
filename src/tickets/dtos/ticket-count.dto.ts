import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

/** /tickets/count에 대한 Swagger 응답을 위한 dto 입니다 */
export class TicketCountDto {
  @ApiProperty({
    description: 'DB에 저장된 티켓의 총 개수',
  })
  @IsNumber()
  @Expose()
  readonly count: number;
}
