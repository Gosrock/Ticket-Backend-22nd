import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class OrderReportDto {
  // 입금 상태 별 주문 수
  @ApiProperty({
    description: '총 주문 수',
    type: Number
  })
  @IsNumber()
  @Expose()
  totalOrder: number;

  @ApiProperty({
    description: '확인대기',
    type: Number
  })
  @IsNumber()
  @Expose()
  waitOrder: number;

  @ApiProperty({
    description: '입금확인',
    type: Number
  })
  @IsNumber()
  @Expose()
  doneOrder: number;

  @ApiProperty({
    description: '기한만료',
    type: Number
  })
  @IsNumber()
  @Expose()
  expireOrder: number;
}
