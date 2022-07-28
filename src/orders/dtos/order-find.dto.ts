import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { OrderDate, OrderStatus } from 'src/common/consts/enum';

export class OrderFindDto {
  @ApiProperty({
    description: '주문 상태',
    enum: OrderStatus,
    required: false
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  @Expose()
  readonly status: OrderStatus;

  @ApiProperty({
    description: '선택한 공연 날짜',
    enum: OrderDate,
    required: false
  })
  @IsEnum(OrderDate)
  @IsOptional()
  @Expose()
  readonly selection: OrderDate;

  @ApiProperty({
    description: '공짜 티켓 여부',
    type: Boolean,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  readonly isFree: boolean;
}
