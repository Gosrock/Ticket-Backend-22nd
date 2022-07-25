import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, isNotEmpty, IsNumber } from "class-validator";
import { Order } from "src/database/entities/order.entity";
import { OrderDate } from "../../common/consts/enum";

export class RequestOrderDto {
	@ApiProperty({ description: '공연일자', enum: OrderDate })
	@IsEnum(OrderDate)
	@Expose()
	selection: OrderDate;

	@ApiProperty({ description: '티켓수량', type: Number })
	@IsNumber()
	@Expose()
	ticketCount: number;
}