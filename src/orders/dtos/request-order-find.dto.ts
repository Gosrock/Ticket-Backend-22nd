import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { OrderDate, OrderStatus } from 'src/common/consts/enum';

export class RequestOrderFindDto {
  @ApiProperty({
    description: '주문 상태',
    enum: OrderStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  @Expose()
  readonly status: OrderStatus;

  @ApiProperty({
    description: '선택한 공연 날짜',
    enum: OrderDate,
    required: false
  })
  @IsOptional()
  @IsEnum(OrderDate)
  @Expose()
  readonly selection: OrderDate;

  @ApiProperty({
    description: '공짜 티켓 여부',
    type: Boolean,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isFree: boolean;
}
