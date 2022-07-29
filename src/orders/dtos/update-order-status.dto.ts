import { UsePipes } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { OrderStatus } from 'src/common/consts/enum';
import { OrderIdValidationPipe } from 'src/common/pipes/orderId-validation.pipe';

export class UpdateOrderStatusDto {
  @ApiProperty({ description: '주문 번호', type: Number })
  @IsNumber()
  @Expose()
  orderId: number;

  @ApiProperty({ description: '주문 상태', enum: OrderStatus })
  @IsEnum(OrderStatus)
  @Expose()
  status: OrderStatus;
}
